import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import { PublicProfile } from "@/lib/api/models/profile/public-profile";

// Textos para mostrar un perfil.

/** Nombre y apellido de una persona, o el nombre de la organización. */
export function profileDisplayName(profile: PublicProfile): string {
  return profile.profileType === ProfileType.PERSON
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : profile.organizationName.trim();
}

/** Para títulos cortos: el nombre de pila de una persona o el nombre de la organización. */
export function profileShortName(profile: PublicProfile): string {
  return profile.profileType === ProfileType.PERSON ? profile.firstName.trim() : profile.organizationName.trim();
}

/** Id de perfil de la URL (`/profiles/3`), o `null` si no es un entero positivo. */
export function parseProfileId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return id > 0 && Number.isSafeInteger(id) ? id : null;
}

/** Hasta dos iniciales en mayúscula: «Victoria Miranda» → «VM», «Refugio» → «R». */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toLocaleUpperCase("es-AR"))
    .join("");
}

/** Subtítulo del listado de publicaciones de un perfil. */
export function profileAdoptionsCountText(total: number, status: AdoptionStatus | null): string {
  if (status === AdoptionStatus.AVAILABLE) {
    return total === 1 ? "1 mascota buscando familia" : `${total} mascotas buscando familia`;
  }
  if (status === AdoptionStatus.ADOPTED) {
    return total === 1 ? "1 mascota adoptada" : `${total} mascotas adoptadas`;
  }
  return total === 1 ? "1 mascota publicada" : `${total} mascotas publicadas`;
}
