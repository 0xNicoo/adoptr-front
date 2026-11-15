"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/lib/api/models/chat/chat";
import { CHAT_SSE } from "@/lib/chat/sse";

export type ConnectionState = "connecting" | "open" | "reconnecting" | "closed" | "unauthenticated";

interface Handlers {
  onMessage: (message: ChatMessage) => void;
  /** Volvió la conexión después de un corte: el back no reenvía lo perdido, hay que recargar. */
  onReconnect: () => void;
}

/**
 * Mensajes en tiempo real desde el puente /api/chat/events (SSE, con la cookie de sesión).
 * `EventSource` reconecta solo; si el servidor lo rechaza (401, 503) queda cerrado y se puede reintentar.
 */
export function useChatEvents(handlers: Handlers) {
  const [state, setState] = useState<ConnectionState>("connecting");
  const [attempt, setAttempt] = useState(0);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const source = new EventSource("/api/chat/events");
    let connectedBefore = false;

    source.addEventListener(CHAT_SSE.READY, () => {
      setState("open");
      if (connectedBefore) handlersRef.current.onReconnect();
      connectedBefore = true;
    });
    source.addEventListener(CHAT_SSE.MESSAGE, (event) => {
      try {
        handlersRef.current.onMessage(JSON.parse((event as MessageEvent<string>).data));
      } catch {
        // Un evento ilegible no tiene que romper el chat.
      }
    });
    source.addEventListener(CHAT_SSE.UNAUTHENTICATED, () => {
      source.close();
      setState("unauthenticated");
    });
    source.onerror = () => {
      setState((current) =>
        current === "unauthenticated" ? current : source.readyState === EventSource.CLOSED ? "closed" : "reconnecting",
      );
    };
    return () => source.close();
  }, [attempt]);

  return {
    state,
    retry: () => {
      setState("connecting");
      setAttempt((n) => n + 1);
    },
  };
}
