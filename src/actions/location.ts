'use server';

import { searchLocalities } from '@/lib/api/calls/location';
import { Locality } from '@/lib/api/models/locality/locality';

export type SearchLocalitiesResult =
  | { ok: true; localities: Locality[] }
  | { ok: false };

const MIN_QUERY = 2;
const MAX_QUERY = 100;

/**
 * Busca localidades desde el navegador. Pasa por el servidor porque la URL de la
 * API y el JWT solo existen ahí. Un texto corto devuelve una lista vacía sin consultar.
 */
export async function searchLocalitiesAction(provinceId: number, query: string): Promise<SearchLocalitiesResult> {
  const text = query.trim();
  if (!Number.isInteger(provinceId) || text.length < MIN_QUERY || text.length > MAX_QUERY) {
    return { ok: true, localities: [] };
  }
  try {
    return { ok: true, localities: await searchLocalities(provinceId, text) };
  } catch {
    return { ok: false };
  }
}
