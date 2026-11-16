export const CROP_OUTPUT_QUALITY = 0.9;
export const CROP_MIN_ZOOM = 1;
export const CROP_MAX_ZOOM = 3;

export interface CropFormat {
  aspectWidth: number;
  aspectHeight: number;
  maxOutputWidth: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function cropAspect(format: CropFormat): number {
  return format.aspectWidth / format.aspectHeight;
}

export function croppedOutputSize(
  area: Pick<CropArea, "width">,
  format: CropFormat,
): { width: number; height: number } {
  const { aspectWidth, aspectHeight, maxOutputWidth } = format;
  const width = Math.max(aspectWidth, Math.min(maxOutputWidth, Math.round(area.width)));
  const exactWidth = width - (width % aspectWidth);
  return { width: exactWidth, height: (exactWidth / aspectWidth) * aspectHeight };
}

export function croppedFileName(name: string): string {
  const base = name.replace(/\.[^./\\]*$/, "").trim();
  return `${base || "foto"}.jpg`;
}

export function clampZoom(zoom: number): number {
  return Math.min(CROP_MAX_ZOOM, Math.max(CROP_MIN_ZOOM, Math.round(zoom * 100) / 100));
}
