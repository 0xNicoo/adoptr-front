"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

/**
 * «Volver al catálogo». Si se llegó desde el catálogo (con o sin filtros), vuelve atrás para
 * conservar esa búsqueda; si no (link compartido, recién publicada), va al catálogo.
 */
export default function BackLink() {
  const router = useRouter();

  function back(event: MouseEvent<HTMLAnchorElement>) {
    try {
      const from = new URL(document.referrer);
      if (from.origin === window.location.origin && from.pathname === "/adoptions") {
        event.preventDefault();
        router.back();
      }
    } catch {
      // Sin referrer válido: sigue el link.
    }
  }

  return (
    <Link
      href="/adoptions"
      onClick={back}
      className="inline-flex min-h-11 items-center gap-1.5 font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal"
    >
      <ChevronLeftIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
      Volver al catálogo
    </Link>
  );
}
