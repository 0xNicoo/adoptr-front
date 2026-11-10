import { describe, expect, it } from "vitest";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import {
  MY_PROFILE_PATH,
  PROFILE_ADOPTIONS_PAGE_SIZE,
  parseProfileAdoptionsQuery,
  profileAdoptionsHref,
  toProfileAdoptionsApiParams,
} from "./profile-adoptions-query";

describe("parseProfileAdoptionsQuery", () => {
  it("sin parámetros: todas y página 1", () => {
    expect(parseProfileAdoptionsQuery({})).toEqual({ status: null, page: 1 });
  });

  it("lee el filtro y la página", () => {
    expect(parseProfileAdoptionsQuery({ status: "available", page: "3" })).toEqual({ status: AdoptionStatus.AVAILABLE, page: 3 });
  });

  it("ignora valores desconocidos", () => {
    expect(parseProfileAdoptionsQuery({ status: "AVAILABLE", page: "0" })).toEqual({ status: null, page: 1 });
    expect(parseProfileAdoptionsQuery({ status: "adoptadas", page: "-2" })).toEqual({ status: null, page: 1 });
    expect(parseProfileAdoptionsQuery({ page: "2.5" })).toEqual({ status: null, page: 1 });
    expect(parseProfileAdoptionsQuery({ page: "99999999999999999999" })).toEqual({ status: null, page: 1 });
  });

  it("si un parámetro viene repetido usa el primero", () => {
    expect(parseProfileAdoptionsQuery({ status: ["available", "x"], page: ["2", "5"] })).toEqual({
      status: AdoptionStatus.AVAILABLE,
      page: 2,
    });
  });
});

describe("filtro de adoptadas", () => {
  it("se lee de la URL, va a la API con el enum y vuelve a la URL", () => {
    const query = parseProfileAdoptionsQuery({ status: "adopted" });
    expect(query).toEqual({ status: AdoptionStatus.ADOPTED, page: 1 });
    expect(toProfileAdoptionsApiParams(query).get("status")).toBe("ADOPTED");
    expect(profileAdoptionsHref("/profiles/3", { ...query, page: 2 })).toBe("/profiles/3?status=adopted&page=2");
  });
});

describe("toProfileAdoptionsApiParams", () => {
  it("todas: sin status y página desde 0", () => {
    expect(toProfileAdoptionsApiParams({ status: null, page: 1 }).toString()).toBe(
      `page=0&pageSize=${PROFILE_ADOPTIONS_PAGE_SIZE}`,
    );
  });

  it("solo en adopción: manda el enum de la API", () => {
    expect(toProfileAdoptionsApiParams({ status: AdoptionStatus.AVAILABLE, page: 3 }).toString()).toBe(
      `status=AVAILABLE&page=2&pageSize=${PROFILE_ADOPTIONS_PAGE_SIZE}`,
    );
  });
});

describe("profileAdoptionsHref", () => {
  it("sin filtro en la primera página: la ruta sola", () => {
    expect(profileAdoptionsHref(MY_PROFILE_PATH, { status: null, page: 1 })).toBe("/profile");
  });

  it("con filtro y página, en cualquier ruta de perfil", () => {
    expect(profileAdoptionsHref(MY_PROFILE_PATH, { status: AdoptionStatus.AVAILABLE, page: 2 })).toBe(
      "/profile?status=available&page=2",
    );
    expect(profileAdoptionsHref("/profiles/3", { status: null, page: 4 })).toBe("/profiles/3?page=4");
  });

  it("ida y vuelta con parseProfileAdoptionsQuery", () => {
    const query = { status: AdoptionStatus.AVAILABLE, page: 4 };
    const params = Object.fromEntries(new URL(profileAdoptionsHref("/profiles/3", query), "http://x").searchParams);
    expect(parseProfileAdoptionsQuery(params)).toEqual(query);
  });
});
