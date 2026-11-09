// Fotos del alta de adopción. Mismos límites que el back (adoptr-back/docs/arquitectura/api.md):
// el navegador avisa antes de subir, pero quien valida el contenido real es el back.

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ACCEPTED_TEXT = "JPG, PNG o WebP";
const MAX_SIZE_TEXT = "5 MB";

export const PHOTO_RULES_TEXT = `${ACCEPTED_TEXT}, hasta ${MAX_SIZE_TEXT} cada una.`;

export interface PhotoSelection<T> {
  accepted: T[];
  /** Un mensaje por cada archivo descartado. */
  rejected: string[];
}

/** Separa los archivos elegidos en los que se pueden sumar a los `currentCount` ya cargados y los que no. */
export function selectPhotos<T extends { name: string; size: number; type: string }>(
  files: T[],
  currentCount: number,
): PhotoSelection<T> {
  const accepted: T[] = [];
  const rejected: string[] = [];
  for (const file of files) {
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      rejected.push(`${file.name}: tiene que ser ${ACCEPTED_TEXT}.`);
    } else if (file.size === 0) {
      rejected.push(`${file.name}: el archivo está vacío.`);
    } else if (file.size > MAX_PHOTO_BYTES) {
      rejected.push(`${file.name}: pesa más de ${MAX_SIZE_TEXT}.`);
    } else if (currentCount + accepted.length >= MAX_PHOTOS) {
      rejected.push(`${file.name}: ya llegaste al máximo de ${MAX_PHOTOS} fotos.`);
    } else {
      accepted.push(file);
    }
  }
  return { accepted, rejected };
}

/** Texto para quien publica según el `code` del back. */
export function photoUploadMessage(code: string): string {
  switch (code) {
    case "IMAGE_TOO_LARGE":
      return `Es demasiado grande: hasta ${MAX_SIZE_TEXT} y 40 megapíxeles.`;
    case "IMAGE_INVALID":
    case "UNSUPPORTED_MEDIA_TYPE":
      return `No es una imagen ${ACCEPTED_TEXT} válida.`;
    case "IMAGE_STORAGE_UNAVAILABLE":
      return "No pudimos guardarla en este momento.";
    default:
      return "No pudimos subirla.";
  }
}

export interface PhotoUploadFailure<T> {
  item: T;
  code: string;
}

/**
 * Sube de a una y en orden, porque el back numera las fotos según llegan y la primera es la portada.
 * Si una falla sigue con las demás. `upload` devuelve `null` si salió bien o el `code` del error.
 */
export async function uploadInOrder<T>(
  items: T[],
  upload: (item: T) => Promise<string | null>,
  onProgress?: (current: number, total: number) => void,
): Promise<PhotoUploadFailure<T>[]> {
  const failures: PhotoUploadFailure<T>[] = [];
  for (const [index, item] of items.entries()) {
    onProgress?.(index + 1, items.length);
    let code: string | null;
    try {
      code = await upload(item);
    } catch {
      // Se cortó la conexión con el servidor de Next: la acción ni llegó a responder.
      code = "UNKNOWN_ERROR";
    }
    if (code !== null) failures.push({ item, code });
  }
  return failures;
}
