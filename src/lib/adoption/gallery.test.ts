import { describe, expect, it } from "vitest";
import { SWIPE_MIN_PX, swipeDelta, wrapIndex } from "./gallery";

describe("wrapIndex", () => {
  it("avanza y retrocede", () => {
    expect(wrapIndex(1, 1, 4)).toBe(2);
    expect(wrapIndex(2, -1, 4)).toBe(1);
  });

  it("de la última vuelve a la primera y al revés", () => {
    expect(wrapIndex(3, 1, 4)).toBe(0);
    expect(wrapIndex(0, -1, 4)).toBe(3);
  });

  it("con una sola foto o ninguna se queda en 0", () => {
    expect(wrapIndex(0, 1, 1)).toBe(0);
    expect(wrapIndex(0, -1, 0)).toBe(0);
  });
});

describe("swipeDelta", () => {
  it("deslizar a la izquierda pasa a la siguiente; a la derecha, a la anterior", () => {
    expect(swipeDelta(-SWIPE_MIN_PX)).toBe(1);
    expect(swipeDelta(SWIPE_MIN_PX + 10)).toBe(-1);
  });

  it("un movimiento corto no cambia de foto", () => {
    expect(swipeDelta(SWIPE_MIN_PX - 1)).toBe(0);
    expect(swipeDelta(-(SWIPE_MIN_PX - 1))).toBe(0);
  });
});
