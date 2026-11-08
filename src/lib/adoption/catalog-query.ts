import { AdoptionFilters } from "@/lib/api/models/adoption/adoption-filters";
import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";

// Búsqueda del catálogo en la URL (/adoptions?species=dog&size=medium&page=2) ⇄ filtros de la API.
// La URL usa minúsculas y la página empieza en 1; la API usa los enums y la página empieza en 0.

export const CATALOG_PATH = "/adoptions";
export const CATALOG_PAGE_SIZE = 12;

export type CatalogFilters = Omit<AdoptionFilters, "page" | "pageSize">;

export interface CatalogQuery {
  filters: CatalogFilters;
  /** Desde 1. */
  page: number;
}

export type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function enumFromUrl<T extends string>(values: readonly T[], raw: string | undefined): T | undefined {
  if (!raw) return undefined;
  return values.find((v) => v.toLowerCase() === raw);
}

function positiveInt(raw: string | undefined): number | undefined {
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const n = Number(raw);
  return n > 0 && Number.isSafeInteger(n) ? n : undefined;
}

/**
 * Lee la búsqueda de la URL. Un valor desconocido (por ejemplo, de un link viejo) se ignora.
 * El tamaño solo vale con `species=dog`: los gatos no tienen tamaño.
 */
export function parseCatalogQuery(params: SearchParams): CatalogQuery {
  const filters: CatalogFilters = {};
  const species = enumFromUrl(Object.values(Species), first(params.species));
  const sex = enumFromUrl([PetSex.MALE, PetSex.FEMALE], first(params.sex));
  const lifeStage = enumFromUrl(Object.values(LifeStage), first(params.lifeStage));
  const size = enumFromUrl(Object.values(PetSize), first(params.size));
  const provinceId = positiveInt(first(params.province));
  const localityId = positiveInt(first(params.locality));

  if (species) filters.species = species;
  if (species === Species.DOG && size) filters.size = size;
  if (sex) filters.sex = sex;
  if (lifeStage) filters.lifeStage = lifeStage;
  if (provinceId) filters.provinceId = provinceId;
  if (provinceId && localityId) filters.localityId = localityId;

  return { filters, page: positiveInt(first(params.page)) ?? 1 };
}

/** Query de `GET /adoptions`. */
export function toApiParams({ filters, page }: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.species) params.set("species", filters.species);
  if (filters.size) params.set("size", filters.size);
  if (filters.sex) params.set("sex", filters.sex);
  if (filters.lifeStage) params.set("lifeStage", filters.lifeStage);
  if (filters.provinceId) params.set("provinceId", String(filters.provinceId));
  if (filters.localityId) params.set("localityId", String(filters.localityId));
  params.set("page", String(page - 1));
  params.set("pageSize", String(CATALOG_PAGE_SIZE));
  return params;
}

/** Link del catálogo con esa búsqueda (para la paginación y «Volver al catálogo»). */
export function catalogHref({ filters, page }: CatalogQuery): string {
  const params = new URLSearchParams();
  if (filters.species) params.set("species", filters.species.toLowerCase());
  if (filters.size) params.set("size", filters.size.toLowerCase());
  if (filters.sex) params.set("sex", filters.sex.toLowerCase());
  if (filters.lifeStage) params.set("lifeStage", filters.lifeStage.toLowerCase());
  if (filters.provinceId) params.set("province", String(filters.provinceId));
  if (filters.localityId) params.set("locality", String(filters.localityId));
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${CATALOG_PATH}?${query}` : CATALOG_PATH;
}
