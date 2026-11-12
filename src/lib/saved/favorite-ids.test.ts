import { describe, expect, it, vi } from "vitest";
import { viewerFavoriteIds } from "./favorite-ids";

describe("viewerFavoriteIds", () => {
  it("sin sesión no consulta y devuelve vacío", async () => {
    const load = vi.fn(async () => [1]);

    const ids = await viewerFavoriteIds(load, false);

    expect(load).not.toHaveBeenCalled();
    expect(ids.size).toBe(0);
  });

  it("arma el conjunto con los ids", async () => {
    const ids = await viewerFavoriteIds(async () => [3, 1], true);

    expect(ids.has(3)).toBe(true);
    expect(ids.has(1)).toBe(true);
    expect(ids.has(2)).toBe(false);
  });

  it("si la consulta falla (por ejemplo, sesión vencida) devuelve vacío", async () => {
    const ids = await viewerFavoriteIds(async () => {
      throw new Error("401");
    }, true);

    expect(ids.size).toBe(0);
  });
});
