import { ChatRole } from "@/lib/api/models/chat/chat";

// Estado de /chats en la URL: bandeja, publicación elegida (solo en «Mis publicaciones») y chat abierto.
// /chats?tab=mine&pet=74&chat=14 · /chats?tab=others&chat=9

export const CHATS_PATH = "/chats";

export type ChatTab = "mine" | "others";

export const TAB_ROLE: Record<ChatTab, ChatRole> = { mine: ChatRole.OWNER, others: ChatRole.INTERESTED };

export function tabOf(role: ChatRole): ChatTab {
  return role === ChatRole.OWNER ? "mine" : "others";
}

export interface ChatQuery {
  /** `null`: no vino en la URL; la página elige según la actividad más reciente. */
  tab: ChatTab | null;
  pet: number | null;
  chat: number | null;
}

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

function read(params: Params, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function positiveId(raw: string | undefined): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return id > 0 && Number.isSafeInteger(id) ? id : null;
}

export function parseChatQuery(params: Params): ChatQuery {
  const rawTab = read(params, "tab");
  const tab = rawTab === "mine" || rawTab === "others" ? rawTab : null;
  return { tab, pet: tab === "mine" ? positiveId(read(params, "pet")) : null, chat: positiveId(read(params, "chat")) };
}

export function chatsHref({ tab, pet, chat }: Partial<ChatQuery>): string {
  const params = new URLSearchParams();
  if (tab) params.set("tab", tab);
  if (tab === "mine" && pet) params.set("pet", String(pet));
  if (chat) params.set("chat", String(chat));
  const query = params.toString();
  return query ? `${CHATS_PATH}?${query}` : CHATS_PATH;
}

/** Link directo a una conversación, en la bandeja que le corresponde. */
export function conversationHref(conversation: { id: number; role: ChatRole; publication: { id: number } }): string {
  const tab = tabOf(conversation.role);
  return chatsHref({ tab, pet: tab === "mine" ? conversation.publication.id : null, chat: conversation.id });
}
