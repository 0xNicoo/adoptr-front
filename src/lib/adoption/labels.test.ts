import { describe, expect, it } from "vitest";
import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { healthChips, knowMoreLabel, lifeStageLabel, summaryLine } from "./labels";

const TODAY = new Date(2026, 10, 7, 12);

describe("healthChips", () => {
  it("concuerda con el sexo y dice el «no» con palabras", () => {
    expect(healthChips({ sex: PetSex.FEMALE, vaccinated: true, dewormed: false, neutered: true })).toEqual([
      { label: "Vacunada", positive: true },
      { label: "Sin desparasitar", positive: false },
      { label: "Castrada", positive: true },
    ]);
  });

  it("usa masculino para macho y sexo sin determinar", () => {
    expect(healthChips({ sex: PetSex.UNKNOWN, vaccinated: true, dewormed: true, neutered: false })).toEqual([
      { label: "Vacunado", positive: true },
      { label: "Desparasitado", positive: true },
      { label: "Sin castrar", positive: false },
    ]);
  });
});

describe("lifeStageLabel", () => {
  it("cachorro o gatito según la especie", () => {
    expect(lifeStageLabel(LifeStage.PUPPY, Species.DOG)).toBe("Cachorro");
    expect(lifeStageLabel(LifeStage.PUPPY, Species.CAT)).toBe("Gatito");
    expect(lifeStageLabel(LifeStage.PUPPY)).toBe("Cachorro / gatito");
    expect(lifeStageLabel(LifeStage.SENIOR)).toBe("Mayor");
  });
});

describe("summaryLine", () => {
  it("especie, tamaño, sexo y edad", () => {
    expect(
      summaryLine(
        { species: Species.DOG, size: PetSize.MEDIUM, sex: PetSex.FEMALE, estimatedBirthDate: "2024-08" },
        TODAY,
      ),
    ).toBe("Perro · Mediano · Hembra · 2 años y 3 meses");
  });

  it("sin tamaño para gatos y con sexo sin determinar", () => {
    expect(
      summaryLine({ species: Species.CAT, size: null, sex: PetSex.UNKNOWN, estimatedBirthDate: "2026-07" }, TODAY),
    ).toBe("Gato · Sexo sin determinar · 4 meses");
  });
});

describe("knowMoreLabel", () => {
  it("según el sexo", () => {
    expect(knowMoreLabel(PetSex.MALE)).toBe("Conocelo");
    expect(knowMoreLabel(PetSex.FEMALE)).toBe("Conocela");
    expect(knowMoreLabel(PetSex.UNKNOWN)).toBe("Conocé su historia");
  });
});
