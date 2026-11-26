import { describe, expect, it } from "vitest";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { canDelete, deleteConfirmTitle, deletedMessage, deleteErrorMessage } from "./delete";

describe("canDelete", () => {
  it("solo se elimina una publicación en adopción", () => {
    expect(canDelete(AdoptionStatus.AVAILABLE)).toBe(true);
    expect(canDelete(AdoptionStatus.ADOPTED)).toBe(false);
  });
});

describe("deleteConfirmTitle", () => {
  it("pregunta con el nombre de la mascota", () => {
    expect(deleteConfirmTitle("Luna")).toBe("¿Estás seguro de eliminar la publicación de Luna?");
  });
});

describe("deletedMessage", () => {
  it("avisa con el nombre de la mascota", () => {
    expect(deletedMessage("Luna")).toBe("Eliminaste a Luna");
  });
});

describe("deleteErrorMessage", () => {
  it("traduce los errores del back", () => {
    expect(deleteErrorMessage("ADOPTION_NOT_FOUND")).toBe("Esta publicación ya no existe.");
    expect(deleteErrorMessage("ADOPTION_NOT_OWNER")).toBe("Solo quien la publicó puede eliminarla.");
  });

  it("cualquier otro código da un mensaje genérico", () => {
    expect(deleteErrorMessage("UNKNOWN_ERROR")).toBe("No pudimos eliminar la publicación. Probá de nuevo.");
  });
});
