import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getUnreadChatCount } from "@/lib/api/calls/chat";
import { getAccessToken } from "@/lib/auth/session";
import Button from "../ui/button";
import MobileMenu, { type NavLink } from "./mobile-menu";
import UserMenu from "./user-menu";

const links: NavLink[] = [
  { label: "Adoptar", href: "/adoptions" },
  { label: "Publicar", href: "/adoptions/new" },
  { label: "Cómo funciona", href: "/#como" },
];

const linkClass =
  "rounded-sm px-0.5 py-2.5 text-[17px] font-bold text-surface underline-offset-8 decoration-cta decoration-4 " +
  "hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";

export default async function Navbar() {
  const isLoggedIn = Boolean(await getAccessToken());
  const unread = isLoggedIn ? await getUnreadChatCount() : 0;

  return (
    <Disclosure as="nav" aria-label="Principal" className="sticky top-0 z-50">
      <div className="border-b-4 border-ink bg-primary">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
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
              // Con otra cantidad del servidor se vuelve a montar y deja de lado el valor en vivo anterior.
              <UserMenu key={unread} unread={unread} />
            ) : (
              <Button href="/login" variant="cta" size="sm" tone="dark">
                Ingresar
              </Button>
            )}
          </div>

          <DisclosureButton className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-3 border-surface text-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal sm:hidden">
            <span className="sr-only">Menú</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6 group-data-[open]:hidden" />
            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
          </DisclosureButton>
        </div>
      </div>

      <MobileMenu links={links} isLoggedIn={isLoggedIn} unread={unread} />
    </Disclosure>
  );
}
