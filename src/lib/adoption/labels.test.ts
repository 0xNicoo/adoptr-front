import { describe, expect, it } from "vitest";
import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { adoptedLabel, formatPublishedDate, healthChips, knowMoreLabel, lifeStageLabel, summaryLine } from "./labels";

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
  it("tamaño y edad, sin especie ni sexo", () => {
    expect(summaryLine({ size: PetSize.MEDIUM, estimatedBirthDate: "2024-08" }, TODAY)).toBe(
      "Mediano · 2 años y 3 meses",
    );
  });

  it("solo la edad para gatos, que no tienen tamaño", () => {
    expect(summaryLine({ size: null, estimatedBirthDate: "2026-07" }, TODAY)).toBe("4 meses");
  });
});

describe("formatPublishedDate", () => {
  it("dd/mm/aaaa a partir de la fecha ISO local del back, sin corrimiento de zona", () => {
    expect(formatPublishedDate("2026-11-07T00:30:00.123456")).toBe("07/11/2026");
  });
});

describe("adoptedLabel", () => {
  it("concuerda con el sexo", () => {
    expect(adoptedLabel(PetSex.FEMALE)).toBe("Adoptada");
    expect(adoptedLabel(PetSex.MALE)).toBe("Adoptado");
    expect(adoptedLabel(PetSex.UNKNOWN)).toBe("Adoptado");
  });
});

describe("knowMoreLabel", () => {
  it("según el sexo", () => {
    expect(knowMoreLabel(PetSex.MALE)).toBe("Conocelo");
    expect(knowMoreLabel(PetSex.FEMALE)).toBe("Conocela");
    expect(knowMoreLabel(PetSex.UNKNOWN)).toBe("Conocé su historia");
  });

  it("si ya fue adoptada", () => {
    expect(knowMoreLabel(PetSex.FEMALE, true)).toBe("Ver su historia");
  });
});
