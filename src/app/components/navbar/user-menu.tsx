"use client";

import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { useLiveUnread } from "./use-live-unread";

// Menú del usuario con sesión. Headless UI resuelve teclado, foco y cierre
// (Escape, clic afuera, al elegir una opción).

const itemClass =
  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-base font-semibold text-ink data-[focus]:bg-paper";

/** Círculo naranja con los mensajes sin leer. */
export function UnreadDot({ count, className = "" }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex min-w-5 items-center justify-center rounded-full border-2 border-ink bg-cta px-1 text-[12px] leading-4 font-bold text-ink ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function unreadText(count: number): string {
  return count === 1 ? "1 mensaje sin leer" : `${count} mensajes sin leer`;
}

/** «Chats» del menú mobile, con el contador en vivo. */
export function MobileChatsLink({ unread, className }: { unread: number; className: string }) {
  const count = useLiveUnread(unread);
  return (
    <Link href="/chats" className={className}>
      Chats
      <UnreadDot count={count} />
      {count > 0 && <span className="sr-only">, {unreadText(count)}</span>}
    </Link>
  );
}

function useLogout() {
  const router = useRouter();

  return async () => {
    await logoutAction();
    router.push("/");
    // La navbar se renderiza en el servidor: refrescar para que muestre «Ingresar».
    router.refresh();
  };
}

export function LogoutButton({ className = "" }: { className?: string }) {
  const handleLogout = useLogout();

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Salir
    </button>
  );
}

export default function UserMenu({ unread }: { unread: number }) {
  const handleLogout = useLogout();
  const count = useLiveUnread(unread);

  return (
    <Menu as="div" className="relative">
      <MenuButton
        aria-label={count > 0 ? `Menú de usuario, ${unreadText(count)}` : "Menú de usuario"}
        className="relative flex min-h-11 items-center gap-1.5 rounded-full px-2 text-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
      >
        <UserCircleIcon aria-hidden="true" className="h-8 w-8" />
        <UnreadDot count={count} className="absolute -top-0.5 left-6" />
        <ChevronDownIcon aria-hidden="true" className="h-4 w-4" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="z-50 mt-2 w-64 overflow-hidden rounded-field border-3 border-ink bg-surface py-1 shadow-card [--anchor-gap:8px] focus:outline-none"
      >
        <MenuItem>
          <Link href="/profile" className={itemClass}>
            Mi perfil
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/saved" className={itemClass}>
            Guardadas
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/chats" className={itemClass}>
            Chats
            <UnreadDot count={count} />
            {count > 0 && <span className="sr-only">, {unreadText(count)}</span>}
          </Link>
        </MenuItem>
        <MenuItem>
          <button type="button" onClick={handleLogout} className={`${itemClass} border-t-2 border-disabled`}>
            Salir
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
