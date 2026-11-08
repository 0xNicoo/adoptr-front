import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { birthMonthToAge, formatAge } from "./age";

// Textos en español de los valores del contrato.

export const SPECIES_LABEL: Record<Species, string> = {
  [Species.DOG]: "Perro",
  [Species.CAT]: "Gato",
};

export const SEX_LABEL: Record<PetSex, string> = {
  [PetSex.MALE]: "Macho",
  [PetSex.FEMALE]: "Hembra",
  [PetSex.UNKNOWN]: "Sexo sin determinar",
};

export const SIZE_LABEL: Record<PetSize, string> = {
  [PetSize.SMALL]: "Pequeño",
  [PetSize.MEDIUM]: "Mediano",
  [PetSize.LARGE]: "Grande",
};

export function lifeStageLabel(stage: LifeStage, species?: Species): string {
  if (stage === LifeStage.ADULT) return "Adulto";
  if (stage === LifeStage.SENIOR) return "Mayor";
  if (species === Species.DOG) return "Cachorro";
  if (species === Species.CAT) return "Gatito";
  return "Cachorro / gatito";
}

export interface HealthChip {
  label: string;
  positive: boolean;
}

/** «Vacunada» / «Sin vacunar»: el «no» se dice con palabras (ver sistema visual). */
export function healthChips(pet: {
  sex: PetSex;
  vaccinated: boolean;
  dewormed: boolean;
  neutered: boolean;
}): HealthChip[] {
  const ending = pet.sex === PetSex.FEMALE ? "a" : "o";
  return [
    pet.vaccinated ? { label: `Vacunad${ending}`, positive: true } : { label: "Sin vacunar", positive: false },
    pet.dewormed ? { label: `Desparasitad${ending}`, positive: true } : { label: "Sin desparasitar", positive: false },
    pet.neutered ? { label: `Castrad${ending}`, positive: true } : { label: "Sin castrar", positive: false },
  ];
}

/** «Perro · Mediano · Hembra · 2 años y 3 meses». */
export function summaryLine(
  pet: { species: Species; size: PetSize | null; sex: PetSex; estimatedBirthDate: string },
  today: Date = new Date(),
): string {
  return [
    SPECIES_LABEL[pet.species],
    pet.size ? SIZE_LABEL[pet.size] : null,
    SEX_LABEL[pet.sex],
    formatAge(birthMonthToAge(pet.estimatedBirthDate, today)),
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * «07/11/2026». El back manda la fecha local de Argentina sin zona: se lee como texto
 * para que el navegador o el servidor no la corran de día.
 */
export function formatPublishedDate(isoLocal: string): string {
  const [year, month, day] = isoLocal.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export function knowMoreLabel(sex: PetSex): string {
  if (sex === PetSex.MALE) return "Conocelo";
  if (sex === PetSex.FEMALE) return "Conocela";
  return "Conocé su historia";
}
