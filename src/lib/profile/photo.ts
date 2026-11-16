import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_BYTES } from "@/lib/adoption/photos";
import { CropFormat } from "@/lib/photo/crop";

export const PROFILE_PHOTO_FORMAT: CropFormat = { aspectWidth: 1, aspectHeight: 1, maxOutputWidth: 800 };

export type PhotoChoice =
  | { kind: "none" }
  | { kind: "current" }
  | { kind: "google" }
  | { kind: "upload"; file: File; previewUrl: string };

export type PhotoAction = "keep" | "delete" | "upload" | "google";

export function photoPreviewUrl(
  choice: PhotoChoice,
  googlePhotoUrl: string | null,
  currentPhotoUrl: string | null = null,
): string | null {
  if (choice.kind === "upload") return choice.previewUrl;
  if (choice.kind === "google") return googlePhotoUrl;
  if (choice.kind === "current") return currentPhotoUrl;
  return null;
}

export function photoAction(choice: PhotoChoice, hadPhoto: boolean): PhotoAction {
  if (choice.kind === "upload" || choice.kind === "google") return choice.kind;
  if (choice.kind === "none" && hadPhoto) return "delete";
  return "keep";
}

const INVALID = "La foto tiene que ser JPG, PNG o WebP.";
const TOO_LARGE = "La foto es demasiado grande: hasta 5 MB.";

export function profilePhotoFileError(file: { type: string; size: number }): string | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return INVALID;
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > MAX_PHOTO_BYTES) return TOO_LARGE;
  return null;
}

const MESSAGES: Record<string, string> = {
  IMAGE_INVALID: INVALID,
  IMAGE_TOO_LARGE: TOO_LARGE,
  GOOGLE_PHOTO_NOT_FOUND: "Tu cuenta de Google ya no tiene foto.",
  GOOGLE_PHOTO_UNAVAILABLE: "No pudimos traer tu foto de Google.",
};

export function profilePhotoErrorMessage(code: string): string {
  return MESSAGES[code] ?? "No pudimos guardar la foto.";
}
