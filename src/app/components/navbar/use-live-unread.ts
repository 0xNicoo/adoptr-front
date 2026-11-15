"use client";

import { useEffect, useState } from "react";
import { CHAT_UNREAD_EVENT } from "@/lib/chat/unread-event";

/** No leídos del servidor, actualizados en vivo mientras /chats está abierto. */
export function useLiveUnread(initial: number): number {
  const [live, setLive] = useState<number | null>(null);
  useEffect(() => {
    const update = (event: Event) => setLive((event as CustomEvent<number>).detail);
    window.addEventListener(CHAT_UNREAD_EVENT, update);
    return () => window.removeEventListener(CHAT_UNREAD_EVENT, update);
  }, []);
  return live ?? initial;
}
