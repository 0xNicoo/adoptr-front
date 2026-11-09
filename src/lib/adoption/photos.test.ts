import { describe, expect, it } from "vitest";
import { MAX_PHOTOS, MAX_PHOTO_BYTES, photoUploadMessage, selectPhotos, uploadInOrder } from "./photos";

const jpg = (name: string, size = 1000) => ({ name, size, type: "image/jpeg" });

describe("selectPhotos", () => {
  it("acepta JPEG, PNG y WebP de hasta 5 MB, incluido el límite exacto", () => {
    const files = [jpg("a.jpg", MAX_PHOTO_BYTES), { ...jpg("b.png"), type: "image/png" }, { ...jpg("c.webp"), type: "image/webp" }];
    expect(selectPhotos(files, 0)).toEqual({ accepted: files, rejected: [] });
  });

  it("rechaza otro formato, un archivo vacío o uno demasiado pesado, nombrando el archivo", () => {
    const { accepted, rejected } = selectPhotos(
      [{ ...jpg("foto.heic"), type: "image/heic" }, jpg("vacia.jpg", 0), jpg("pesada.jpg", MAX_PHOTO_BYTES + 1)],
      0,
    );
    expect(accepted).toEqual([]);
    expect(rejected).toEqual([
      "foto.heic: tiene que ser JPG, PNG o WebP.",
      "vacia.jpg: el archivo está vacío.",
      "pesada.jpg: pesa más de 5 MB.",
    ]);
  });

  it("no pasa del máximo contando las que ya estaban", () => {
    const { accepted, rejected } = selectPhotos([jpg("a.jpg"), jpg("b.jpg"), jpg("c.jpg")], MAX_PHOTOS - 2);
    expect(accepted.map((file) => file.name)).toEqual(["a.jpg", "b.jpg"]);
    expect(rejected).toEqual([`c.jpg: ya llegaste al máximo de ${MAX_PHOTOS} fotos.`]);
  });

  it("un archivo rechazado no ocupa lugar", () => {
    const { accepted } = selectPhotos([jpg("pesada.jpg", MAX_PHOTO_BYTES + 1), jpg("a.jpg")], MAX_PHOTOS - 1);
    expect(accepted.map((file) => file.name)).toEqual(["a.jpg"]);
  });
});

describe("photoUploadMessage", () => {
  it("explica los errores conocidos y tiene un texto genérico para el resto", () => {
    expect(photoUploadMessage("IMAGE_TOO_LARGE")).toBe("Es demasiado grande: hasta 5 MB y 40 megapíxeles.");
    expect(photoUploadMessage("IMAGE_INVALID")).toBe("No es una imagen JPG, PNG o WebP válida.");
    expect(photoUploadMessage("IMAGE_STORAGE_UNAVAILABLE")).toBe("No pudimos guardarla en este momento.");
    expect(photoUploadMessage("CUALQUIER_OTRO")).toBe("No pudimos subirla.");
  });
});

describe("uploadInOrder", () => {
  it("sube de a una y en orden: la siguiente empieza cuando termina la anterior", async () => {
    const events: string[] = [];
    const failures = await uploadInOrder(["a", "b", "c"], async (item) => {
      events.push(`inicio ${item}`);
      await Promise.resolve();
      events.push(`fin ${item}`);
      return null;
    });
    expect(failures).toEqual([]);
    expect(events).toEqual(["inicio a", "fin a", "inicio b", "fin b", "inicio c", "fin c"]);
  });

  it("si una falla sigue con las demás y devuelve solo las fallidas", async () => {
    const uploaded: string[] = [];
    const failures = await uploadInOrder(["a", "b", "c"], async (item) => {
      uploaded.push(item);
      return item === "b" ? "IMAGE_INVALID" : null;
    });
    expect(uploaded).toEqual(["a", "b", "c"]);
    expect(failures).toEqual([{ item: "b", code: "IMAGE_INVALID" }]);
  });

  it("un corte de conexión cuenta como fallo y no frena el resto", async () => {
    const failures = await uploadInOrder(["a", "b"], async (item) => {
      if (item === "a") throw new Error("Failed to fetch");
      return null;
    });
    expect(failures).toEqual([{ item: "a", code: "UNKNOWN_ERROR" }]);
  });

  it("informa el avance", async () => {
    const progress: [number, number][] = [];
    await uploadInOrder(["a", "b"], async () => null, (current, total) => progress.push([current, total]));
    expect(progress).toEqual([[1, 2], [2, 2]]);
  });
});
