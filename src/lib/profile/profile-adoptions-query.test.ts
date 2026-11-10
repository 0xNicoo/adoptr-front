import { describe, expect, it } from "vitest";
import {
  MY_PROFILE_PATH,
  PROFILE_ADOPTIONS_PAGE_SIZE,
  parseProfileAdoptionsQuery,
  profileAdoptionsHref,
  toProfileAdoptionsApiParams,
} from "./profile-adoptions-query";

describe("parseProfileAdoptionsQuery", () => {
  it("sin parámetros: todas y página 1", () => {
    expect(parseProfileAdoptionsQuery({})).toEqual({ onlyAvailable: false, page: 1 });
  });

  it("lee el filtro y la página", () => {
    expect(parseProfileAdoptionsQuery({ status: "available", page: "3" })).toEqual({ onlyAvailable: true, page: 3 });
  });

  it("ignora valores desconocidos", () => {
    expect(parseProfileAdoptionsQuery({ status: "AVAILABLE", page: "0" })).toEqual({ onlyAvailable: false, page: 1 });
    expect(parseProfileAdoptionsQuery({ status: "adopted", page: "-2" })).toEqual({ onlyAvailable: false, page: 1 });
    expect(parseProfileAdoptionsQuery({ page: "2.5" })).toEqual({ onlyAvailable: false, page: 1 });
    expect(parseProfileAdoptionsQuery({ page: "99999999999999999999" })).toEqual({ onlyAvailable: false, page: 1 });
  });

  it("si un parámetro viene repetido usa el primero", () => {
    expect(parseProfileAdoptionsQuery({ status: ["available", "x"], page: ["2", "5"] })).toEqual({
      onlyAvailable: true,
      page: 2,
    });
  });
});

describe("toProfileAdoptionsApiParams", () => {
  it("todas: sin status y página desde 0", () => {
    expect(toProfileAdoptionsApiParams({ onlyAvailable: false, page: 1 }).toString()).toBe(
      `page=0&pageSize=${PROFILE_ADOPTIONS_PAGE_SIZE}`,
    );
  });

  it("solo en adopción: manda el enum de la API", () => {
    expect(toProfileAdoptionsApiParams({ onlyAvailable: true, page: 3 }).toString()).toBe(
      `status=AVAILABLE&page=2&pageSize=${PROFILE_ADOPTIONS_PAGE_SIZE}`,
    );
  });
});

describe("profileAdoptionsHref", () => {
  it("sin filtro en la primera página: la ruta sola", () => {
    expect(profileAdoptionsHref(MY_PROFILE_PATH, { onlyAvailable: false, page: 1 })).toBe("/profile");
  });

  it("con filtro y página, en cualquier ruta de perfil", () => {
    expect(profileAdoptionsHref(MY_PROFILE_PATH, { onlyAvailable: true, page: 2 })).toBe(
      "/profile?status=available&page=2",
    );
    expect(profileAdoptionsHref("/profiles/3", { onlyAvailable: false, page: 4 })).toBe("/profiles/3?page=4");
  });

  it("ida y vuelta con parseProfileAdoptionsQuery", () => {
    const query = { onlyAvailable: true, page: 4 };
    const params = Object.fromEntries(new URL(profileAdoptionsHref("/profiles/3", query), "http://x").searchParams);
    expect(parseProfileAdoptionsQuery(params)).toEqual(query);
  });
});
