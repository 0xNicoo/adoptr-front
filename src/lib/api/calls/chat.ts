import 'server-only';
import { getAccessToken } from '@/lib/auth/session';
import { ApiError, apiRequest } from '../api';
import { ChatMessage, ChatRole, Conversation, MessagePage } from '../models/chat/chat';
import { Page } from '../models/page/page';

/** Máximo del back por página. */
const PAGE_SIZE = 50;
/** Tope de páginas al armar una bandeja completa (200 conversaciones). */
const MAX_PAGES = 4;

function required<T>(data: T | null, what: string): T {
  if (data === null) throw new Error(`${what}: el back no devolvió datos`);
  return data;
}

async function listPage(role: ChatRole | null, page: number, publicationId?: number): Promise<Page<Conversation>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (role) params.set('role', role);
  if (publicationId) params.set('publicationId', String(publicationId));
  const response = await apiRequest<Page<Conversation>>(`/conversations?${params}`);
  return required(response.data, 'Conversaciones');
}

/** Una bandeja entera (hasta 200), de la actividad más reciente a la más vieja. */
export async function listConversations(role: ChatRole): Promise<Conversation[]> {
  const first = await listPage(role, 0);
  const rest = await Promise.all(
    Array.from({ length: Math.min(first.totalPages, MAX_PAGES) - 1 }, (_, i) => listPage(role, i + 1)),
  );
  return [first, ...rest].flatMap((page) => page.items);
}

/** Conversación de quien mira por esa publicación ajena, o `null` si todavía no escribió. */
export async function findMyConversation(publicationId: number): Promise<Conversation | null> {
  return (await listPage(ChatRole.INTERESTED, 0, publicationId)).items[0] ?? null;
}

/** No leídos de las dos bandejas, para la navbar. Sin sesión o si falla, 0: no tiene que romper la página. */
export async function getUnreadChatCount(): Promise<number> {
  if (!(await getAccessToken())) return 0;
  try {
    const page = await listPage(null, 0);
    return page.items.reduce((total, conversation) => total + conversation.unreadCount, 0);
  } catch {
    return 0;
  }
}

/** `null` si no existe o quien mira no participa (el back no distingue los dos casos). */
export async function getConversation(id: number): Promise<Conversation | null> {
  try {
    return required((await apiRequest<Conversation>(`/conversations/${id}`)).data, 'Conversación');
  } catch (error) {
    if (error instanceof ApiError && error.code === 'CHAT_CONVERSATION_NOT_FOUND') return null;
    throw error;
  }
}

export async function getMessages(id: number, before?: number): Promise<MessagePage> {
  const params = new URLSearchParams({ pageSize: '30' });
  if (before) params.set('before', String(before));
  return required((await apiRequest<MessagePage>(`/conversations/${id}/messages?${params}`)).data, 'Mensajes');
}

/** 201 si crea la conversación, 200 si ya existía: en los dos casos devuelve la conversación. */
export async function startConversation(publicationId: number, body: string): Promise<Conversation> {
  return required(
    (await apiRequest<Conversation>('/conversations', 'POST', { publicationId, body })).data,
    'Inicio de conversación',
  );
}

export async function sendMessage(id: number, body: string): Promise<ChatMessage> {
  return required((await apiRequest<ChatMessage>(`/conversations/${id}/messages`, 'POST', { body })).data, 'Mensaje');
}

export async function markConversationRead(id: number): Promise<void> {
  await apiRequest<void>(`/conversations/${id}/read`, 'PUT');
}
