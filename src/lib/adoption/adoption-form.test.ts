import { describe, expect, it } from "vitest";
import { Adoption } from "@/lib/api/models/adoption/adoption";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { ProfileType as ProfileTypeForTest } from "@/lib/api/models/profile/profile-type";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import {
  AdoptionDraft,
  EMPTY_ADOPTION_DRAFT,
  MAX_DESCRIPTION,
  MAX_PET_NAME,
  STEP,
  draftFromAdoption,
  firstInvalidStep,
  toAdoptionInput,
  updateErrorMessage,
  validateAdoptionStep,
  withSpecies,
} from "./adoption-form";

const TODAY = new Date(2026, 10, 7, 12);
const LOCALITY = { id: 6441030, name: "La Plata", displayName: "La Plata" };

const COMPLETE_DOG: AdoptionDraft = {
  species: Species.DOG,
  petName: "  Luna  ",
  sex: PetSex.FEMALE,
  size: PetSize.MEDIUM,
  ageYears: 2,
  ageMonths: 3,
  vaccinated: true,
  dewormed: false,
  neutered: false,
  location: { provinceId: 6, locality: LOCALITY },
  description: "  Muy cariñosa.  ",
};

describe("validateAdoptionStep", () => {
  it("animal: pide la especie", () => {
    expect(validateAdoptionStep(STEP.ANIMAL, EMPTY_ADOPTION_DRAFT)).toEqual({
      species: "Elegí si es un perro o un gato.",
    });
  });

  it("datos: nombre en blanco o largo, sexo, tamaño de perro y edad", () => {
    const draft = { ...COMPLETE_DOG, petName: "   ", sex: null, size: null, ageYears: null };
    expect(Object.keys(validateAdoptionStep(STEP.DATA, draft)).sort()).toEqual(["age", "petName", "sex", "size"]);
    expect(validateAdoptionStep(STEP.DATA, { ...COMPLETE_DOG, petName: "x".repeat(MAX_PET_NAME + 1) }).petName).toBe(
      `Usá hasta ${MAX_PET_NAME} caracteres.`,
    );
  });

  it("datos: un gato no necesita tamaño", () => {
    expect(validateAdoptionStep(STEP.DATA, { ...COMPLETE_DOG, species: Species.CAT, size: null })).toEqual({});
  });

  it("datos: la edad no puede superar los 30 años", () => {
    expect(validateAdoptionStep(STEP.DATA, { ...COMPLETE_DOG, ageYears: 30, ageMonths: 1 }).age).toBe(
      "La edad no puede superar los 30 años.",
    );
    expect(validateAdoptionStep(STEP.DATA, { ...COMPLETE_DOG, ageYears: 30, ageMonths: 0 })).toEqual({});
  });

  it("salud: cada dato es obligatorio, y «no» es una respuesta válida", () => {
    expect(Object.keys(validateAdoptionStep(STEP.HEALTH, { ...COMPLETE_DOG, vaccinated: null, neutered: null }))).toEqual([
      "vaccinated",
      "neutered",
    ]);
    expect(
      validateAdoptionStep(STEP.HEALTH, { ...COMPLETE_DOG, vaccinated: false, dewormed: false, neutered: false }),
    ).toEqual({});
  });

  it("ubicación: pide la localidad", () => {
    expect(validateAdoptionStep(STEP.LOCATION, { ...COMPLETE_DOG, location: { provinceId: 6, locality: null } })).toEqual({
      locality: "Elegí la localidad donde está.",
    });
    expect(
      validateAdoptionStep(STEP.LOCATION, { ...COMPLETE_DOG, location: { provinceId: null, locality: null } }).province,
    ).toBe("Elegí una provincia.");
  });

  it("historia: obligatoria y hasta 2000 caracteres", () => {
    expect(validateAdoptionStep(STEP.STORY, { ...COMPLETE_DOG, description: "  " }).description).toBeDefined();
    expect(
      validateAdoptionStep(STEP.STORY, { ...COMPLETE_DOG, description: "x".repeat(MAX_DESCRIPTION + 1) }).description,
    ).toBe(`Usá hasta ${MAX_DESCRIPTION} caracteres.`);
  });
});

