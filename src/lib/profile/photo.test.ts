import { describe, expect, it } from "vitest";
import {
  PROFILE_PHOTO_FORMAT,
  photoAction,
  photoPreviewUrl,
  profilePhotoErrorMessage,
  profilePhotoFileError,
} from "./photo";

const MB = 1024 * 1024;

describe("PROFILE_PHOTO_FORMAT", () => {
  it("es cuadrado y de hasta 800 px", () => {
    expect(PROFILE_PHOTO_FORMAT).toEqual({ aspectWidth: 1, aspectHeight: 1, maxOutputWidth: 800 });
  });
});

describe("photoPreviewUrl", () => {
  const google = "https://lh3.googleusercontent.com/a/foto=s96-c";

  it("muestra la foto elegida", () => {
    const file = new File([new Uint8Array([1])], "foto.jpg", { type: "image/jpeg" });
    expect(photoPreviewUrl({ kind: "upload", file, previewUrl: "blob:subida" }, google)).toBe("blob:subida");
    expect(photoPreviewUrl({ kind: "google" }, google)).toBe(google);
  });

  it("sin foto no muestra nada, aunque haya foto de Google", () => {
    expect(photoPreviewUrl({ kind: "none" }, google)).toBeNull();
    expect(photoPreviewUrl({ kind: "google" }, null)).toBeNull();
  });

  it("al editar, muestra la foto actual mientras no se cambie", () => {
    expect(photoPreviewUrl({ kind: "current" }, google, "https://cdn/actual.jpg")).toBe("https://cdn/actual.jpg");
    expect(photoPreviewUrl({ kind: "none" }, google, "https://cdn/actual.jpg")).toBeNull();
  });
});

describe("photoAction", () => {
  const file = new File([new Uint8Array([1])], "foto.jpg", { type: "image/jpeg" });

  it("sube la foto elegida o usa la de Google", () => {
    expect(photoAction({ kind: "upload", file, previewUrl: "blob:x" }, false)).toBe("upload");
    expect(photoAction({ kind: "google" }, true)).toBe("google");
  });

  it("no hace nada si la foto no cambió", () => {
    expect(photoAction({ kind: "current" }, true)).toBe("keep");
    expect(photoAction({ kind: "none" }, false)).toBe("keep");
  });

  it("borra la foto si tenía y se quitó", () => {
    expect(photoAction({ kind: "none" }, true)).toBe("delete");
  });
});

describe("profilePhotoFileError", () => {
  it("acepta JPG, PNG y WebP de hasta 5 MB", () => {
    expect(profilePhotoFileError({ type: "image/jpeg", size: 5 * MB })).toBeNull();
    expect(profilePhotoFileError({ type: "image/png", size: 1 })).toBeNull();
    expect(profilePhotoFileError({ type: "image/webp", size: 1 })).toBeNull();
  });

  it("rechaza otros formatos", () => {
    expect(profilePhotoFileError({ type: "image/gif", size: 1 })).toBe("La foto tiene que ser JPG, PNG o WebP.");
    expect(profilePhotoFileError({ type: "", size: 1 })).toBe("La foto tiene que ser JPG, PNG o WebP.");
  });

  it("rechaza archivos vacíos o de más de 5 MB", () => {
    expect(profilePhotoFileError({ type: "image/jpeg", size: 0 })).toBe("El archivo está vacío.");
    expect(profilePhotoFileError({ type: "image/jpeg", size: 5 * MB + 1 })).toBe(
      "La foto es demasiado grande: hasta 5 MB.",
    );
  });
});

describe("profilePhotoErrorMessage", () => {
  it("explica los errores conocidos del back", () => {
    expect(profilePhotoErrorMessage("IMAGE_INVALID")).toBe("La foto tiene que ser JPG, PNG o WebP.");
    expect(profilePhotoErrorMessage("IMAGE_TOO_LARGE")).toBe("La foto es demasiado grande: hasta 5 MB.");
    expect(profilePhotoErrorMessage("GOOGLE_PHOTO_NOT_FOUND")).toBe("Tu cuenta de Google ya no tiene foto.");
    expect(profilePhotoErrorMessage("GOOGLE_PHOTO_UNAVAILABLE")).toBe("No pudimos traer tu foto de Google.");
  });

  it("cualquier otro error tiene un mensaje genérico", () => {
    expect(profilePhotoErrorMessage("IMAGE_STORAGE_UNAVAILABLE")).toBe("No pudimos guardar la foto.");
    expect(profilePhotoErrorMessage("UNKNOWN_ERROR")).toBe("No pudimos guardar la foto.");
  });
});
