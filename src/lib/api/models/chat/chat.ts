import { AdoptionStatus } from "../adoption/adoption-status";
import { Owner } from "../adoption/owner";
import { Species } from "../adoption/species";

/** Según quién mira: `OWNER` si la publicación es suya (lo contactaron), `INTERESTED` si escribió él. */
export enum ChatRole {
  OWNER = "OWNER",
  INTERESTED = "INTERESTED",
}

export interface ChatMessage {
  /** Crecientes: ordenan los mensajes. */
  id: number;
  conversationId: number;
  /** Igual para los dos participantes: el mensaje es propio si coincide con el `role` de la conversación. */
  senderRole: ChatRole;
  body: string;
  /** ISO local sin zona (hora de Argentina). */
  createdAt: string;
}

/** La publicación sobre la que se conversa. `petName`, `species` y `status` son `null` si no es de adopción. */
export interface ConversationPublication {
  id: number;
  type: string;
  petName: string | null;
  species: Species | null;
  status: AdoptionStatus | null;
  coverPhotoUrl: string | null;
  /** Fue dada de baja: su detalle ya no se puede abrir. */
  deleted: boolean;
}

/** Conversación vista por quien consulta (`GET /conversations` y `GET /conversations/{id}`). */
export interface Conversation {
  id: number;
  role: ChatRole;
  publication: ConversationPublication;
  /** La otra persona, con los mismos datos públicos que el responsable de una publicación. */
  counterpart: Owner;
  lastMessage: ChatMessage | null;
  /** Mensajes de la otra persona todavía no marcados como leídos. */
  unreadCount: number;
  /** La publicación ya no está en adopción: se lee el historial pero no se puede escribir. */
  readOnly: boolean;
  createdAt: string;
  lastMessageAt: string;
}

/** `items` del más viejo al más nuevo; para seguir hacia atrás, `before` = id del primero. */
export interface MessagePage {
  items: ChatMessage[];
  hasMore: boolean;
}

/** Evento del canal en tiempo real. Hoy solo `MESSAGE`; los tipos desconocidos se ignoran. */
export interface ChatEvent {
  type: string;
  message?: ChatMessage;
}
