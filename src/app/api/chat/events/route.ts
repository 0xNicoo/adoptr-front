import { Client } from "@stomp/stompjs";
import { getAccessToken } from "@/lib/auth/session";
import { ChatEvent } from "@/lib/api/models/chat/chat";
import { CHAT_SSE, SSE_KEEPALIVE, SSE_RETRY_MS, brokerUrl, sseEvent } from "@/lib/chat/sse";

// Puente de tiempo real del chat. El back emite los mensajes por WebSocket (STOMP) y pide el JWT en el
// frame CONNECT, pero el JWT solo vive en la cookie HttpOnly: no puede llegar al navegador. Por eso el
// servidor de Next abre el WebSocket con la cookie y le reenvía los eventos al navegador por Server-Sent
// Events (mismo origen, la cookie viaja sola). Una conexión al back por pestaña abierta en /chats.
// Necesita un servidor Node de larga duración (no serverless) con WebSocket global (Node 22 o más).

export const dynamic = "force-dynamic";

const KEEPALIVE_MS = 20_000;
const HEARTBEAT_MS = 10_000;
const encoder = new TextEncoder();

export async function GET(request: Request) {
  const token = await getAccessToken();
  if (!token) return new Response(null, { status: 401 });
  const apiUrl = process.env.API_URL;
  if (!apiUrl || typeof WebSocket === "undefined") {
    console.error("Chat en tiempo real: falta API_URL o WebSocket global (Node 22 o más)");
    return new Response(null, { status: 503 });
  }

  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const send = (chunk: string) => {
        if (!closed) controller.enqueue(encoder.encode(chunk));
      };

      const stomp = new Client({
        brokerURL: brokerUrl(apiUrl),
        connectHeaders: { Authorization: `Bearer ${token}` },
        heartbeatIncoming: HEARTBEAT_MS,
        heartbeatOutgoing: HEARTBEAT_MS,
        // Si se corta, se cierra el stream y el navegador reconecta solo (y recarga lo perdido).
        reconnectDelay: 0,
        onConnect: () => {
          stomp.subscribe("/user/queue/chat", (frame) => {
            let event: ChatEvent;
            try {
              event = JSON.parse(frame.body);
            } catch {
              return;
            }
            if (event.type === "MESSAGE" && event.message) send(sseEvent(CHAT_SSE.MESSAGE, event.message));
          });
          send(sseEvent(CHAT_SSE.READY, {}));
        },
        onStompError: (frame) => {
          if (frame.headers.message === "UNAUTHENTICATED") send(sseEvent(CHAT_SSE.UNAUTHENTICATED, {}));
          close();
        },
        onWebSocketClose: () => close(),
        onWebSocketError: () => close(),
      });

      const keepalive = setInterval(() => send(SSE_KEEPALIVE), KEEPALIVE_MS);

      function close() {
        if (closed) return;
        closed = true;
        clearInterval(keepalive);
        request.signal.removeEventListener("abort", close);
        void stomp.deactivate();
        try {
          controller.close();
        } catch {
          // Ya cerrado por el navegador.
        }
      }

      cleanup = close;
      request.signal.addEventListener("abort", close);
      send(`retry: ${SSE_RETRY_MS}\n\n`);
      stomp.activate();
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
