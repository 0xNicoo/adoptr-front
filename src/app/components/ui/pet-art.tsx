import Image from "next/image";
import type { ReactNode } from "react";
import { Species } from "@/lib/api/models/adoption/species";

// Bloque de color con trama e ilustración, en lugar de la foto mientras no haya fotos
// (ver docs/arquitectura/sistema-visual.md#componentes-base, «Tarjeta de mascota»).

const BACKGROUNDS = ["bg-accent-teal", "bg-accent-mustard", "bg-cta", "bg-primary"] as const;

const ART: Record<Species, string> = {
  [Species.DOG]: "/illustrations/perros/perro-azul.svg",
  [Species.CAT]: "/illustrations/gatos/gato-crema.svg",
};

export default function PetArt({
  id,
  species,
  size = "card",
  children,
}: {
  /** Elige el color de fondo, para que cada mascota tenga siempre el mismo. */
  id: number;
  species: Species;
  size?: "card" | "large";
  /** Va arriba a la izquierda (por ejemplo, el badge de estado). */
  children?: ReactNode;
}) {
  const background = BACKGROUNDS[id % BACKGROUNDS.length];
  const large = size === "large";

  return (
    <div
      className={`halftone relative flex items-center justify-center ${background} ${
        large ? "aspect-[4/3] rounded-card border-3 border-ink shadow-panel" : "h-44 border-b-3 border-ink"
      }`}
    >
      {children && <div className="absolute top-3 left-3">{children}</div>}
      <Image
        src={ART[species]}
        alt=""
        width={120}
        height={120}
        unoptimized
        className={large ? "h-auto w-40 md:w-56" : "h-auto w-24"}
      />
    </div>
  );
}
