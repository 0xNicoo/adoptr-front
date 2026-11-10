import { describe, expect, it } from "vitest";
import { PHOTO_MAX_ZOOM, PHOTO_MIN_ZOOM, clampZoom, croppedFileName, croppedOutputSize } from "./photo-crop";

describe("croppedOutputSize", () => {
  it("achica a 1200×1600 una zona grande", () => {
    expect(croppedOutputSize({ width: 3024 })).toEqual({ width: 1200, height: 1600 });
  });

  it("no agranda una zona chica", () => {
    expect(croppedOutputSize({ width: 600 })).toEqual({ width: 600, height: 800 });
  });

  it("siempre es 3:4 vertical exacto, aunque la zona tenga decimales", () => {
    const size = croppedOutputSize({ width: 1013.6 });
    expect(size.width * 4).toBe(size.height * 3);
    expect(Number.isInteger(size.height)).toBe(true);
    expect(size).toEqual({ width: 1014, height: 1352 });
  });

  it("tiene un mínimo para no quedar en cero", () => {
    expect(croppedOutputSize({ width: 0.4 })).toEqual({ width: 3, height: 4 });
  });
});

describe("croppedFileName", () => {
  it("cambia la extensión por .jpg", () => {
    expect(croppedFileName("perro.png")).toBe("perro.jpg");
    expect(croppedFileName("IMG_2024.03.webp")).toBe("IMG_2024.03.jpg");
    expect(croppedFileName("foto.JPEG")).toBe("foto.jpg");
  });

  it("sin extensión o sin nombre", () => {
    expect(croppedFileName("perro")).toBe("perro.jpg");
    expect(croppedFileName(".png")).toBe("foto.jpg");
  });
});

describe("clampZoom", () => {
  it("respeta los límites del control", () => {
    expect(clampZoom(0.5)).toBe(PHOTO_MIN_ZOOM);
    expect(clampZoom(10)).toBe(PHOTO_MAX_ZOOM);
    expect(clampZoom(1.234)).toBe(1.23);
  });
});
