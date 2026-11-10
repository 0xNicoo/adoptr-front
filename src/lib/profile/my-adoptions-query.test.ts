import { describe, expect, it } from "vitest";
import {
  MY_ADOPTIONS_PAGE_SIZE,
  myProfileHref,
  parseMyAdoptionsQuery,
  toMyAdoptionsApiParams,
} from "./my-adoptions-query";

describe("parseMyAdoptionsQuery", () => {
  it("sin parámetros: todas y página 1", () => {
    expect(parseMyAdoptionsQuery({})).toEqual({ onlyAvailable: false, page: 1 });
  });

  it("lee el filtro y la página", () => {
    expect(parseMyAdoptionsQuery({ status: "available", page: "3" })).toEqual({ onlyAvailable: true, page: 3 });
  });

  it("ignora valores desconocidos", () => {
    expect(parseMyAdoptionsQuery({ status: "AVAILABLE", page: "0" })).toEqual({ onlyAvailable: false, page: 1 });
    expect(parseMyAdoptionsQuery({ status: "adopted", page: "-2" })).toEqual({ onlyAvailable: false, page: 1 });
    expect(parseMyAdoptionsQuery({ page: "2.5" })).toEqual({ onlyAvailable: false, page: 1 });
    expect(parseMyAdoptionsQuery({ page: "99999999999999999999" })).toEqual({ onlyAvailable: false, page: 1 });
  });

  it("si un parámetro viene repetido usa el primero", () => {
    expect(parseMyAdoptionsQuery({ status: ["available", "x"], page: ["2", "5"] })).toEqual({
      onlyAvailable: true,
      page: 2,
    });
  });
});

describe("toMyAdoptionsApiParams", () => {
  it("todas: sin status y página desde 0", () => {
    expect(toMyAdoptionsApiParams({ onlyAvailable: false, page: 1 }).toString()).toBe(
      `page=0&pageSize=${MY_ADOPTIONS_PAGE_SIZE}`,
    );
  });

  it("solo en adopción: manda el enum de la API", () => {
    expect(toMyAdoptionsApiParams({ onlyAvailable: true, page: 3 }).toString()).toBe(
      `status=AVAILABLE&page=2&pageSize=${MY_ADOPTIONS_PAGE_SIZE}`,
    );
  });
});

describe("myProfileHref", () => {
  it("sin filtro en la primera página: la ruta sola", () => {
    expect(myProfileHref({ onlyAvailable: false, page: 1 })).toBe("/profile");
  });

  it("con filtro y página", () => {
    expect(myProfileHref({ onlyAvailable: true, page: 2 })).toBe("/profile?status=available&page=2");
  });

  it("ida y vuelta con parseMyAdoptionsQuery", () => {
    const query = { onlyAvailable: true, page: 4 };
    const params = Object.fromEntries(new URL(myProfileHref(query), "http://x").searchParams);
    expect(parseMyAdoptionsQuery(params)).toEqual(query);
  });
});
