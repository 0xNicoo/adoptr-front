import { describe, expect, it } from "vitest";
import { settleFavorite } from "./favorite-call";

describe("settleFavorite", () => {
  it("devuelve el resultado de la acción", async () => {
    expect(await settleFavorite(Promise.resolve({ ok: false, code: "FAVORITE_OWN_PUBLICATION" }))).toEqual({
      ok: false,
      code: "FAVORITE_OWN_PUBLICATION",
    });
  });

  it("si la acción se rechaza (red caída, deploy nuevo) devuelve un error desconocido", async () => {
    expect(await settleFavorite(Promise.reject(new Error("Failed to find Server Action")))).toEqual({
      ok: false,
      code: "UNKNOWN_ERROR",
    });
  });

  it("si la acción no devuelve nada también es un error", async () => {
    expect(await settleFavorite(Promise.resolve(undefined))).toEqual({ ok: false, code: "UNKNOWN_ERROR" });
  });
});
