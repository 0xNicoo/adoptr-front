import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { ChatMessage, ChatRole, Conversation, ConversationPublication } from "@/lib/api/models/chat/chat";

// Bandeja y mensajes del chat: agrupado, orden, mensajes que llegan en tiempo real y textos.

export const MAX_MESSAGE_LENGTH = 2000;

/** Más reciente primero; a igual fecha, el id más alto. */
function byActivity(a: Conversation, b: Conversation): number {
  return b.lastMessageAt.localeCompare(a.lastMessageAt) || b.id - a.id;
}

export function sortConversations(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort(byActivity);
}

export interface PublicationGroup {
  publication: ConversationPublication;
  conversations: Conversation[];
  unreadCount: number;
  lastMessageAt: string;
}

/** «Mis publicaciones»: primero se elige la mascota y después la persona. */
export function groupByPublication(conversations: Conversation[]): PublicationGroup[] {
  const groups = new Map<number, PublicationGroup>();
  for (const conversation of sortConversations(conversations)) {
    const group = groups.get(conversation.publication.id);
    if (group) {
      group.conversations.push(conversation);
      group.unreadCount += conversation.unreadCount;
    } else {
      groups.set(conversation.publication.id, {
        publication: conversation.publication,
        conversations: [conversation],
        unreadCount: conversation.unreadCount,
        lastMessageAt: conversation.lastMessageAt,
      });
    }
  }
  return [...groups.values()];
}

export function unreadTotal(conversations: Conversation[], role?: ChatRole): number {
  return conversations
    .filter((conversation) => !role || conversation.role === role)
    .reduce((total, conversation) => total + conversation.unreadCount, 0);
}

export function isOwnMessage(message: ChatMessage, conversation: { role: ChatRole }): boolean {
  return message.senderRole === conversation.role;
}

/**
 * Suma un mensaje a la bandeja: último mensaje, orden y no leídos. Devuelve `null` si la conversación
 * no está en la lista (alguien escribió por primera vez): hay que recargar la bandeja.
 * `readNow`: la conversación está abierta y a la vista, así que no suma a los no leídos.
 */
export function applyIncomingMessage(
  conversations: Conversation[],
  message: ChatMessage,
  readNow: boolean,
): Conversation[] | null {
  const current = conversations.find((conversation) => conversation.id === message.conversationId);
  if (!current) return null;
  if (current.lastMessage && current.lastMessage.id >= message.id) return conversations;
  const own = isOwnMessage(message, current);
  const updated: Conversation = {
    ...current,
    lastMessage: message,
    lastMessageAt: message.createdAt,
    // Enviar marca lo anterior como leído; leerlo con el chat abierto, también.
    unreadCount: own || readNow ? 0 : current.unreadCount + 1,
  };
  return sortConversations(conversations.map((conversation) => (conversation.id === updated.id ? updated : conversation)));
}

/** Une mensajes sin repetir (el mismo llega por el `POST` y por el tiempo real) y en orden. */
export function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.id - b.id);
}

/** «Vos: …» si lo mandó quien mira, si no «Juan Pérez: …». */
export function lastMessagePreview(conversation: Conversation): string {
  const message = conversation.lastMessage;
  if (!message) return "";
  const author = isOwnMessage(message, conversation) ? "Vos" : conversation.counterpart.displayName;
  return `${author}: ${message.body.replace(/\s+/g, " ").trim()}`;
}

export function publicationName(publication: ConversationPublication): string {
  return publication.petName ?? "Publicación";
}

/** Estado de la publicación en la bandeja, sin género (el chat no trae el sexo de la mascota). */
export function publicationStatusLabel(publication: ConversationPublication): string {
  if (publication.deleted) return "Dada de baja";
  if (publication.status === AdoptionStatus.ADOPTED) return "Ya tiene familia";
  return "En adopción";
}

export function readOnlyReason(publication: ConversationPublication): string {
  const name = publicationName(publication);
  return publication.deleted
    ? `La publicación de ${name} fue dada de baja: podés leer la conversación, pero ya no se pueden mandar mensajes.`
    : `${name} ya tiene familia: podés leer la conversación, pero ya no se pueden mandar mensajes.`;
}

/** Subtítulo del encabezado del chat. */
export function counterpartSubtitle(conversation: Conversation): string {
  const name = publicationName(conversation.publication);
  return conversation.role === ChatRole.INTERESTED ? `Publicó a ${name}` : `Le interesa ${name}`;
}

export function chatErrorMessage(code: string): string {
  switch (code) {
    case "CHAT_READ_ONLY":
      return "Esta publicación ya no está en adopción: no se pueden mandar mensajes.";
    case "CHAT_OWN_PUBLICATION":
      return "No podés escribirte por tu propia publicación.";
    case "PUBLICATION_NOT_FOUND":
      return "Esta publicación ya no existe.";
    case "CHAT_CONFLICT":
      return "No pudimos mandar el mensaje. Probá de nuevo.";
    case "VALIDATION_ERROR":
      return `El mensaje no puede estar vacío ni superar los ${MAX_MESSAGE_LENGTH} caracteres.`;
    case "CHAT_CONVERSATION_NOT_FOUND":
      return "No encontramos esta conversación.";
    default:
      return "No pudimos mandar el mensaje. Revisá tu conexión y probá de nuevo.";
  }
}
