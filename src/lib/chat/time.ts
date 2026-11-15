// Horas del chat. El back manda la hora local de Argentina sin zona («2026-11-15T15:20:48.123»):
// se lee como texto para que ni el navegador ni el servidor la corran. «Hoy» lo calcula el servidor
// en hora de Argentina y lo pasa al cliente, así los dos dibujan lo mismo.

export const CHAT_TIME_ZONE = "America/Argentina/Buenos_Aires";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface Parts {
  year: number;
  month: number;
  day: number;
  time: string;
}

function parse(isoLocal: string): Parts {
  const [date, rest = ""] = isoLocal.split("T");
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day, time: rest.slice(0, 5) };
}

function dayNumber({ year, month, day }: Pick<Parts, "year" | "month" | "day">): number {
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

/** «aaaa-mm-dd» de hoy en Argentina. */
export function todayInArgentina(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CHAT_TIME_ZONE }).format(now);
}

/** Hoy: «15:20». Esta semana: «Mar 15:20». Antes: «15/11 15:20» (con el año si es otro). */
export function formatMessageTime(createdAt: string, today: string): string {
  const message = parse(createdAt);
  const now = parse(`${today}T00:00`);
  const days = dayNumber(now) - dayNumber(message);
  if (days <= 0) return message.time;
  if (days < 7) return `${WEEKDAYS[new Date(dayNumber(message) * 86_400_000).getUTCDay()]} ${message.time}`;
  const date = `${String(message.day).padStart(2, "0")}/${String(message.month).padStart(2, "0")}`;
  return message.year === now.year ? `${date} ${message.time}` : `${date}/${message.year} ${message.time}`;
}
