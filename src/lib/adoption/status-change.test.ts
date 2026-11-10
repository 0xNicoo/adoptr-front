import { describe, expect, it } from "vitest";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import {
  nextStatus,
  statusActionLabel,
  statusChangeMessage,
  statusConfirmText,
  statusConfirmTitle,
  statusShortLabel,
} from "./status-change";

describe("nextStatus", () => {
  it("alterna entre en adopción y adoptada", () => {
    expect(nextStatus(AdoptionStatus.AVAILABLE)).toBe(AdoptionStatus.ADOPTED);
    expect(nextStatus(AdoptionStatus.ADOPTED)).toBe(AdoptionStatus.AVAILABLE);
  });
});

describe("statusActionLabel", () => {
  it("en adopción: marcar como adoptada o adoptado según el sexo", () => {
    expect(statusActionLabel(PetSex.FEMALE, AdoptionStatus.AVAILABLE)).toBe("Marcar como adoptada");
    expect(statusActionLabel(PetSex.MALE, AdoptionStatus.AVAILABLE)).toBe("Marcar como adoptado");
    expect(statusActionLabel(PetSex.UNKNOWN, AdoptionStatus.AVAILABLE)).toBe("Marcar como adoptado");
  });

  it("adoptada: volver a ponerla en adopción", () => {
    expect(statusActionLabel(PetSex.FEMALE, AdoptionStatus.ADOPTED)).toBe("Volver a poner en adopción");
  });
});

describe("statusShortLabel", () => {
  it("versión corta para la tarjeta", () => {
    expect(statusShortLabel(PetSex.FEMALE, AdoptionStatus.AVAILABLE)).toBe("Fue adoptada");
    expect(statusShortLabel(PetSex.MALE, AdoptionStatus.AVAILABLE)).toBe("Fue adoptado");
    expect(statusShortLabel(PetSex.MALE, AdoptionStatus.ADOPTED)).toBe("Volver a adopción");
  });
});

describe("statusConfirmTitle y statusConfirmText", () => {
  it("nombran a la mascota y dicen qué pasa", () => {
    expect(statusConfirmTitle("Luna", PetSex.FEMALE, AdoptionStatus.AVAILABLE)).toBe("¿Marcar a Luna como adoptada?");
    expect(statusConfirmTitle("Toby", PetSex.MALE, AdoptionStatus.ADOPTED)).toBe("¿Volver a poner a Toby en adopción?");
    expect(statusConfirmText(AdoptionStatus.AVAILABLE)).toContain("dejar de aparecer");
    expect(statusConfirmText(AdoptionStatus.ADOPTED)).toContain("volver a aparecer");
  });
});

describe("statusChangeMessage", () => {
  it("según el code del back", () => {
    expect(statusChangeMessage("ADOPTION_NOT_FOUND")).toBe("Esta publicación ya no existe.");
    expect(statusChangeMessage("ADOPTION_NOT_OWNER")).toBe("Solo quien la publicó puede cambiar su estado.");
    expect(statusChangeMessage("UNKNOWN_ERROR")).toBe("No pudimos cambiar el estado. Probá de nuevo.");
  });
});
