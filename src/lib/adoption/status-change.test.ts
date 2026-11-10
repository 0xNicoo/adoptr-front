import { describe, expect, it } from "vitest";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import {
  nextStatus,
  statusActionLabel,
  statusChangeMessage,
  statusChangedMessage,
  statusConfirmButton,
  statusConfirmText,
  statusConfirmTitle,
} from "./status-change";

const { AVAILABLE, ADOPTED } = AdoptionStatus;

describe("nextStatus", () => {
  it("alterna entre en adopción y adoptada", () => {
    expect(nextStatus(AVAILABLE)).toBe(ADOPTED);
    expect(nextStatus(ADOPTED)).toBe(AVAILABLE);
  });
});

describe("statusActionLabel", () => {
  it("en adopción: marcar como adoptada o adoptado según el sexo", () => {
    expect(statusActionLabel(PetSex.FEMALE, AVAILABLE)).toBe("Marcar como adoptada");
    expect(statusActionLabel(PetSex.MALE, AVAILABLE)).toBe("Marcar como adoptado");
    expect(statusActionLabel(PetSex.UNKNOWN, AVAILABLE)).toBe("Marcar como adoptado");
  });

  it("adoptada: volver a adopción", () => {
    expect(statusActionLabel(PetSex.FEMALE, ADOPTED)).toBe("Volver a adopción");
  });
});

describe("confirmación", () => {
  it("al marcar como adoptada", () => {
    expect(statusConfirmTitle("Muni", AVAILABLE)).toBe("¿Muni ya tiene familia?");
    expect(statusConfirmText(PetSex.FEMALE, AVAILABLE)).toBe(
      "La publicación saldrá de la lista de adopciones y nadie más va a poder escribirte por ella. " +
        "Va a seguir en tu perfil como adoptada, y si hace falta la podés volver a poner en adopción.",
    );
    expect(statusConfirmText(PetSex.MALE, AVAILABLE)).toContain("como adoptado,");
    expect(statusConfirmButton(PetSex.FEMALE, AVAILABLE)).toBe("Sí, fue adoptada");
    expect(statusConfirmButton(PetSex.MALE, AVAILABLE)).toBe("Sí, fue adoptado");
  });

  it("al volver a adopción", () => {
    expect(statusConfirmTitle("Rocco", ADOPTED)).toBe("¿Volver a poner a Rocco en adopción?");
    expect(statusConfirmText(PetSex.MALE, ADOPTED)).toBe(
      "Va a volver a aparecer en la lista de adopciones y te van a poder escribir por ella.",
    );
    expect(statusConfirmButton(PetSex.MALE, ADOPTED)).toBe("Sí, volver a adopción");
  });
});

describe("statusChangedMessage", () => {
  it("según el estado nuevo", () => {
    expect(statusChangedMessage("Muni", PetSex.FEMALE, ADOPTED)).toBe("¡Qué buena noticia! Muni quedó como adoptada");
    expect(statusChangedMessage("Rocco", PetSex.MALE, ADOPTED)).toBe("¡Qué buena noticia! Rocco quedó como adoptado");
    expect(statusChangedMessage("Muni", PetSex.FEMALE, AVAILABLE)).toBe("Muni volvió a estar en adopción");
  });
});

describe("statusChangeMessage", () => {
  it("según el code del back", () => {
    expect(statusChangeMessage("ADOPTION_NOT_FOUND")).toBe("Esta publicación ya no existe.");
    expect(statusChangeMessage("ADOPTION_NOT_OWNER")).toBe("Solo quien la publicó puede cambiar su estado.");
    expect(statusChangeMessage("UNKNOWN_ERROR")).toBe("No pudimos cambiar el estado. Probá de nuevo.");
  });
});
