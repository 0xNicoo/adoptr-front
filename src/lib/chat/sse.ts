// Formato Server-Sent Events del puente de tiempo real (src/app/api/chat/events/route.ts).

/** Eventos que recibe el navegador. */
export const CHAT_SSE = {
  /** Conectado con el back: al reconectar, recargar bandeja e historial (el back no reenvía lo perdido). */
  READY: "ready",
  MESSAGE: "message",
  /** El back rechazó la sesión: no reconectar. */
  UNAUTHENTICATED: "unauthenticated",
} as const;

/** Espera del navegador antes de reconectar si se corta. */
export const SSE_RETRY_MS = 3000;

export function sseEvent(event: string, data: unknown): string {
  // JSON.stringify no deja saltos de línea sueltos, así que el evento ocupa una sola línea `data:`.
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

/** Comentario: mantiene viva la conexión a través de proxies sin disparar eventos. */
export const SSE_KEEPALIVE = ": keepalive\n\n";

/** `http://api:8081` → `ws://api:8081/ws`; `https://…` → `wss://…/ws`. */
export function brokerUrl(apiUrl: string): string {
  const url = new URL("/ws", apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}
