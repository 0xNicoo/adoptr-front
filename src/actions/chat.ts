'use server';

import { redirect } from 'next/navigation';
import { ApiError, UNKNOWN_ERROR_CODE } from '@/lib/api/api';
import {
  getConversation,
  getMessages,
  listConversations,
  markConversationRead,
  sendMessage,
  startConversation,
} from '@/lib/api/calls/chat';
import { ChatMessage, ChatRole, Conversation, MessagePage } from '@/lib/api/models/chat/chat';
import { clearAccessToken } from '@/lib/auth/session';
import { publicationFacts } from '@/lib/chat/facts';
import { MAX_MESSAGE_LENGTH } from '@/lib/chat/inbox';

type Result<T> = ({ ok: true } & T) | { ok: false; code: string };

/**
 * Corre la llamada y devuelve el `code` del back en vez de lanzar el error (en producción Next
 * oculta el mensaje de los errores que llegan al cliente). Sesión vencida: borra la cookie y va al login.
 */
async function run<T>(call: () => Promise<T>): Promise<Result<{ value: T }>> {
  let code: string;
  try {
    return { ok: true, value: await call() };
  } catch (error) {
    code = error instanceof ApiError ? error.code : UNKNOWN_ERROR_CODE;
  }
  // redirect() lanza una excepción interna de Next, por eso va fuera del try.
  if (code === 'UNAUTHENTICATED') {
    await clearAccessToken();
    redirect('/login');
  }
  if (code === 'PROFILE_REQUIRED') {
    redirect('/profile/new');
  }
  return { ok: false, code };
}

const validId = (id: number) => Number.isSafeInteger(id) && id > 0;

function validBody(body: unknown): string | null {
  if (typeof body !== 'string') return null;
  const text = body.trim();
  return text && text.length <= MAX_MESSAGE_LENGTH ? text : null;
}

/** «Contactar»: crea la conversación con el primer mensaje, o lo suma si ya existía. */
export async function startConversationAction(
  publicationId: number,
  body: string,
): Promise<Result<{ conversation: Conversation }>> {
  const text = validBody(body);
  if (!validId(publicationId) || !text) return { ok: false, code: 'VALIDATION_ERROR' };
  const result = await run(() => startConversation(publicationId, text));
  return result.ok ? { ok: true, conversation: result.value } : result;
}

export async function sendMessageAction(conversationId: number, body: string): Promise<Result<{ message: ChatMessage }>> {
  const text = validBody(body);
  if (!validId(conversationId) || !text) return { ok: false, code: 'VALIDATION_ERROR' };
  const result = await run(() => sendMessage(conversationId, text));
  return result.ok ? { ok: true, message: result.value } : result;
}

export async function markReadAction(conversationId: number): Promise<Result<object>> {
  if (!validId(conversationId)) return { ok: false, code: 'VALIDATION_ERROR' };
  const result = await run(() => markConversationRead(conversationId));
  return result.ok ? { ok: true } : result;
}

export async function loadOlderMessagesAction(conversationId: number, before: number): Promise<Result<{ page: MessagePage }>> {
  if (!validId(conversationId) || !validId(before)) return { ok: false, code: 'VALIDATION_ERROR' };
  const result = await run(() => getMessages(conversationId, before));
  return result.ok ? { ok: true, page: result.value } : result;
}

export interface OpenedConversation {
  conversation: Conversation;
  messages: MessagePage;
  /** «Perro · Grande · Macho · 3 años», o `null` si la publicación no se puede abrir. */
  facts: string | null;
}

/** Abre una conversación: datos, últimos mensajes y ficha. Se usa al elegir un chat y al reconectar. */
export async function openConversationAction(conversationId: number): Promise<Result<{ opened: OpenedConversation }>> {
  if (!validId(conversationId)) return { ok: false, code: 'VALIDATION_ERROR' };
  const result = await run(async () => {
    const [conversation, messages] = await Promise.all([getConversation(conversationId), getMessages(conversationId)]);
    if (!conversation) throw new ApiError(404, 'CHAT_CONVERSATION_NOT_FOUND', 'No se encontró la conversación');
    return { conversation, messages, facts: await publicationFacts(conversation) };
  });
  return result.ok ? { ok: true, opened: result.value } : result;
}

/** Las dos bandejas, para cuando escribe alguien nuevo o al reconectar. */
export async function reloadInboxAction(): Promise<Result<{ conversations: Conversation[] }>> {
  const result = await run(async () => {
    const [owner, interested] = await Promise.all([
      listConversations(ChatRole.OWNER),
      listConversations(ChatRole.INTERESTED),
    ]);
    return [...owner, ...interested];
  });
  return result.ok ? { ok: true, conversations: result.value } : result;
}
