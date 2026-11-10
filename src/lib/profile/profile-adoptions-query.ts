import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { SearchParams } from "@/lib/adoption/catalog-query";

// Listado de publicaciones de un perfil en la URL (/profile?status=available&page=2, igual en /profiles/3)
// ⇄ query de `GET /adoptions/mine` y `GET /profiles/{id}/adoptions`.
// Como en el catálogo, la URL usa minúsculas y la página empieza en 1; la API, el enum y página desde 0.

export const MY_PROFILE_PATH = "/profile";
export const PROFILE_ADOPTIONS_PAGE_SIZE = 12;

export interface ProfileAdoptionsQuery {
  /** Solo las que están en adopción; si no, todas (también las adoptadas). */
  onlyAvailable: boolean;
  /** Desde 1. */
  page: number;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Lee la URL. Un valor desconocido (por ejemplo, de un link viejo) se ignora. */
export function parseProfileAdoptionsQuery(params: SearchParams): ProfileAdoptionsQuery {
  const rawPage = first(params.page);
  const page = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : NaN;
  return {
    onlyAvailable: first(params.status) === "available",
    page: page > 0 && Number.isSafeInteger(page) ? page : 1,
  };
}

/** Query de `GET /adoptions/mine` y `GET /profiles/{id}/adoptions`. */
export function toProfileAdoptionsApiParams({ onlyAvailable, page }: ProfileAdoptionsQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (onlyAvailable) params.set("status", AdoptionStatus.AVAILABLE);
  params.set("page", String(page - 1));
  params.set("pageSize", String(PROFILE_ADOPTIONS_PAGE_SIZE));
  return params;
}

/** Link de la página del perfil (`basePath`) con ese filtro y página. */
export function profileAdoptionsHref(basePath: string, { onlyAvailable, page }: ProfileAdoptionsQuery): string {
  const params = new URLSearchParams();
  if (onlyAvailable) params.set("status", "available");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
