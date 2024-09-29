import 'server-only';

import { apiRequest } from '../apiRequest';

export async function setFavorite(adoptionId) {
  return await apiRequest(`/favorite/${adoptionId}`, 'PATCH', null, 'application/json', true)
}

export async function getFavorite(adoptionId) {
  return await apiRequest(`/favorite/${adoptionId}`, 'GET', null, 'application/json', true)
}

export async function getAllFavorites() {
  return await apiRequest(`/favorite/all`, 'GET', null, 'application/json', true)
}