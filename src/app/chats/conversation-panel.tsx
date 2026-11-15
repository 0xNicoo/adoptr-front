"use client";

import { ArrowLeft, PaperPlaneRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { type FormEvent, type KeyboardEvent, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import Button from "@/app/components/ui/button";
import { ChatMessage, Conversation } from "@/lib/api/models/chat/chat";
import {
  MAX_MESSAGE_LENGTH,
  counterpartSubtitle,
  isOwnMessage,
  publicationName,
  publicationStatusLabel,
  readOnlyReason,
} from "@/lib/chat/inbox";
import { formatMessageTime } from "@/lib/chat/time";
import { PersonAvatar, PetThumb } from "./chat-avatars";

const focusRing = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";
/** Si quien lee está a menos de esto del final, un mensaje nuevo lo lleva abajo. */
const NEAR_BOTTOM_PX = 120;

export interface Thread {
  messages: ChatMessage[];
  hasMore: boolean;
  facts: string | null;
}

export default function ConversationPanel({
  conversation,
  thread,
  today,
  backHref,
  onBack,
  onLoadOlder,
  onSend,
  banner,
}: {
  conversation: Conversation;
  thread: Thread;
  today: string;
  backHref: string;
  onBack: (href: string) => void;
  onLoadOlder: () => Promise<void>;
  /** Devuelve el texto del error o `null` si se mandó. */
  onSend: (body: string) => Promise<string | null>;
  banner?: ReactNode;
}) {
  const { publication, counterpart } = conversation;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b-3 border-ink px-4 py-3 md:px-5">
        <Link
          href={backHref}
          onClick={(event) => {
            event.preventDefault();
            onBack(backHref);
          }}
          aria-label="Volver a la lista de chats"
          className={`-ml-1 flex size-11 shrink-0 items-center justify-center rounded-full md:hidden ${focusRing}`}
        >
          <ArrowLeft aria-hidden={true} weight="bold" className="h-5 w-5" />
        </Link>
        <PersonAvatar name={counterpart.displayName} seed={counterpart.profileId} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold">{counterpart.displayName}</h2>
          <p className="truncate text-sm text-ink-soft">{counterpartSubtitle(conversation)}</p>
        </div>
        <Button href={`/profiles/${counterpart.profileId}`} variant="secondary" size="sm" className="shrink-0">
          Ver perfil
        </Button>
      </header>

      <div className="flex items-center gap-3 border-b-2 border-disabled bg-surface px-4 py-2.5 md:px-5">
        <PetThumb publication={publication} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px]">
            <strong>{publicationName(publication)}</strong> · {publicationStatusLabel(publication)}
          </p>
          {thread.facts && <p className="truncate text-sm text-ink-soft">{thread.facts}</p>}
        </div>
        {!publication.deleted && (
          <Link
            href={`/adoptions/${publication.id}`}
            className={`shrink-0 text-[15px] font-bold text-primary underline underline-offset-3 ${focusRing}`}
          >
            Ver publicación
          </Link>
        )}
      </div>

      {banner}

      {/* Las claves distinguen el chat (para reiniciar scroll y borrador) y no se repiten entre hermanos. */}
      <Messages
        key={`messages-${conversation.id}`}
        conversation={conversation}
        thread={thread}
        today={today}
        onLoadOlder={onLoadOlder}
      />

      {conversation.readOnly ? (
        <p role="status" className="border-t-3 border-ink bg-disabled px-5 py-4 text-[15px] font-semibold">
          {readOnlyReason(publication)}
        </p>
      ) : (
        <Composer key={`composer-${conversation.id}`} counterpart={counterpart.displayName} onSend={onSend} />
      )}
    </div>
  );
}

