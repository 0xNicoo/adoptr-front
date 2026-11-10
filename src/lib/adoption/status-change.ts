import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { adoptedLabel } from "./labels";

export function nextStatus(status: AdoptionStatus): AdoptionStatus {
  return status === AdoptionStatus.AVAILABLE ? AdoptionStatus.ADOPTED : AdoptionStatus.AVAILABLE;
}

export function statusActionLabel(sex: PetSex, status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE
    ? `Marcar como ${adoptedLabel(sex).toLowerCase()}`
    : "Volver a poner en adopción";
}

export function statusShortLabel(sex: PetSex, status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE ? `Fue ${adoptedLabel(sex).toLowerCase()}` : "Volver a adopción";
}

export function statusConfirmTitle(petName: string, sex: PetSex, status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE
    ? `¿Marcar a ${petName} como ${adoptedLabel(sex).toLowerCase()}?`
    : `¿Volver a poner a ${petName} en adopción?`;
}

export function statusConfirmText(status: AdoptionStatus): string {
  return status === AdoptionStatus.AVAILABLE
    ? "Va a dejar de aparecer en la búsqueda de adopciones. Si te equivocaste, podés deshacerlo."
    : "Va a volver a aparecer en la búsqueda de adopciones.";
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
