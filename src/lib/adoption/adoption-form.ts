import { Adoption } from "@/lib/api/models/adoption/adoption";
import { AdoptionInput } from "@/lib/api/models/adoption/adoption-input";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { Locality } from "@/lib/api/models/locality/locality";
import { ageError, ageToBirthMonth, birthMonthToAge } from "./age";

// Alta de una mascota en adopción: pasos, validación y armado del body.
// Mismas reglas que el back (adoptr-back/docs/arquitectura/api.md, «Publicación de adopción»).

export const MAX_PET_NAME = 50;
export const MAX_DESCRIPTION = 2000;

export const STEP = { ANIMAL: 1, DATA: 2, HEALTH: 3, LOCATION: 4, STORY: 5, PHOTOS: 6, REVIEW: 7 } as const;
export const ADOPTION_STEPS = ["Animal", "Datos", "Salud", "Ubicación", "Historia", "Fotos", "Revisión"] as const;

export interface AdoptionDraft {
  species: Species | null;
  petName: string;
  sex: PetSex | null;
  size: PetSize | null;
  ageYears: number | null;
  ageMonths: number | null;
  vaccinated: boolean | null;
  dewormed: boolean | null;
  neutered: boolean | null;
  location: { provinceId: number | null; locality: Locality | null };
  description: string;
}

export type AdoptionField =
  | "species"
  | "petName"
  | "sex"
  | "size"
  | "age"
  | "vaccinated"
  | "dewormed"
  | "neutered"
  | "province"
  | "locality"
  | "description";

export type AdoptionErrors = Partial<Record<AdoptionField, string>>;

export const EMPTY_ADOPTION_DRAFT: AdoptionDraft = {
  species: null,
  petName: "",
  sex: null,
  size: null,
  ageYears: null,
  ageMonths: null,
  vaccinated: null,
  dewormed: null,
  neutered: null,
  location: { provinceId: null, locality: null },
  description: "",
};

function requiredText(value: string, max: number, missing: string): string | undefined {
  const text = value.trim();
  if (!text) return missing;
  if (text.length > max) return `Usá hasta ${max} caracteres.`;
  return undefined;
}

export function validateAdoptionStep(step: number, draft: AdoptionDraft): AdoptionErrors {
  const errors: AdoptionErrors = {};
  const set = (field: AdoptionField, message: string | undefined) => {
    if (message) errors[field] = message;
  };

  if (step === STEP.ANIMAL) {
    set("species", draft.species ? undefined : "Elegí si es un perro o un gato.");
  }
  if (step === STEP.DATA) {
    set("petName", requiredText(draft.petName, MAX_PET_NAME, "Escribí su nombre."));
    set("sex", draft.sex ? undefined : "Elegí el sexo.");
    set("size", draft.species === Species.DOG && !draft.size ? "Elegí el tamaño." : undefined);
    set(
      "age",
      draft.ageYears === null || draft.ageMonths === null
        ? "Elegí los años y los meses (pueden ser 0)."
        : ageError({ years: draft.ageYears, months: draft.ageMonths }),
    );
  }
  if (step === STEP.HEALTH) {
    set("vaccinated", draft.vaccinated === null ? "Elegí sí o no." : undefined);
    set("dewormed", draft.dewormed === null ? "Elegí sí o no." : undefined);
    set("neutered", draft.neutered === null ? "Elegí sí o no." : undefined);
  }
  if (step === STEP.LOCATION) {
    if (!draft.location.provinceId) set("province", "Elegí una provincia.");
    else set("locality", draft.location.locality ? undefined : "Elegí la localidad donde está.");
  }
  if (step === STEP.STORY) {
    set("description", requiredText(draft.description, MAX_DESCRIPTION, "Contanos un poco sobre su historia."));
  }
  return errors;
}

/** Primer paso con datos faltantes o inválidos, o `null` si se puede publicar. */
export function firstInvalidStep(draft: AdoptionDraft): number | null {
  for (let step = STEP.ANIMAL; step < STEP.REVIEW; step++) {
    if (Object.keys(validateAdoptionStep(step, draft)).length) return step;
  }
  return null;
}

/** Cambia la especie; los gatos no tienen tamaño. */
export function withSpecies(draft: AdoptionDraft, species: Species): AdoptionDraft {
  return { ...draft, species, size: species === Species.CAT ? null : draft.size };
}

/** Body de `POST /adoptions`. Solo con un borrador completo (ver `firstInvalidStep`). */
export function toAdoptionInput(draft: AdoptionDraft, today: Date = new Date()): AdoptionInput {
  if (firstInvalidStep(draft) !== null) {
    throw new Error("El borrador de la publicación está incompleto");
  }
  const species = draft.species as Species;
  return {
    petName: draft.petName.trim(),
    description: draft.description.trim(),
    species,
    sex: draft.sex as PetSex,
    size: species === Species.DOG ? draft.size : null,
    estimatedBirthDate: ageToBirthMonth({ years: draft.ageYears as number, months: draft.ageMonths as number }, today),
    vaccinated: draft.vaccinated as boolean,
    dewormed: draft.dewormed as boolean,
    neutered: draft.neutered as boolean,
    localityId: (draft.location.locality as Locality).id,
  };
}

export function draftFromAdoption(adoption: Adoption, today: Date = new Date()): AdoptionDraft {
  const age = birthMonthToAge(adoption.estimatedBirthDate, today);
  return {
    species: adoption.species,
    petName: adoption.petName,
    sex: adoption.sex,
    size: adoption.size,
    ageYears: age.years,
    ageMonths: age.months,
    vaccinated: adoption.vaccinated,
    dewormed: adoption.dewormed,
    neutered: adoption.neutered,
    location: { provinceId: adoption.province.id, locality: adoption.locality },
    description: adoption.description,
  };
}

export function updateErrorMessage(code: string): string {
  switch (code) {
    case "VALIDATION_ERROR":
      return "Hay datos que no pudimos guardar. Revisalos y probá de nuevo.";
    case "ADOPTION_NOT_FOUND":
      return "Esta publicación ya no existe.";
    case "ADOPTION_NOT_OWNER":
      return "Solo quien la publicó puede editarla.";
    default:
      return "No pudimos guardar los cambios. Probá de nuevo en unos minutos.";
  }
}
