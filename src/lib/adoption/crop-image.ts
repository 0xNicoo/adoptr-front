import { CropArea, PHOTO_OUTPUT_QUALITY, croppedFileName, croppedOutputSize } from "./photo-crop";

// Recorte en el navegador con un canvas (solo cliente). El canvas no copia los metadatos de la foto,
// así que el archivo que se sube ya no trae la ubicación GPS. Los navegadores actuales aplican la
// orientación EXIF al dibujar la imagen, igual que al mostrarla en el recorte.

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo abrir la imagen"));
    image.src = url;
  });
}

/** Devuelve la zona elegida de la imagen como JPEG 4:3 de hasta 1600×1200. */
export async function cropToFile(imageUrl: string, area: CropArea, originalName: string): Promise<File> {
  const image = await loadImage(imageUrl);
  const size = croppedOutputSize(area);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no permite recortar imágenes");
  // JPEG no tiene transparencia: lo transparente de un PNG queda blanco, como en el back.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size.width, size.height);
  context.imageSmoothingQuality = "high";
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, size.width, size.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", PHOTO_OUTPUT_QUALITY));
  if (!blob) throw new Error("No se pudo generar el recorte");
  return new File([blob], croppedFileName(originalName), { type: "image/jpeg" });
}
