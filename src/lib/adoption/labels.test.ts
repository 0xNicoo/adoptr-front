import { describe, expect, it } from "vitest";
import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { formatPublishedDate, healthChips, lifeStageLabel, summaryLine } from "./labels";

const TODAY = new Date(2026, 10, 7, 12);

describe("healthChips", () => {
  it("concuerda con el sexo y dice el «no» con palabras", () => {
    expect(healthChips({ sex: PetSex.FEMALE, vaccinated: true, dewormed: false, neutered: true })).toEqual([
      { item: "vaccinated", label: "Vacunada", positive: true },
      { item: "dewormed", label: "Sin desparasitar", positive: false },
      { item: "neutered", label: "Castrada", positive: true },
    ]);
  });

  it("usa masculino para macho y sexo sin determinar", () => {
    expect(healthChips({ sex: PetSex.UNKNOWN, vaccinated: true, dewormed: true, neutered: false })).toEqual([
      { item: "vaccinated", label: "Vacunado", positive: true },
      { item: "dewormed", label: "Desparasitado", positive: true },
      { item: "neutered", label: "Sin castrar", positive: false },
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
  it("especie, tamaño y edad, sin el sexo", () => {
    expect(summaryLine({ species: Species.DOG, size: PetSize.MEDIUM, estimatedBirthDate: "2024-08" }, TODAY)).toBe(
      "Perro · Mediano · 2 años y 3 meses",
    );
  });

  it("sin tamaño para gatos", () => {
    expect(summaryLine({ species: Species.CAT, size: null, estimatedBirthDate: "2026-07" }, TODAY)).toBe(
      "Gato · 4 meses",
    );
  });
});

describe("formatPublishedDate", () => {
  it("dd/mm/aaaa a partir de la fecha ISO local del back, sin corrimiento de zona", () => {
    expect(formatPublishedDate("2026-11-07T00:30:00.123456")).toBe("07/11/2026");
  });
});
