import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { adoptedLabel } from "./labels";

function adopted(sex: PetSex): string {
  return adoptedLabel(sex).toLowerCase();
}

export function nextStatus(status: AdoptionStatus): AdoptionStatus {
  return status === AdoptionStatus.AVAILABLE ? AdoptionStatus.ADOPTED : AdoptionStatus.AVAILABLE;
}

export function statusActionLabel(sex: PetSex, status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE ? `Marcar como ${adopted(sex)}` : "Volver a adopción";
}

export function statusConfirmTitle(petName: string, status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE
    ? `¿${petName} ya tiene familia?`
    : `¿Volver a poner a ${petName} en adopción?`;
}

export function statusConfirmText(sex: PetSex, status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE
    ? "La publicación saldrá de la lista de adopciones y nadie más va a poder escribirte por ella. " +
        `Va a seguir en tu perfil como ${adopted(sex)}, y si hace falta la podés volver a poner en adopción.`
    : "Va a volver a aparecer en la lista de adopciones y te van a poder escribir por ella.";
}

export function statusConfirmButton(sex: PetSex, status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE ? `Sí, fue ${adopted(sex)}` : "Sí, volver a adopción";
}

export function statusChangedMessage(petName: string, sex: PetSex, newStatus: AdoptionStatus): string {
  return newStatus === AdoptionStatus.ADOPTED
    ? `¡Qué buena noticia! ${petName} quedó como ${adopted(sex)}`
    : `${petName} volvió a estar en adopción`;
}

export function statusChangeMessage(code: string): string {
  switch (code) {
    case "ADOPTION_NOT_FOUND":
      return "Esta publicación ya no existe.";
    case "ADOPTION_NOT_OWNER":
      return "Solo quien la publicó puede cambiar su estado.";
    default:
      return "No pudimos cambiar el estado. Probá de nuevo.";
  }
}
