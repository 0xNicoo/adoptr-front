import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/session";
import Button from "../ui/button";
import UserMenu, { LogoutButton } from "./user-menu";

const links = [
  { label: "Adoptar", href: "/adoptions" },
  { label: "Publicar", href: "/adoptions/new" },
  { label: "Cómo funciona", href: "/#como" },
];

const linkClass =
  "rounded-sm px-0.5 py-2.5 text-[17px] font-bold text-surface underline-offset-8 decoration-cta decoration-4 " +
  "hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";

export default async function Navbar() {
  const isLoggedIn = Boolean(await getAccessToken());

  return (
    <Disclosure as="nav" aria-label="Principal" className="relative z-50 border-b-4 border-ink bg-primary">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link
          href="/"
          className="font-brand text-4xl leading-none text-surface [text-shadow:3px_3px_0_var(--color-ink)] sm:text-5xl"
        >
          Adop<span className="text-cta">tr</span>
        </Link>

        <div className="hidden items-center gap-7 sm:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Button href="/login" variant="cta" size="sm" tone="dark">
              Ingresar
            </Button>
          )}
        </div>

        <DisclosureButton className="group inline-flex h-11 w-11 items-center justify-center rounded-full border-3 border-surface text-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal sm:hidden">
          <span className="sr-only">Abrir menú</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6 group-data-[open]:hidden" />
          <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
        </DisclosureButton>
      </div>

      <DisclosurePanel className="border-t-2 border-ink-soft px-6 pb-5 pt-3 sm:hidden">
        <div className="flex flex-col items-start gap-1">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button href="/profile" variant="secondary" size="sm" tone="dark">
                  Mi perfil
                </Button>
                <Button href="/saved" variant="secondary" size="sm" tone="dark">
                  Guardadas
                </Button>
                <LogoutButton className="min-h-11 rounded-full border-3 border-surface px-5 font-bold text-surface" />
              </>
            ) : (
              <Button href="/login" variant="cta" size="sm" tone="dark">
                Ingresar
              </Button>
            )}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
