"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadOlderMessagesAction,
  markReadAction,
  openConversationAction,
  reloadInboxAction,
  sendMessageAction,
} from "@/actions/chat";
import { ChatMessage, Conversation } from "@/lib/api/models/chat/chat";
import { ChatTab, chatsHref, parseChatQuery, tabOf } from "@/lib/chat/chat-query";
import { applyIncomingMessage, chatErrorMessage, isOwnMessage, mergeMessages, sortConversations, unreadTotal } from "@/lib/chat/inbox";
import { announceUnread } from "@/lib/chat/unread-event";
import ConversationPanel, { Thread } from "./conversation-panel";
import InboxPanel from "./inbox-panel";
import { useChatEvents } from "./use-chat-events";

type ThreadState = Thread & { conversation: Conversation };

export interface InitialChat {
  conversation: Conversation;
  thread: Thread;
}

function markRead(conversations: Conversation[], id: number): Conversation[] {
  return conversations.map((conversation) => (conversation.id === id ? { ...conversation, unreadCount: 0 } : conversation));
}

export default function ChatView({
  initialConversations,
  initialChat,
  defaultTab,
  today,
}: {
  initialConversations: Conversation[];
  initialChat: InitialChat | null;
  /** Bandeja si la URL no la dice: la de la actividad más reciente. */
  defaultTab: ChatTab;
  today: string;
}) {
  const query = parseChatQuery(useSearchParams());
  const [conversations, setConversations] = useState(initialConversations);
  const [threads, setThreads] = useState<Record<number, ThreadState>>(
    initialChat ? { [initialChat.conversation.id]: { ...initialChat.thread, conversation: initialChat.conversation } } : {},
  );
  const [failed, setFailed] = useState<Record<number, string>>({});

  const openId = query.chat;
  const listed = openId ? conversations.find((conversation) => conversation.id === openId) : undefined;
  const thread = openId ? threads[openId] : undefined;
  // La de la bandeja está al día (último mensaje, solo lectura); la del hilo sirve si no está en la lista.
  const open = listed ?? thread?.conversation ?? null;
  const tab = query.tab ?? (open ? tabOf(open.role) : defaultTab);
  const openRef = useRef(openId);
  const conversationsRef = useRef(conversations);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Cambiar de chat o de bandeja sin pedirle la página al servidor: la URL es el estado.
  const navigate = useCallback((href: string) => {
    window.history.pushState(null, "", href);
  }, []);

  const loadThread = useCallback(async (id: number) => {
    const result = await openConversationAction(id);
    if (!result.ok) {
      setFailed((current) => ({ ...current, [id]: result.code }));
      return;
    }
    const { conversation, messages, facts } = result.opened;
    setThreads((current) => ({
      ...current,
      [id]: {
        conversation,
        facts,
        hasMore: current[id]?.hasMore ?? messages.hasMore,
        messages: mergeMessages(current[id]?.messages ?? [], messages.items),
      },
    }));
  }, []);

  // Chat abierto: cargar si hace falta y marcar como leído. También al volver a la pestaña.
  useEffect(() => {
    openRef.current = openId;
    if (!openId) return;
    if (!threads[openId] && !failed[openId]) void loadThread(openId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambiar de chat
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const read = () => {
      if (document.visibilityState !== "visible") return;
      void markReadAction(openId).then((result) => {
        if (result.ok) setConversations((current) => markRead(current, openId));
      });
    };
    read();
    document.addEventListener("visibilitychange", read);
    return () => document.removeEventListener("visibilitychange", read);
  }, [openId]);

  useEffect(() => {
    announceUnread(unreadTotal(conversations));
  }, [conversations]);

  const reloadInbox = useCallback(async () => {
    const result = await reloadInboxAction();
    if (!result.ok) return;
    const current = openRef.current;
    const visible = document.visibilityState === "visible";
    setConversations(sortConversations(result.conversations.map((c) => (c.id === current && visible ? { ...c, unreadCount: 0 } : c))));
  }, []);

  const { state: connection, retry } = useChatEvents({
    onMessage: (message: ChatMessage) => {
      const current = openRef.current;
      const readNow = message.conversationId === current && document.visibilityState === "visible";
      const known = conversationsRef.current.find((c) => c.id === message.conversationId);
      setThreads((all) => {
        const existing = all[message.conversationId];
        return existing
          ? { ...all, [message.conversationId]: { ...existing, messages: mergeMessages(existing.messages, [message]) } }
          : all;
      });
      if (!known) {
        // Alguien escribió por primera vez: la conversación todavía no está en la bandeja.
        void reloadInbox();
        return;
      }
      setConversations((list) => applyIncomingMessage(list, message, readNow) ?? list);
      if (readNow && !isOwnMessage(message, known)) void markReadAction(message.conversationId);
    },
    onReconnect: () => {
      void reloadInbox();
      if (openRef.current) void loadThread(openRef.current);
    },
  });

  async function loadOlder() {
    if (!openId || !thread || thread.messages.length === 0) return;
    const result = await loadOlderMessagesAction(openId, thread.messages[0].id);
    if (!result.ok) return;
    setThreads((all) => {
      const existing = all[openId];
      if (!existing) return all;
      return {
        ...all,
        [openId]: { ...existing, hasMore: result.page.hasMore, messages: mergeMessages(existing.messages, result.page.items) },
      };
    });
  }

  async function send(body: string): Promise<string | null> {
    if (!open) return null;
    const result = await sendMessageAction(open.id, body);
    if (!result.ok) {
      if (result.code === "CHAT_READ_ONLY") {
        setConversations((list) => list.map((c) => (c.id === open.id ? { ...c, readOnly: true } : c)));
      }
      return chatErrorMessage(result.code);
    }
    const message = result.message;
    setConversations((list) => applyIncomingMessage(list, message, true) ?? list);
    setThreads((all) => {
      const existing = all[open.id];
      return existing ? { ...all, [open.id]: { ...existing, messages: mergeMessages(existing.messages, [message]) } } : all;
    });
    return null;
  }

  const backHref = chatsHref({ tab, pet: tab === "mine" ? (query.pet ?? open?.publication.id ?? null) : null });
  const banner =
    connection === "reconnecting" || connection === "closed" || connection === "unauthenticated" ? (
      <ConnectionBanner state={connection} onRetry={retry} />
    ) : null;

  return (
    <div className="grid h-[min(760px,calc(100dvh-16rem))] min-h-[480px] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-card border-3 border-ink bg-surface shadow-panel md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
      <section
        aria-label="Conversaciones"
        className={`min-h-0 border-ink md:block md:border-r-3 ${openId ? "hidden" : "block"}`}
      >
        <InboxPanel
          conversations={conversations}
          tab={tab}
          pet={query.pet ?? (tab === "mine" && open ? open.publication.id : null)}
          openId={openId}
          onNavigate={navigate}
        />
      </section>

      <section aria-label="Chat" className={`min-h-0 ${openId ? "block" : "hidden md:block"}`}>
        {!openId ? (
          <Placeholder banner={banner} />
        ) : open && thread ? (
          <ConversationPanel
            conversation={open}
            thread={thread}
            today={today}
            backHref={backHref}
            onBack={navigate}
            onLoadOlder={loadOlder}
            onSend={send}
            banner={banner}
          />
        ) : failed[openId] ? (
          <Placeholder title="No pudimos abrir esta conversación" text="Puede que no exista o que no participes en ella." />
        ) : (
          <p role="status" className="flex h-full items-center justify-center text-ink-soft">
            Cargando conversación…
          </p>
        )}
      </section>
    </div>
  );
}

function Placeholder({ title, text, banner }: { title?: string; text?: string; banner?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      {banner}
      <div className="halftone flex flex-1 flex-col items-center justify-center gap-2 bg-paper p-8 text-center">
        <p className="font-display text-3xl text-primary">{title ?? "Elegí una conversación"}</p>
        <p className="max-w-sm text-[15px] text-ink-soft">
          {text ?? "Los mensajes nuevos llegan al instante, sin recargar la página."}
        </p>
      </div>
    </div>
  );
}

function ConnectionBanner({ state, onRetry }: { state: "reconnecting" | "closed" | "unauthenticated"; onRetry: () => void }) {
  return (
    <div role="status" className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-ink bg-accent-mustard px-4 py-2 text-sm font-semibold">
      {state === "unauthenticated" ? (
        <>
          Tu sesión venció: no vas a recibir mensajes nuevos.
          <a href="/login" className="underline underline-offset-3">
            Ingresar de nuevo
          </a>
        </>
      ) : state === "reconnecting" ? (
        "Se cortó la conexión. Reconectando…"
      ) : (
        <>
          No pudimos conectarnos para recibir mensajes nuevos.
          <button type="button" onClick={onRetry} className="cursor-pointer underline underline-offset-3">
            Reintentar
          </button>
        </>
      )}
    </div>
  );
}
