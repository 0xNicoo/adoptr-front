"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

// Link de arriba del detalle. «Volver» va atrás en el historial si se llegó desde otra página de Adoptr
// (el catálogo con sus filtros, un perfil) y, si no, al listado de adopciones.
// Recién publicada (`justPublished`) no usa el historial: atrás estaría el formulario de alta, así que
// es «Ver adopciones» y va directo al listado.
// `document.referrer` no cambia con la navegación dentro de la app: solo sirve para saber si se entró
// desde otro sitio, no para saber de qué página se viene.

export default function BackLink({ justPublished = false }: { justPublished?: boolean }) {
  const router = useRouter();

  function back(event: MouseEvent<HTMLAnchorElement>) {
    if (justPublished) return;
    try {
      if (new URL(document.referrer).origin === window.location.origin) {
        event.preventDefault();
        router.back();
      }
    } catch {
      // Sin referrer (link directo o pestaña nueva): sigue el href.
    }
  }

  return (
    <Link
      href="/adoptions"
      onClick={back}
      className="inline-flex min-h-11 items-center gap-1.5 font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal"
    >
      <ChevronLeftIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
      {justPublished ? "Ver adopciones" : "Volver"}
    </Link>
  );
}
