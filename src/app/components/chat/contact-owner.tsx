"use client";

import { ChatCircleDots } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { startConversationAction } from "@/actions/chat";
import Button from "@/app/components/ui/button";
import { conversationHref } from "@/lib/chat/chat-query";
import { MAX_MESSAGE_LENGTH, chatErrorMessage } from "@/lib/chat/inbox";

/** «Contactar» en el detalle de una publicación ajena: la conversación nace con el primer mensaje. */
export default function ContactOwner({
  publicationId,
  petName,
  ownerName,
}: {
  publicationId: number;
  petName: string;
  ownerName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(`¡Hola! ¿${petName} sigue en adopción?`);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    const result = await startConversationAction(publicationId, text);
    if (result.ok) {
      router.push(conversationHref(result.conversation));
      return;
    }
    setSending(false);
    setError(chatErrorMessage(result.code));
  }

  if (!open) {
    return (
      <Button
        variant="cta"
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => field.current?.focus());
        }}
      >
        <ChatCircleDots aria-hidden={true} weight="bold" className="h-5 w-5" />
        Contactar
      </Button>
    );
  }

  return (
    <form onSubmit={send} className="flex flex-col gap-3 rounded-card border-3 border-ink bg-surface p-4 shadow-card">
      <label htmlFor="contact-message" className="font-bold">
        Escribile a {ownerName}
      </label>
      <textarea
        id="contact-message"
        ref={field}
        rows={3}
        value={text}
        maxLength={MAX_MESSAGE_LENGTH}
        onChange={(event) => setText(event.target.value)}
        aria-describedby="contact-help"
        className="min-h-24 w-full resize-y rounded-field border-3 border-ink bg-surface px-4 py-3 text-[16px] leading-snug focus:outline-3 focus:outline-offset-2 focus:outline-cta"
      />
      <p id="contact-help" className="text-sm text-ink-soft">
        Se abre un chat solo entre ustedes. Coordiná el encuentro en un lugar seguro: Adoptr nunca te va a pedir pagos.
      </p>
      {error && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="cta" disabled={sending || !text.trim()}>
          {sending ? "Enviando…" : "Enviar mensaje"}
        </Button>
        <Button variant="secondary" onClick={() => setOpen(false)} disabled={sending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
