import { describe, expect, it } from "vitest";
import { Locality } from "@/lib/api/models/locality/locality";
import { Gender } from "@/lib/api/models/profile/gender";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import {
  EMPTY_PROFILE_DRAFT,
  MAX_DESCRIPTION,
  MAX_NAME,
  MAX_SOCIAL,
  ProfileDraft,
  firstInvalidSection,
  toCreateProfileInput,
  validateProfileSection,
} from "./profile-form";

const LA_PLATA: Locality = { id: 6441030, name: "La Plata", displayName: "La Plata" };

const PERSON: ProfileDraft = {
  ...EMPTY_PROFILE_DRAFT,
  profileType: ProfileType.PERSON,
  firstName: " Dolores ",
  lastName: "Dominguez",
  genderType: Gender.X,
  location: { provinceId: 6, locality: LA_PLATA },
  description: " Tengo una perra. ",
};

const ORGANIZATION: ProfileDraft = {
  ...EMPTY_PROFILE_DRAFT,
  profileType: ProfileType.ORGANIZATION,
  organizationName: "Refugio Patitas",
  instagram: "@patitas",
  facebook: "  ",
  website: "https://patitas.org",
  location: { provinceId: 6, locality: LA_PLATA },
  description: "Rescatamos perros y gatos.",
};

describe("validateProfileSection", () => {
  it("el tipo es obligatorio", () => {
    expect(validateProfileSection("type", EMPTY_PROFILE_DRAFT)).toEqual({ profileType: "Elegí una opción." });
    expect(validateProfileSection("type", PERSON)).toEqual({});
  });

  it("una persona necesita nombre, apellido y género", () => {
    expect(validateProfileSection("data", { ...PERSON, firstName: " ", lastName: "", genderType: null })).toEqual({
      firstName: "Ingresá tu nombre.",
      lastName: "Ingresá tu apellido.",
      genderType: "Elegí una opción.",
    });
    expect(validateProfileSection("data", PERSON)).toEqual({});
  });

  it("respeta los largos máximos", () => {
    expect(validateProfileSection("data", { ...PERSON, firstName: "a".repeat(MAX_NAME + 1) })).toEqual({
      firstName: `Usá como máximo ${MAX_NAME} caracteres.`,
    });
    expect(validateProfileSection("data", { ...ORGANIZATION, instagram: "a".repeat(MAX_SOCIAL + 1) })).toEqual({
      instagram: `Usá como máximo ${MAX_SOCIAL} caracteres.`,
    });
    expect(
      validateProfileSection("description", { ...PERSON, description: "a".repeat(MAX_DESCRIPTION + 1) }),
    ).toEqual({ description: `Usá como máximo ${MAX_DESCRIPTION} caracteres.` });
  });

  it("una organización necesita nombre y, si tiene web, que empiece con http", () => {
    expect(validateProfileSection("data", { ...ORGANIZATION, organizationName: "", website: "patitas.org" })).toEqual({
      organizationName: "Ingresá el nombre de la organización.",
      website: "Tiene que empezar con http:// o https://",
    });
    expect(validateProfileSection("data", { ...ORGANIZATION, website: "" })).toEqual({});
    expect(validateProfileSection("data", { ...ORGANIZATION, website: "HTTP://patitas.org" })).toEqual({});
  });

  it("la ubicación necesita provincia y localidad", () => {
    expect(validateProfileSection("location", { ...PERSON, location: { provinceId: null, locality: null } })).toEqual({
      province: "Elegí la provincia.",
    });
    expect(validateProfileSection("location", { ...PERSON, location: { provinceId: 6, locality: null } })).toEqual({
      locality: "Elegí la localidad de la lista.",
    });
    expect(validateProfileSection("location", PERSON)).toEqual({});
  });

  it("la descripción es obligatoria", () => {
    expect(validateProfileSection("description", { ...PERSON, description: "  " })).toEqual({
      description: "Escribí una descripción.",
    });
  });
});

describe("firstInvalidSection", () => {
  it("devuelve la primera sección con errores, en el orden pedido", () => {
    const draft = { ...PERSON, firstName: "", description: "" };
    expect(firstInvalidSection(draft, ["type", "data", "location", "description"])).toBe("data");
    expect(firstInvalidSection(draft, ["location", "description"])).toBe("description");
  });

  it("devuelve null si todo está bien", () => {
    expect(firstInvalidSection(PERSON, ["type", "data", "location", "description"])).toBeNull();
  });
});

describe("toCreateProfileInput", () => {
  it("arma una persona con los textos recortados", () => {
    expect(toCreateProfileInput({ ...PERSON, organizationName: "Ignorado" })).toEqual({
      profileType: ProfileType.PERSON,
      firstName: "Dolores",
      lastName: "Dominguez",
      genderType: Gender.X,
      description: "Tengo una perra.",
      localityId: 6441030,
    });
  });

  it("arma una organización sin las redes vacías", () => {
    expect(toCreateProfileInput({ ...ORGANIZATION, firstName: "Ignorado" })).toEqual({
      profileType: ProfileType.ORGANIZATION,
      organizationName: "Refugio Patitas",
      instagram: "@patitas",
      facebook: undefined,
      website: "https://patitas.org",
      description: "Rescatamos perros y gatos.",
      localityId: 6441030,
    });
  });
});
