"use client";

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { ChatRole, Conversation } from "@/lib/api/models/chat/chat";
import { ChatTab, TAB_ROLE, chatsHref } from "@/lib/chat/chat-query";
import { groupByPublication, lastMessagePreview, publicationName, publicationStatusLabel, unreadTotal } from "@/lib/chat/inbox";
import { PersonAvatar, PetThumb, UnreadCount } from "./chat-avatars";

const focusRing = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";

/** Link que cambia la URL sin pedirle la página al servidor: la bandeja ya está cargada. */
function PanelLink({
  href,
  onNavigate,
  className,
  current,
  children,
}: {
  href: string;
  onNavigate: (href: string) => void;
  className: string;
  current?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      onClick={(event: MouseEvent) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        onNavigate(href);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="shrink-0 rounded-full border-2 border-ink bg-positive-soft px-2 text-[11px] leading-[18px] font-bold whitespace-nowrap">
      {label}
    </span>
  );
}

const itemClass = (current: boolean) =>
  `flex w-full items-center gap-3 rounded-field border-3 px-3 py-2.5 text-left ${focusRing} ${
    current ? "border-ink bg-surface shadow-hard" : "border-transparent hover:border-ink-soft"
  }`;

export default function InboxPanel({
  conversations,
  tab,
  pet,
  openId,
  onNavigate,
}: {
  conversations: Conversation[];
  tab: ChatTab;
  pet: number | null;
  openId: number | null;
  onNavigate: (href: string) => void;
}) {
  const own = conversations.filter((conversation) => conversation.role === ChatRole.OWNER);
  const others = conversations.filter((conversation) => conversation.role === ChatRole.INTERESTED);
  const tabs: { value: ChatTab; label: string }[] = [
    { value: "mine", label: "Mis publicaciones" },
    { value: "others", label: "De otros" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <nav aria-label="Bandejas" className="flex gap-2 border-b-3 border-ink p-3">
        {tabs.map((option) => {
          const active = option.value === tab;
          const unread = unreadTotal(conversations, TAB_ROLE[option.value]);
          return (
            <PanelLink
              key={option.value}
              href={chatsHref({ tab: option.value })}
              onNavigate={onNavigate}
              current={active}
              className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border-3 border-ink px-3 text-[15px] font-bold whitespace-nowrap ${focusRing} ${
                active ? "bg-ink text-surface" : "bg-surface"
              }`}
            >
              {option.label}
              <UnreadCount count={unread} label="sin leer" />
            </PanelLink>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "others" ? (
          <OthersList conversations={others} openId={openId} onNavigate={onNavigate} />
        ) : (
          <MineList conversations={own} pet={pet} openId={openId} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return <p className="px-2 pb-2 text-sm leading-snug text-ink-soft">{children}</p>;
}

function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-field border-3 border-dashed border-ink-soft p-4">
      <p className="font-bold">{title}</p>
      <div className="text-[15px] text-ink-soft">{children}</div>
    </div>
  );
}

function OthersList({
  conversations,
  openId,
  onNavigate,
}: {
  conversations: Conversation[];
  openId: number | null;
  onNavigate: (href: string) => void;
}) {
  if (conversations.length === 0) {
    return (
      <Empty title="Todavía no le escribiste a nadie">
        Cuando una mascota te guste, tocá «Contactar» en su ficha.{" "}
        <Link href="/adoptions" className={`font-semibold text-primary underline ${focusRing}`}>
          Ver mascotas en adopción
        </Link>
      </Empty>
    );
  }
  return (
    <>
      <Hint>Mascotas de otras personas a las que les escribiste.</Hint>
      <ul className="flex flex-col gap-1.5">
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <PanelLink
              href={chatsHref({ tab: "others", chat: conversation.id })}
              onNavigate={onNavigate}
              current={conversation.id === openId}
              className={itemClass(conversation.id === openId)}
            >
              <PetThumb publication={conversation.publication} />
              <ItemText
                title={publicationName(conversation.publication)}
                pill={publicationStatusLabel(conversation.publication)}
                preview={lastMessagePreview(conversation)}
              />
              <UnreadCount count={conversation.unreadCount} label="sin leer" />
            </PanelLink>
          </li>
        ))}
      </ul>
    </>
  );
}

function MineList({
  conversations,
  pet,
  openId,
  onNavigate,
}: {
  conversations: Conversation[];
  pet: number | null;
  openId: number | null;
  onNavigate: (href: string) => void;
}) {
  const groups = groupByPublication(conversations);
  const group = pet ? groups.find((candidate) => candidate.publication.id === pet) : undefined;

  if (groups.length === 0) {
    return (
      <Empty title="Todavía nadie te escribió">
        Acá vas a ver los mensajes de quienes se interesen por las mascotas que publicaste.
      </Empty>
    );
  }

  if (!group) {
    return (
      <>
        <Hint>Primero elegí la mascota y después la persona.</Hint>
        <ul className="flex flex-col gap-1.5">
          {groups.map((item) => {
            const people = item.conversations.length;
            return (
              <li key={item.publication.id}>
                <PanelLink
                  href={chatsHref({ tab: "mine", pet: item.publication.id })}
                  onNavigate={onNavigate}
                  className={itemClass(false)}
                >
                  <PetThumb publication={item.publication} />
                  <ItemText
                    title={publicationName(item.publication)}
                    pill={publicationStatusLabel(item.publication)}
                    preview={people === 1 ? "1 persona te escribió" : `${people} personas te escribieron`}
                  />
                  <UnreadCount count={item.unreadCount} label="sin leer" />
                </PanelLink>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <>
      <PanelLink
        href={chatsHref({ tab: "mine" })}
        onNavigate={onNavigate}
        className={`mb-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-bold text-primary ${focusRing}`}
      >
        <ArrowLeft aria-hidden={true} weight="bold" className="h-4 w-4" />
        Mis publicaciones
      </PanelLink>
      <div className="mb-2 flex items-center gap-3 px-2">
        <PetThumb publication={group.publication} size="sm" />
        <div className="min-w-0">
          <h2 className="truncate font-display text-2xl leading-tight text-primary">{publicationName(group.publication)}</h2>
          <p className="text-sm text-ink-soft">Personas que te escribieron por esta mascota.</p>
        </div>
      </div>
      <ul className="flex flex-col gap-1.5">
        {group.conversations.map((conversation) => (
          <li key={conversation.id}>
            <PanelLink
              href={chatsHref({ tab: "mine", pet: group.publication.id, chat: conversation.id })}
              onNavigate={onNavigate}
              current={conversation.id === openId}
              className={itemClass(conversation.id === openId)}
            >
              <PersonAvatar
                name={conversation.counterpart.displayName}
                seed={conversation.counterpart.profileId}
                photoUrl={conversation.counterpart.photoUrl}
                size="sm"
              />
              <ItemText title={conversation.counterpart.displayName} preview={lastMessagePreview(conversation)} person />
              <UnreadCount count={conversation.unreadCount} label="sin leer" />
            </PanelLink>
          </li>
        ))}
      </ul>
    </>
  );
}

function ItemText({ title, pill, preview, person }: { title: string; pill?: string; preview: string; person?: boolean }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="flex min-w-0 items-center gap-2">
        <span className={`truncate ${person ? "text-[17px] font-bold" : "font-display text-[22px] leading-tight text-primary"}`}>
          {title}
        </span>
        {pill && <StatusPill label={pill} />}
      </span>
      <span className="truncate text-sm text-ink-soft">{preview}</span>
    </span>
  );
}
