import 'server-only';
import { SavedQuery, toSavedApiParams } from '@/lib/saved/saved-query';
import { getAccessToken } from '@/lib/auth/session';
import { viewerFavoriteIds } from '@/lib/saved/favorite-ids';
import { apiRequest } from '../api';
import { AdoptionSummary } from '../models/adoption/adoption-summary';
import { FavoriteIds } from '../models/favorite/favorite-ids';
import { Page } from '../models/page/page';

export async function getFavorites(query: SavedQuery): Promise<Page<AdoptionSummary>> {
  const response = await apiRequest<Page<AdoptionSummary>>(`/favorites/adoptions?${toSavedApiParams(query)}`);
  if (!response.data) {
    throw new Error('Las favoritas no devolvieron una página');
  }
  return response.data;
}

export async function getFavoriteIds(): Promise<number[]> {
  const response = await apiRequest<FavoriteIds>('/favorites/ids');
  if (!response.data) {
    throw new Error('Los ids de favoritas no devolvieron una lista');
  }
  return response.data.publicationIds;
}

export async function addFavorite(id: number): Promise<void> {
  await apiRequest<void>(`/favorites/${id}`, 'PUT');
}

export async function removeFavorite(id: number): Promise<void> {
  await apiRequest<void>(`/favorites/${id}`, 'DELETE');
}

export async function getViewerFavoriteIds(): Promise<Set<number>> {
  return viewerFavoriteIds(getFavoriteIds, Boolean(await getAccessToken()));
}
