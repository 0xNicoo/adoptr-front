import { Species } from "@/lib/api/models/adoption/species";
import { SearchParams } from "@/lib/adoption/catalog-query";
import { PROFILE_ADOPTIONS_PAGE_SIZE } from "@/lib/profile/profile-adoptions-query";

export const SAVED_PATH = "/saved";

export interface SavedQuery {
  species: Species | null;
  page: number;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseSavedQuery(params: SearchParams): SavedQuery {
  const rawSpecies = first(params.species);
  const species = Object.values(Species).find((value) => value.toLowerCase() === rawSpecies) ?? null;
  const rawPage = first(params.page);
  const page = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : NaN;
  return { species, page: page > 0 && Number.isSafeInteger(page) ? page : 1 };
}

export function toSavedApiParams({ species, page }: SavedQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (species) params.set("species", species);
  params.set("page", String(page - 1));
  params.set("pageSize", String(PROFILE_ADOPTIONS_PAGE_SIZE));
  return params;
}

export function savedHref({ species, page }: SavedQuery): string {
  const params = new URLSearchParams();
  if (species) params.set("species", species.toLowerCase());
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${SAVED_PATH}?${query}` : SAVED_PATH;
}
