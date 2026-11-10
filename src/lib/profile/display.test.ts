import { describe, expect, it } from "vitest";
import { Gender } from "@/lib/api/models/profile/gender";
import { OrganizationProfile, PersonProfile } from "@/lib/api/models/profile/profile";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import { initials, myAdoptionsCountText, profileDisplayName } from "./display";

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

describe("myAdoptionsCountText", () => {
  it("todas", () => {
    expect(myAdoptionsCountText(1, false)).toBe("1 mascota publicada");
    expect(myAdoptionsCountText(5, false)).toBe("5 mascotas publicadas");
  });

  it("solo en adopción", () => {
    expect(myAdoptionsCountText(1, true)).toBe("1 mascota buscando familia");
    expect(myAdoptionsCountText(4, true)).toBe("4 mascotas buscando familia");
  });
});
