import { describe, expect, it } from "vitest";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { Gender } from "@/lib/api/models/profile/gender";
import { OrganizationProfile, PersonProfile } from "@/lib/api/models/profile/profile";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import { initials, parseProfileId, profileAdoptionsCountText, profileDisplayName, profileShortName } from "./display";

const base = {
  id: 1,
  description: "Descripción",
  photoUrl: null,
  locality: { id: 1, name: "La Plata", displayName: "La Plata" },
  province: { id: 6, name: "Buenos Aires" },
};

const person: PersonProfile = {
  ...base,
  profileType: ProfileType.PERSON,
  firstName: "Victoria",
  lastName: "Miranda",
  genderType: Gender.FEMALE,
  organizationName: null,
  instagram: null,
  facebook: null,
  website: null,
};

const organization: OrganizationProfile = {
  ...base,
  profileType: ProfileType.ORGANIZATION,
  organizationName: "Refugio Patitas",
  instagram: null,
  facebook: null,
  website: null,
  firstName: null,
  lastName: null,
  genderType: null,
};

describe("profileDisplayName", () => {
  it("persona: nombre y apellido", () => {
    expect(profileDisplayName(person)).toBe("Victoria Miranda");
  });

  it("organización: su nombre", () => {
    expect(profileDisplayName(organization)).toBe("Refugio Patitas");
  });
});

describe("profileShortName", () => {
  it("persona: nombre de pila; organización: su nombre", () => {
    expect(profileShortName(person)).toBe("Victoria");
    expect(profileShortName(organization)).toBe("Refugio Patitas");
  });
});

describe("parseProfileId", () => {
  it("entero positivo", () => {
    expect(parseProfileId("3")).toBe(3);
  });

  it("rechaza lo que no es un id", () => {
    expect(parseProfileId("0")).toBeNull();
    expect(parseProfileId("-1")).toBeNull();
    expect(parseProfileId("abc")).toBeNull();
    expect(parseProfileId("2.5")).toBeNull();
    expect(parseProfileId("99999999999999999999")).toBeNull();
  });
});

describe("initials", () => {
  it("toma las dos primeras palabras", () => {
    expect(initials("Victoria Miranda")).toBe("VM");
    expect(initials("refugio patitas del sur")).toBe("RP");
  });

  it("una sola palabra, espacios de más y tildes", () => {
    expect(initials("  Ñandú  ")).toBe("Ñ");
    expect(initials("ángela  ruiz")).toBe("ÁR");
  });

  it("nombre vacío: sin iniciales", () => {
    expect(initials("   ")).toBe("");
  });
});

describe("profileAdoptionsCountText", () => {
  it("todas", () => {
    expect(profileAdoptionsCountText(1, null)).toBe("1 mascota publicada");
    expect(profileAdoptionsCountText(5, null)).toBe("5 mascotas publicadas");
  });

  it("solo en adopción", () => {
    expect(profileAdoptionsCountText(1, AdoptionStatus.AVAILABLE)).toBe("1 mascota buscando familia");
    expect(profileAdoptionsCountText(4, AdoptionStatus.AVAILABLE)).toBe("4 mascotas buscando familia");
  });

  it("solo adoptadas", () => {
    expect(profileAdoptionsCountText(1, AdoptionStatus.ADOPTED)).toBe("1 mascota adoptada");
    expect(profileAdoptionsCountText(2, AdoptionStatus.ADOPTED)).toBe("2 mascotas adoptadas");
  });
});
