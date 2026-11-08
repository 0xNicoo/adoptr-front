import { describe, expect, it } from "vitest";
import { MAX_AGE_YEARS, ageError, ageToBirthMonth, birthMonthToAge, formatAge, formatBirthMonth } from "./age";

// 7 de noviembre de 2026, mediodía (hora local).
const TODAY = new Date(2026, 10, 7, 12);

describe("ageToBirthMonth", () => {
  it("resta años y meses al mes actual", () => {
    expect(ageToBirthMonth({ years: 2, months: 3 }, TODAY)).toBe("2024-08");
  });

  it("cruza el año hacia atrás", () => {
    expect(ageToBirthMonth({ years: 0, months: 11 }, TODAY)).toBe("2025-12");
  });

  it("cero es el mes actual", () => {
    expect(ageToBirthMonth({ years: 0, months: 0 }, TODAY)).toBe("2026-11");
  });

  it("treinta años exactos", () => {
    expect(ageToBirthMonth({ years: 30, months: 0 }, TODAY)).toBe("1996-11");
  });
});

describe("birthMonthToAge", () => {
  it("es la inversa de ageToBirthMonth", () => {
    for (let total = 0; total <= MAX_AGE_YEARS * 12; total++) {
      const age = { years: Math.floor(total / 12), months: total % 12 };
      expect(birthMonthToAge(ageToBirthMonth(age, TODAY), TODAY)).toEqual(age);
    }
  });

  it("una fecha futura da edad cero", () => {
    expect(birthMonthToAge("2027-01", TODAY)).toEqual({ years: 0, months: 0 });
  });
});

describe("formatAge", () => {
  it.each([
    [{ years: 2, months: 3 }, "2 años y 3 meses"],
    [{ years: 1, months: 0 }, "1 año"],
    [{ years: 1, months: 1 }, "1 año y 1 mes"],
    [{ years: 0, months: 4 }, "4 meses"],
    [{ years: 0, months: 1 }, "1 mes"],
    [{ years: 0, months: 0 }, "Menos de 1 mes"],
  ])("%o → %s", (age, text) => {
    expect(formatAge(age)).toBe(text);
  });
});

describe("formatBirthMonth", () => {
  it("muestra el mes en palabras", () => {
    expect(formatBirthMonth("2024-08")).toBe("agosto de 2024");
  });
});

describe("ageError", () => {
  it("acepta treinta años exactos", () => {
    expect(ageError({ years: 30, months: 0 })).toBeUndefined();
  });

  it("rechaza más de treinta años", () => {
    expect(ageError({ years: 30, months: 1 })).toBe("La edad no puede superar los 30 años.");
  });

  it("rechaza meses fuera de rango y valores no enteros", () => {
    expect(ageError({ years: 1, months: 12 })).toBeDefined();
    expect(ageError({ years: -1, months: 0 })).toBeDefined();
    expect(ageError({ years: 1.5, months: 0 })).toBeDefined();
  });
});