function Messages({
  conversation,
  thread,
  today,
  onLoadOlder,
}: {
  conversation: Conversation;
  thread: Thread;
  today: string;
  onLoadOlder: () => Promise<void>;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const previous = useRef<{ firstId: number | null; lastId: number | null; height: number; nearBottom: boolean } | null>(null);
  const first = thread.messages[0]?.id ?? null;
  const last = thread.messages.at(-1) ?? null;

  // Al abrir, al final. Mensaje nuevo: al final si ya estaba cerca o si es propio.
  // Mensajes anteriores cargados arriba: se conserva lo que se estaba leyendo.
  useLayoutEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const before = previous.current;
    if (!before) {
      element.scrollTop = element.scrollHeight;
    } else if (first !== before.firstId && before.firstId !== null && last?.id === before.lastId) {
      element.scrollTop += element.scrollHeight - before.height;
    } else if (last && last.id !== before.lastId && (before.nearBottom || isOwnMessage(last, conversation))) {
      element.scrollTop = element.scrollHeight;
    }
    previous.current = {
      firstId: first,
      lastId: last?.id ?? null,
      height: element.scrollHeight,
      nearBottom: element.scrollHeight - element.scrollTop - element.clientHeight < NEAR_BOTTOM_PX,
    };
  }, [first, last, conversation]);

  function remember() {
    const element = scroller.current;
    if (element && previous.current) {
      previous.current.nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < NEAR_BOTTOM_PX;
    }
  }

  async function loadOlder() {
    setLoadingOlder(true);
    await onLoadOlder();
    setLoadingOlder(false);
  }

  return (
    <div
      ref={scroller}
      onScroll={remember}
      className="halftone min-h-0 flex-1 overflow-y-auto bg-paper px-4 py-4 md:px-5"
    >
      <ol aria-label={`Mensajes con ${conversation.counterpart.displayName}`} className="flex flex-col gap-3">
        <li className="flex justify-center">
          {thread.hasMore ? (
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingOlder}
              className={`min-h-11 cursor-pointer rounded-full border-3 border-ink bg-surface px-5 text-[15px] font-bold disabled:cursor-wait disabled:text-ink-soft ${focusRing}`}
            >
              {loadingOlder ? "Cargando…" : "Ver mensajes anteriores"}
            </button>
          ) : (
            <p className="max-w-md rounded-field border-2 border-dashed border-ink bg-surface px-4 py-2 text-center text-sm leading-snug">
              Coordiná el encuentro en un lugar seguro. Adoptr nunca te va a pedir pagos ni datos bancarios.
            </p>
          )}
        </li>
        {thread.messages.map((message) => {
          const own = isOwnMessage(message, conversation);
          return (
            <li key={message.id} className={`flex flex-col gap-1 ${own ? "items-end" : "items-start"}`}>
              <p
                className={`max-w-[85%] rounded-[18px] border-3 px-4 py-2.5 text-[16px] leading-snug whitespace-pre-wrap wrap-anywhere md:max-w-[70%] ${
                  own ? "border-ink bg-primary text-white shadow-hard" : "border-ink bg-surface text-ink"
                }`}
              >
                <span className="sr-only">{own ? "Vos: " : `${conversation.counterpart.displayName}: `}</span>
                {message.body}
              </p>
              <time dateTime={message.createdAt} className="px-1 text-xs text-ink-soft">
                {formatMessageTime(message.createdAt, today)}
              </time>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Composer({ counterpart, onSend }: { counterpart: string; onSend: (body: string) => Promise<string | null> }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const empty = text.trim().length === 0;

  async function send(event?: FormEvent) {
    event?.preventDefault();
    if (empty || sending) return;
    setSending(true);
    setError(null);
    const failure = await onSend(text);
    setSending(false);
    if (failure) {
      setError(failure);
    } else {
      setText("");
    }
    field.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter manda; Shift+Enter hace un salto de línea. No mientras se compone con un IME.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send();
    }
  }

  return (
    <form onSubmit={send} className="border-t-3 border-ink bg-surface px-4 py-3 md:px-5">
      {error && (
        <p role="alert" className="mb-2 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <div className="flex items-end gap-3">
        <label htmlFor="chat-message" className="sr-only">
          Mensaje para {counterpart}
        </label>
        <textarea
          id="chat-message"
          ref={field}
          rows={1}
          value={text}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribí un mensaje"
          className="field-sizing-content max-h-40 min-h-12 flex-1 resize-none rounded-field border-3 border-ink bg-surface px-4 py-2.5 text-[16px] leading-snug placeholder:text-ink-soft focus:outline-3 focus:outline-offset-2 focus:outline-cta"
        />
        <button
          type="submit"
          disabled={empty || sending}
          aria-label={sending ? "Enviando" : "Enviar"}
          className={`flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-cta shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:border-dashed disabled:border-ink-soft disabled:bg-disabled disabled:text-ink-soft disabled:shadow-none ${focusRing}`}
        >
          <PaperPlaneRight aria-hidden={true} weight="bold" className="h-5 w-5" />
        </button>
      </div>
      {text.length > MAX_MESSAGE_LENGTH - 200 && (
        <p className="mt-1 text-right text-xs text-ink-soft">
          {text.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </form>
  );
}
