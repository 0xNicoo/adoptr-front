import { describe, expect, it } from "vitest";
import { Species } from "@/lib/api/models/adoption/species";
import { SAVED_PATH, parseSavedQuery, savedCountText, savedHref, toSavedApiParams } from "./saved-query";

describe("parseSavedQuery", () => {
  it("sin parámetros: todas y página 1", () => {
    expect(parseSavedQuery({})).toEqual({ species: null, page: 1 });
  });

  it("lee la especie y la página", () => {
    expect(parseSavedQuery({ species: "dog", page: "2" })).toEqual({ species: Species.DOG, page: 2 });
  });

  it("ignora valores desconocidos", () => {
    expect(parseSavedQuery({ species: "fish", page: "-1" })).toEqual({ species: null, page: 1 });
    expect(parseSavedQuery({ species: "DOG", page: "2.5" })).toEqual({ species: null, page: 1 });
  });

  it("si un parámetro viene repetido usa el primero", () => {
    expect(parseSavedQuery({ species: ["cat", "dog"], page: ["3", "1"] })).toEqual({ species: Species.CAT, page: 3 });
  });
});

describe("toSavedApiParams", () => {
  it("pasa la especie en mayúsculas y la página desde 0", () => {
    expect(toSavedApiParams({ species: Species.CAT, page: 3 }).toString()).toBe("species=CAT&page=2&pageSize=12");
  });

  it("sin especie no la manda", () => {
    expect(toSavedApiParams({ species: null, page: 1 }).toString()).toBe("page=0&pageSize=12");
  });
});

describe("savedHref", () => {
  it("sin filtros es la ruta sola", () => {
    expect(savedHref({ species: null, page: 1 })).toBe(SAVED_PATH);
  });

  it("con especie y página", () => {
    expect(savedHref({ species: Species.DOG, page: 2 })).toBe("/saved?species=dog&page=2");
  });
});

describe("savedCountText", () => {
  it("cuenta mascotas sin filtro", () => {
    expect(savedCountText(1, null)).toBe("1 mascota guardada");
    expect(savedCountText(6, null)).toBe("6 mascotas guardadas");
  });

  it("cuenta perros o gatos con filtro", () => {
    expect(savedCountText(1, Species.DOG)).toBe("1 perro guardado");
    expect(savedCountText(3, Species.CAT)).toBe("3 gatos guardados");
  });
});
