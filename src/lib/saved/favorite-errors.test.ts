import { describe, expect, it } from "vitest";
import { favoriteErrorMessage } from "./favorite-errors";

describe("favoriteErrorMessage", () => {
  it("publicación propia", () => {
    expect(favoriteErrorMessage("FAVORITE_OWN_PUBLICATION", "Luna", "save")).toBe(
      "Es tu publicación: no hace falta guardarla.",
    );
  });

  it("otro error al guardar", () => {
    expect(favoriteErrorMessage("UNKNOWN_ERROR", "Luna", "save")).toBe("No pudimos guardar a Luna. Probá de nuevo.");
  });

  it("otro error al quitar", () => {
    expect(favoriteErrorMessage("UNKNOWN_ERROR", "Luna", "unsave")).toBe("No pudimos quitar a Luna. Probá de nuevo.");
  });
});
