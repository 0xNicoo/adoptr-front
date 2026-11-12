import { describe, expect, it } from "vitest";
import { removeItem, restoreItem } from "./saved-list";

const a = { id: 1 };
const b = { id: 2 };
const c = { id: 3 };

describe("removeItem", () => {
  it("saca el ítem y recuerda dónde estaba", () => {
    expect(removeItem([a, b, c], 2)).toEqual({ items: [a, c], removed: { item: b, index: 1 } });
  });

  it("con un id que no está no cambia nada", () => {
    expect(removeItem([a, c], 9)).toEqual({ items: [a, c], removed: null });
  });
});

describe("restoreItem", () => {
  it("lo devuelve a su lugar", () => {
    expect(restoreItem([a, c], { item: b, index: 1 })).toEqual([a, b, c]);
  });

  it("después de quitar el último de la página", () => {
    expect(restoreItem([], { item: b, index: 0 })).toEqual([b]);
  });

  it("si el lugar ya no existe lo agrega al final", () => {
    expect(restoreItem([a], { item: b, index: 5 })).toEqual([a, b]);
  });

  it("si ya está no lo duplica", () => {
    expect(restoreItem([a, b], { item: b, index: 0 })).toEqual([a, b]);
  });
});
