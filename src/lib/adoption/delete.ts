import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";

export function canDelete(status: AdoptionStatus): boolean {
  return status === AdoptionStatus.AVAILABLE;
}

export function deleteConfirmTitle(petName: string): string {
  return `¿Estás seguro de eliminar la publicación de ${petName}?`;
}

export const DELETE_CONFIRM_TEXT =
  "La publicación deja de verse en Adoptr y en tu perfil. Las personas que te escribieron van a poder leer el chat, " +
  "pero no responder. No se puede deshacer.";

export const DELETE_CONFIRM_BUTTON = "Sí, eliminar";

export function deletedMessage(petName: string): string {
  return `Eliminaste a ${petName}`;
}

export function deleteErrorMessage(code: string): string {
  switch (code) {
    case "ADOPTION_NOT_FOUND":
      return "Esta publicación ya no existe.";
    case "ADOPTION_NOT_OWNER":
      return "Solo quien la publicó puede eliminarla.";
    case "ADOPTION_ADOPTED_NOT_DELETABLE":
      return "Una publicación adoptada no se puede eliminar.";
    default:
      return "No pudimos eliminar la publicación. Probá de nuevo.";
  }
}
