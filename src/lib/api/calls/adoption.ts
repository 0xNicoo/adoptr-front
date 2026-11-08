import 'server-only';
import { CatalogQuery, toApiParams } from '@/lib/adoption/catalog-query';
import { ApiError, apiRequest } from '../api';
import { Adoption } from '../models/adoption/adoption';
import { AdoptionInput } from '../models/adoption/adoption-input';
import { AdoptionSummary } from '../models/adoption/adoption-summary';
import { Page } from '../models/page/page';

/**
 * Catálogo público. Va sin token aunque haya sesión: la respuesta no depende de quién mira.
 */
export async function searchAdoptions(query: CatalogQuery): Promise<Page<AdoptionSummary>> {
  const response = await apiRequest<Page<AdoptionSummary>>(
    `/adoptions?${toApiParams(query)}`, 'GET', null, 'application/json', false,
  );
  if (!response.data) {
    throw new Error('El catálogo no devolvió una página');
  }
  return response.data;
}

/**
 * Detalle público, o `null` si no existe o fue dado de baja. Manda la sesión si hay, para que
 * el back calcule `viewerIsOwner`; un token vencido no rompe (el back lo ignora en esta ruta).
 */
export async function getAdoption(id: number): Promise<Adoption | null> {
  try {
    const response = await apiRequest<Adoption>(`/adoptions/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.code === 'ADOPTION_NOT_FOUND') {
      return null;
    }
    throw error;
  }
}

export async function createAdoption(input: AdoptionInput): Promise<Adoption> {
  const response = await apiRequest<Adoption>('/adoptions', 'POST', input);
  if (!response.data) {
    throw new Error('El alta de adopción no devolvió la publicación creada');
  }
  return response.data;
}
