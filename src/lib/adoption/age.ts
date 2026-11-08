// Edad aproximada ⇄ mes y año de nacimiento estimados ("aaaa-mm", como guarda el back).
// La gente piensa en «tiene unos 2 años»: el formulario pide años y meses y el back recibe el mes.

export const MAX_AGE_YEARS = 30;

export interface Age {
  years: number;
  months: number;
}

/** Meses contados desde el año 0, en hora local. */
function monthIndex(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function parseBirthMonth(birthMonth: string): number {
  const [year, month] = birthMonth.split("-").map(Number);
  return year * 12 + (month - 1);
}

export function ageToBirthMonth(age: Age, today: Date = new Date()): string {
  const index = monthIndex(today) - (age.years * 12 + age.months);
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function birthMonthToAge(birthMonth: string, today: Date = new Date()): Age {
  const total = Math.max(0, monthIndex(today) - parseBirthMonth(birthMonth));
  return { years: Math.floor(total / 12), months: total % 12 };
}

export function formatAge({ years, months }: Age): string {
  const y = years === 1 ? "1 año" : `${years} años`;
  const m = months === 1 ? "1 mes" : `${months} meses`;
  if (years === 0 && months === 0) return "Menos de 1 mes";
  if (years === 0) return m;
  if (months === 0) return y;
  return `${y} y ${m}`;
}

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function formatBirthMonth(birthMonth: string): string {
  const [year, month] = birthMonth.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} de ${year}`;
}

/** Mismas reglas que el back: hasta 30 años exactos (la fecha no puede ser de hace más de 30 años). */
export function ageError({ years, months }: Age): string | undefined {
  if (!Number.isInteger(years) || !Number.isInteger(months) || years < 0 || months < 0 || months > 11) {
    return "Elegí los años y los meses.";
  }
  if (years * 12 + months > MAX_AGE_YEARS * 12) {
    return `La edad no puede superar los ${MAX_AGE_YEARS} años.`;
  }
  return undefined;
}
