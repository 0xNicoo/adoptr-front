import 'server-only';
import { summaryLine } from '@/lib/adoption/labels';
import { getAdoption } from '@/lib/api/calls/adoption';
import { Conversation } from '@/lib/api/models/chat/chat';

/**
 * «Perro · Grande · Macho · 3 años» para el encabezado del chat, o `null` si la publicación no se
 * puede abrir. La conversación no trae la ficha completa: se pide el detalle. Si falla, el chat sigue.
 */
export async function publicationFacts(conversation: Conversation): Promise<string | null> {
  if (conversation.publication.deleted || conversation.publication.type !== 'ADOPTION') return null;
  try {
    const adoption = await getAdoption(conversation.publication.id);
    return adoption ? summaryLine(adoption) : null;
  } catch {
    return null;
  }
}
