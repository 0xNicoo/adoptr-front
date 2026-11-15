// La navbar se dibuja en el servidor: mientras /chats está abierto, la pantalla le avisa el total de
// no leídos con este evento del navegador para que el contador no quede viejo.

export const CHAT_UNREAD_EVENT = "adoptr:chat-unread";

export function announceUnread(total: number) {
  window.dispatchEvent(new CustomEvent<number>(CHAT_UNREAD_EVENT, { detail: total }));
}
