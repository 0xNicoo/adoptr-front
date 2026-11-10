import { CropArea, PHOTO_OUTPUT_QUALITY, croppedFileName, croppedOutputSize } from "./photo-crop";

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo abrir la imagen"));
    image.src = url;
  });
}

export async function cropToFile(imageUrl: string, area: CropArea, originalName: string): Promise<File> {
  const image = await loadImage(imageUrl);
  const size = croppedOutputSize(area);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no permite recortar imágenes");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size.width, size.height);
  context.imageSmoothingQuality = "high";
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, size.width, size.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", PHOTO_OUTPUT_QUALITY));
  if (!blob) throw new Error("No se pudo generar el recorte");
  return new File([blob], croppedFileName(originalName), { type: "image/jpeg" });
}
