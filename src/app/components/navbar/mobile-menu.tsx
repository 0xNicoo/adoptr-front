"use client";

import { DisclosurePanel, useClose } from "@headlessui/react";
import { ChatCircle, Heart, SignOut, UserCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { type MouseEvent, useEffect } from "react";
import Button from "../ui/button";
import { LogoutButton, MobileChatsLink } from "./user-menu";

export interface NavLink {
  label: string;
  href: string;
}

const rowClass =
  "flex min-h-12 w-full items-center gap-3 rounded-sm text-left text-lg font-bold text-surface " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";

const iconClass = "h-6 w-6 shrink-0";

export default function MobileMenu({ links, isLoggedIn, unread }: { links: NavLink[]; isLoggedIn: boolean; unread: number }) {
  return (
    <DisclosurePanel className="sm:hidden">
      <Panel links={links} isLoggedIn={isLoggedIn} unread={unread} />
    </DisclosurePanel>
  );
}

function Panel({ links, isLoggedIn, unread }: { links: NavLink[]; isLoggedIn: boolean; unread: number }) {
  const close = useClose();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  function closeOnChoice(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("a, button")) close();
  }

  return (
    <>
      <div aria-hidden="true" onClick={close} className="fixed inset-0 -z-10 bg-ink/60" />
      <div
        onClick={closeOnChoice}
        className="absolute inset-x-0 top-full flex flex-col border-b-4 border-ink bg-primary px-5 pt-2 pb-6"
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={rowClass}>
            {link.label}
          </Link>
        ))}
        {isLoggedIn ? (
          <>
            <hr className="my-2 border-t-2 border-ink-soft" />
            <Link href="/profile" className={rowClass}>
              <UserCircle aria-hidden={true} weight="bold" className={iconClass} />
              Mi perfil
            </Link>
            <Link href="/saved" className={rowClass}>
              <Heart aria-hidden={true} weight="bold" className={iconClass} />
              Guardadas
            </Link>
            <MobileChatsLink
              key={unread}
              unread={unread}
              icon={<ChatCircle aria-hidden={true} weight="bold" className={iconClass} />}
              className={rowClass}
            />
            <hr className="my-2 border-t-2 border-ink-soft" />
            <LogoutButton
              icon={<SignOut aria-hidden={true} weight="bold" className={iconClass} />}
              className={`${rowClass} cursor-pointer`}
            />
          </>
        ) : (
          <Button href="/login" variant="cta" tone="dark" className="mt-4 w-full">
            Ingresar
          </Button>
        )}
      </div>
    </>
  );
}
