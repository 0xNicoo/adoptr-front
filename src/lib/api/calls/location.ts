import 'server-only';
import { apiRequest } from '../api';
import { Locality } from '../models/locality/locality';
import { Province } from '../models/locality/province';

/** Las 24 provincias, ordenadas por nombre. */
export async function getProvinces(): Promise<Province[]> {
  const response = await apiRequest<Province[]>('/provinces');
  return response.data ?? [];
}

/** Hasta 20 localidades de la provincia que contienen el texto (2 a 100 caracteres, sin importar tildes). */
export async function searchLocalities(provinceId: number, query: string): Promise<Locality[]> {
  const params = new URLSearchParams({ q: query });
  const response = await apiRequest<Locality[]>(`/provinces/${provinceId}/localities?${params}`);
  return response.data ?? [];
}
