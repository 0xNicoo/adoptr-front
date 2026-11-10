import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { SearchParams } from "@/lib/adoption/catalog-query";

// Listado de «Mi perfil» en la URL (/profile?status=available&page=2) ⇄ query de `GET /adoptions/mine`.
// Como en el catálogo, la URL usa minúsculas y la página empieza en 1; la API, el enum y página desde 0.

export const MY_PROFILE_PATH = "/profile";
export const MY_ADOPTIONS_PAGE_SIZE = 12;

export interface MyAdoptionsQuery {
  /** Solo las que están en adopción; si no, todas (también las adoptadas). */
  onlyAvailable: boolean;
  /** Desde 1. */
  page: number;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Lee la URL. Un valor desconocido (por ejemplo, de un link viejo) se ignora. */
export function parseMyAdoptionsQuery(params: SearchParams): MyAdoptionsQuery {
  const rawPage = first(params.page);
  const page = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : NaN;
  return {
    onlyAvailable: first(params.status) === "available",
    page: page > 0 && Number.isSafeInteger(page) ? page : 1,
  };
}

/** Query de `GET /adoptions/mine`. */
export function toMyAdoptionsApiParams(
  { onlyAvailable, page }: MyAdoptionsQuery,
  pageSize: number = MY_ADOPTIONS_PAGE_SIZE,
): URLSearchParams {
  const params = new URLSearchParams();
  if (onlyAvailable) params.set("status", AdoptionStatus.AVAILABLE);
  params.set("page", String(page - 1));
  params.set("pageSize", String(pageSize));
  return params;
}

/** Link de «Mi perfil» con ese filtro y página. */
export function myProfileHref({ onlyAvailable, page }: MyAdoptionsQuery): string {
  const params = new URLSearchParams();
  if (onlyAvailable) params.set("status", "available");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${MY_PROFILE_PATH}?${query}` : MY_PROFILE_PATH;
}
