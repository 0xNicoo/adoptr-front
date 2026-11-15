import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/api";
import { getConversation, getMessages, listConversations } from "@/lib/api/calls/chat";
import { ChatRole, Conversation } from "@/lib/api/models/chat/chat";
import { parseChatQuery, tabOf } from "@/lib/chat/chat-query";
import { publicationFacts } from "@/lib/chat/facts";
import { sortConversations } from "@/lib/chat/inbox";
import { todayInArgentina } from "@/lib/chat/time";
import ChatView, { InitialChat } from "./chat-view";

export const metadata: Metadata = {
  title: "Mis chats — Adoptr",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Loaded =
  | { kind: "ok"; conversations: Conversation[]; chat: InitialChat | null }
  | { kind: "unauthenticated" }
  | { kind: "error" };

async function load(chatId: number | null): Promise<Loaded> {
  try {
    const [owner, interested] = await Promise.all([
      listConversations(ChatRole.OWNER),
      listConversations(ChatRole.INTERESTED),
    ]);
    const conversations = sortConversations([...owner, ...interested]);
    let chat: InitialChat | null = null;
    if (chatId) {
      const conversation = conversations.find((c) => c.id === chatId) ?? (await getConversation(chatId));
      if (conversation) {
        const [messages, facts] = await Promise.all([getMessages(chatId), publicationFacts(conversation)]);
        chat = { conversation, thread: { messages: messages.items, hasMore: messages.hasMore, facts } };
      }
    }
    // El chat abierto se marca como leído al montar: no mostrarlo con no leídos mientras tanto.
    return {
      kind: "ok",
      conversations: conversations.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)),
      chat,
    };
  } catch (error) {
    return error instanceof ApiError && error.code === "UNAUTHENTICATED" ? { kind: "unauthenticated" } : { kind: "error" };
  }
}

export default async function ChatsPage({ searchParams }: { searchParams: SearchParams }) {
  const query = parseChatQuery(await searchParams);
  const result = await load(query.chat);
  if (result.kind === "unauthenticated") redirect("/login");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-6">
      <header>
        <h1 className="font-display text-[44px] leading-tight text-primary md:text-[52px]">Mis chats</h1>
        <p className="mt-1 text-[17px] text-ink-soft">
          Ordenados por publicación: primero elegís la mascota, después la persona.
        </p>
      </header>
      {result.kind === "error" ? (
        <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h2 className="font-display text-3xl text-primary">No pudimos cargar tus chats</h2>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      ) : (
        <ChatView
          initialConversations={result.conversations}
          initialChat={result.chat}
          defaultTab={result.conversations[0] ? tabOf(result.conversations[0].role) : "others"}
          today={todayInArgentina()}
        />
      )}
    </div>
  );
}
