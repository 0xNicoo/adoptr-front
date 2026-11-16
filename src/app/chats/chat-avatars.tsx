import Image from "next/image";
import { Species } from "@/lib/api/models/adoption/species";
import { ConversationPublication } from "@/lib/api/models/chat/chat";
import { initials } from "@/lib/profile/display";

// Avatares del chat: la mascota (portada o ilustración) y la persona (foto o iniciales).

const PET_BACKGROUNDS = ["bg-accent-teal", "bg-accent-mustard", "bg-cta", "bg-primary"] as const;
const PERSON_BACKGROUNDS = ["bg-cta", "bg-accent-teal", "bg-accent-mustard", "bg-positive"] as const;

const ART: Record<Species, string> = {
  [Species.DOG]: "/illustrations/perros/perro-azul.svg",
  [Species.CAT]: "/illustrations/gatos/gato-crema.svg",
};

export function PetThumb({ publication, size = "md" }: { publication: ConversationPublication; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-11" : "size-14";
  const art = publication.species ? ART[publication.species] : null;
  return (
    <span
      aria-hidden="true"
      className={`halftone relative flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-field border-3 border-ink ${
        PET_BACKGROUNDS[publication.id % PET_BACKGROUNDS.length]
      }`}
    >
      {publication.coverPhotoUrl ? (
        <Image src={publication.coverPhotoUrl} alt="" fill unoptimized className="object-cover" />
      ) : art ? (
        <Image src={art} alt="" width={40} height={40} unoptimized className="h-auto w-3/4" />
      ) : null}
    </span>
  );
}

export function PersonAvatar({
  name,
  seed,
  photoUrl,
  size = "md",
}: {
  name: string;
  seed: number;
  photoUrl: string | null;
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-ink font-display ${
        size === "sm" ? "size-11 text-lg" : "size-12 text-xl"
      } ${PERSON_BACKGROUNDS[seed % PERSON_BACKGROUNDS.length]}`}
    >
      {photoUrl ? <Image src={photoUrl} alt="" fill unoptimized className="object-cover" /> : initials(name)}
    </span>
  );
}

/** Contador de no leídos: círculo naranja con el número (texto para lectores de pantalla). */
export function UnreadCount({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex min-w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cta px-1.5 text-[13px] leading-5 font-bold text-ink">
      {count > 99 ? "99+" : count}
      <span className="sr-only"> {label}</span>
    </span>
  );
}
