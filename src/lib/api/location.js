import 'server-only';
import { apiRequest } from '../apiRequest';

export async function getProvinces() {
  return await apiRequest(`/province?page=0&size=25`, 'GET', null, 'application/json', false)
}

export async function getLocalities(provinceId) {
  return await apiRequest(`/locality?provinceId=${provinceId}&size=10000`, 'GET', null, 'application/json', false)
}
