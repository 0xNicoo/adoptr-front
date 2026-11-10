import { Profile } from "@/lib/api/models/profile/profile";
import { ProfileType } from "@/lib/api/models/profile/profile-type";

// Textos para mostrar un perfil.

/** Nombre y apellido de una persona, o el nombre de la organización. */
export function profileDisplayName(profile: Profile): string {
  return profile.profileType === ProfileType.PERSON
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : profile.organizationName.trim();
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
export function profileAdoptionsCountText(total: number, onlyAvailable: boolean): string {
  if (onlyAvailable) {
    return total === 1 ? "1 mascota buscando familia" : `${total} mascotas buscando familia`;
  }
  return total === 1 ? "1 mascota publicada" : `${total} mascotas publicadas`;
}
