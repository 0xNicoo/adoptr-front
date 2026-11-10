// Recorte 4:3 de las fotos de adopción, antes de subirlas. Mismo formato que guarda el back
// (adoptr-back/docs/arquitectura/api.md): hasta 1600×1200, en JPEG.

export const PHOTO_ASPECT = 4 / 3;
export const PHOTO_OUTPUT_MAX_WIDTH = 1600;
export const PHOTO_OUTPUT_QUALITY = 0.9;
export const PHOTO_MIN_ZOOM = 1;
export const PHOTO_MAX_ZOOM = 3;

/** Zona de la foto original, en píxeles, que queda dentro del marco. */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Tamaño del JPEG de salida: exactamente 4:3, sin agrandar la zona elegida y con 1600 px de ancho como máximo. */
export function croppedOutputSize(area: Pick<CropArea, "width">): { width: number; height: number } {
  const width = Math.max(4, Math.min(PHOTO_OUTPUT_MAX_WIDTH, Math.round(area.width)));
  // Múltiplo de 4 para que el alto (3/4) sea entero y la proporción, exacta.
  const exactWidth = width - (width % 4);
  return { width: exactWidth, height: (exactWidth / 4) * 3 };
}

/** «perro.png» → «perro.jpg»: lo que se sube siempre es JPEG. */
export function croppedFileName(name: string): string {
  const base = name.replace(/\.[^./\\]*$/, "").trim();
  return `${base || "foto"}.jpg`;
}

/** Zoom acotado a lo que permite el control (por ejemplo, después de un pellizco o de los botones). */
export function clampZoom(zoom: number): number {
  return Math.min(PHOTO_MAX_ZOOM, Math.max(PHOTO_MIN_ZOOM, Math.round(zoom * 100) / 100));
}