describe("fotos", () => {
  it("son opcionales: el paso nunca frena la publicación", () => {
    expect(validateAdoptionStep(STEP.PHOTOS, EMPTY_ADOPTION_DRAFT)).toEqual({});
    expect(firstInvalidStep(COMPLETE_DOG)).toBeNull();
  });
});

describe("firstInvalidStep", () => {
  it("devuelve el primer paso con errores, o null si está todo completo", () => {
    expect(firstInvalidStep(COMPLETE_DOG)).toBeNull();
    expect(firstInvalidStep({ ...COMPLETE_DOG, dewormed: null, description: "" })).toBe(STEP.HEALTH);
  });
});

describe("withSpecies", () => {
  it("al pasar a gato se borra el tamaño", () => {
    expect(withSpecies(COMPLETE_DOG, Species.CAT).size).toBeNull();
    expect(withSpecies(COMPLETE_DOG, Species.DOG).size).toBe(PetSize.MEDIUM);
  });
});

describe("toAdoptionInput", () => {
  it("arma el body del contrato: textos recortados y edad como mes de nacimiento", () => {
    expect(toAdoptionInput(COMPLETE_DOG, TODAY)).toEqual({
      petName: "Luna",
      description: "Muy cariñosa.",
      species: Species.DOG,
      sex: PetSex.FEMALE,
      size: PetSize.MEDIUM,
      estimatedBirthDate: "2024-08",
      vaccinated: true,
      dewormed: false,
      neutered: false,
      localityId: 6441030,
    });
  });

  it("los gatos van sin tamaño aunque haya quedado uno cargado", () => {
    expect(toAdoptionInput({ ...COMPLETE_DOG, species: Species.CAT }, TODAY).size).toBeNull();
  });

  it("falla si el borrador está incompleto", () => {
    expect(() => toAdoptionInput(EMPTY_ADOPTION_DRAFT, TODAY)).toThrow();
  });
});

describe("draftFromAdoption", () => {
  const ADOPTION: Adoption = {
    id: 12,
    petName: "Luna",
    description: "Muy cariñosa.",
    species: Species.DOG,
    sex: PetSex.FEMALE,
    size: PetSize.MEDIUM,
    estimatedBirthDate: "2024-08",
    lifeStage: LifeStage.ADULT,
    vaccinated: true,
    dewormed: false,
    neutered: true,
    status: AdoptionStatus.AVAILABLE,
    coverPhotoUrl: null,
    photos: [],
    locality: LOCALITY,
    province: { id: 6, name: "Buenos Aires" },
    owner: { profileId: 3, displayName: "Victoria Miranda", profileType: ProfileTypeForTest.PERSON },
    viewerIsOwner: true,
    createdAt: "2026-10-01T09:30:00",
    updatedAt: "2026-10-01T09:30:00",
  };

  it("arma un borrador completo con la edad calculada a hoy", () => {
    const draft = draftFromAdoption(ADOPTION, TODAY);
    expect(draft).toEqual({
      species: Species.DOG,
      petName: "Luna",
      sex: PetSex.FEMALE,
      size: PetSize.MEDIUM,
      ageYears: 2,
      ageMonths: 3,
      vaccinated: true,
      dewormed: false,
      neutered: true,
      location: { provinceId: 6, locality: LOCALITY },
      description: "Muy cariñosa.",
    });
    expect(firstInvalidStep(draft)).toBeNull();
  });

  it("sin cambios, el body conserva el mes de nacimiento", () => {
    expect(toAdoptionInput(draftFromAdoption(ADOPTION, TODAY), TODAY).estimatedBirthDate).toBe("2024-08");
  });

  it("un gato queda sin tamaño", () => {
    const cat = { ...ADOPTION, species: Species.CAT, size: null };
    expect(draftFromAdoption(cat, TODAY).size).toBeNull();
  });
});

describe("updateErrorMessage", () => {
  it("según el code del back", () => {
    expect(updateErrorMessage("ADOPTION_NOT_OWNER")).toBe("Solo quien la publicó puede editarla.");
    expect(updateErrorMessage("ADOPTION_NOT_FOUND")).toBe("Esta publicación ya no existe.");
    expect(updateErrorMessage("VALIDATION_ERROR")).toBe("Hay datos que no pudimos guardar. Revisalos y probá de nuevo.");
    expect(updateErrorMessage("UNKNOWN_ERROR")).toBe("No pudimos guardar los cambios. Probá de nuevo en unos minutos.");
  });
});
