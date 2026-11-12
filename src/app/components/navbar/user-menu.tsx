"use client";

import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";

// Menú del usuario con sesión. Headless UI resuelve teclado, foco y cierre
// (Escape, clic afuera, al elegir una opción).

const itemClass =
  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-base font-semibold text-ink data-[focus]:bg-paper";

// Rutas que todavía no existen: se muestran deshabilitadas con «Próximamente».
const upcoming = ["Chats"];

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

export default function UserMenu() {
  const handleLogout = useLogout();

  return (
    <Menu as="div" className="relative">
      <MenuButton
        aria-label="Menú de usuario"
        className="flex min-h-11 items-center gap-1.5 rounded-full px-2 text-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
      >
        <UserCircleIcon aria-hidden="true" className="h-8 w-8" />
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
            <span className="flex items-center gap-2.5">
              <Heart aria-hidden={true} weight="bold" className="h-5 w-5" />
              Guardadas
            </span>
          </Link>
        </MenuItem>
        {upcoming.map((label) => (
          <MenuItem key={label} disabled>
            <span className={`${itemClass} cursor-not-allowed text-ink-soft`}>
              {label}
              <span className="rounded-md border-2 border-ink bg-accent-mustard px-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink">
                Próximamente
              </span>
            </span>
          </MenuItem>
        ))}
        <MenuItem>
          <button type="button" onClick={handleLogout} className={`${itemClass} border-t-2 border-disabled`}>
            Salir
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
