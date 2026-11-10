import Image from "next/image";
import type { ReactNode } from "react";
import { Species } from "@/lib/api/models/adoption/species";

// La foto de la mascota o, si no tiene, un bloque de color con trama e ilustración
// (ver docs/arquitectura/sistema-visual.md#componentes-base, «Tarjeta de mascota»).
// Las fotos van `unoptimized`: el back ya las guarda como JPEG de hasta 1600 px y su host
// depende del entorno (bucket o CDN).

const BACKGROUNDS = ["bg-accent-teal", "bg-accent-mustard", "bg-cta", "bg-primary"] as const;

const ART: Record<Species, string> = {
  [Species.DOG]: "/illustrations/perros/perro-azul.svg",
  [Species.CAT]: "/illustrations/gatos/gato-crema.svg",
};

export default function PetArt({
  id,
  species,
  photoUrl,
  photoAlt = "",
  size = "card",
  children,
}: {
  /** Elige el color de fondo, para que cada mascota tenga siempre el mismo. */
  id: number;
  species: Species;
  photoUrl?: string | null;
  photoAlt?: string;
  size?: "card" | "large";
  /** Va arriba a la izquierda (por ejemplo, el badge de estado). */
  children?: ReactNode;
}) {
  const large = size === "large";
  // Alrededor de una foto entera, un fondo neutro: un color vivo le competiría.
  const background = large && photoUrl ? "bg-surface" : BACKGROUNDS[id % BACKGROUNDS.length];

  return (
    <div
      className={`halftone relative flex items-center justify-center overflow-hidden ${background} ${
        large ? "aspect-[4/3] rounded-card border-3 border-ink shadow-panel" : "aspect-[4/3] border-b-3 border-ink"
      }`}
    >
      {photoUrl ? (
        // En la ficha se ve entera, sin recortar; en la tarjeta llena el bloque para que la grilla quede pareja.
        <Image src={photoUrl} alt={photoAlt} fill unoptimized className={large ? "object-contain" : "object-cover"} />
      ) : (
        <Image
          src={ART[species]}
          alt=""
          width={120}
          height={120}
          unoptimized
          className={large ? "h-auto w-40 md:w-56" : "h-auto w-24"}
        />
      )}
      {children && <div className="absolute top-3 left-3">{children}</div>}
    </div>
  );
}
