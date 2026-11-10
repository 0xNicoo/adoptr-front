export const PHOTO_ASPECT = 3 / 4;
export const PHOTO_OUTPUT_MAX_WIDTH = 1200;
export const PHOTO_OUTPUT_QUALITY = 0.9;
export const PHOTO_MIN_ZOOM = 1;
export const PHOTO_MAX_ZOOM = 3;

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function croppedOutputSize(area: Pick<CropArea, "width">): { width: number; height: number } {
  const width = Math.max(3, Math.min(PHOTO_OUTPUT_MAX_WIDTH, Math.round(area.width)));
  const exactWidth = width - (width % 3);
  return { width: exactWidth, height: (exactWidth / 3) * 4 };
}

export function croppedFileName(name: string): string {
  const base = name.replace(/\.[^./\\]*$/, "").trim();
  return `${base || "foto"}.jpg`;
}

export function clampZoom(zoom: number): number {
  return Math.min(PHOTO_MAX_ZOOM, Math.max(PHOTO_MIN_ZOOM, Math.round(zoom * 100) / 100));
}
