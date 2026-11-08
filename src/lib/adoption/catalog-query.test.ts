import { describe, expect, it } from "vitest";
import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { CATALOG_PAGE_SIZE, catalogHref, parseCatalogQuery, toApiParams } from "./catalog-query";

describe("parseCatalogQuery", () => {
  it("sin parámetros: sin filtros y página 1", () => {
    expect(parseCatalogQuery({})).toEqual({ filters: {}, page: 1 });
  });

  it("traduce los valores de la URL a los enums de la API", () => {
    expect(
      parseCatalogQuery({
        species: "dog",
        size: "medium",
        sex: "female",
        lifeStage: "adult",
        province: "6",
        locality: "6441030",
        page: "3",
      }),
    ).toEqual({
      filters: {
        species: Species.DOG,
        size: PetSize.MEDIUM,
        sex: PetSex.FEMALE,
        lifeStage: LifeStage.ADULT,
        provinceId: 6,
        localityId: 6441030,
      },
      page: 3,
    });
  });

  it("ignora el tamaño si la especie no es perro", () => {
    expect(parseCatalogQuery({ size: "small" }).filters).toEqual({});
    expect(parseCatalogQuery({ species: "cat", size: "small" }).filters).toEqual({ species: Species.CAT });
  });

  it("ignora valores desconocidos sin fallar", () => {
    expect(
      parseCatalogQuery({ species: "fish", sex: "x", lifeStage: "old", province: "abc", locality: "-4", page: "0" }),
    ).toEqual({ filters: {}, page: 1 });
  });

  it("si un parámetro viene repetido, usa el primero", () => {
    expect(parseCatalogQuery({ species: ["cat", "dog"] }).filters).toEqual({ species: Species.CAT });
  });

  it("una página no entera vuelve a la 1", () => {
    expect(parseCatalogQuery({ page: "2.5" }).page).toBe(1);
  });
});

describe("toApiParams", () => {
  it("usa los enums de la API, página desde 0 y el tamaño de página del catálogo", () => {
    const params = toApiParams({
      filters: { species: Species.DOG, size: PetSize.LARGE, provinceId: 6 },
      page: 2,
    });

    expect(Object.fromEntries(params)).toEqual({
      species: "DOG",
      size: "LARGE",
      provinceId: "6",
      page: "1",
      pageSize: String(CATALOG_PAGE_SIZE),
    });
  });
});

describe("catalogHref", () => {
  it("arma la URL en minúsculas y omite la página 1", () => {
    expect(catalogHref({ filters: { species: Species.CAT, lifeStage: LifeStage.PUPPY }, page: 1 })).toBe(
      "/adoptions?species=cat&lifeStage=puppy",
    );
  });

  it("incluye la página desde la 2", () => {
    expect(catalogHref({ filters: { provinceId: 6, localityId: 6441030 }, page: 2 })).toBe(
      "/adoptions?province=6&locality=6441030&page=2",
    );
  });

  it("sin filtros es el catálogo a secas", () => {
    expect(catalogHref({ filters: {}, page: 1 })).toBe("/adoptions");
  });

  it("ida y vuelta conserva la búsqueda", () => {
    const query = {
      filters: { species: Species.DOG, size: PetSize.SMALL, sex: PetSex.MALE, provinceId: 2 },
      page: 4,
    };
    const params = Object.fromEntries(new URL(catalogHref(query), "http://x").searchParams);
    expect(parseCatalogQuery(params)).toEqual(query);
  });
});
