import 'server-only';

import { apiRequest } from '../apiRequest';
import { getQueryParams } from '@/util/queryparams';

export async function getAdoptions(filter, page, size) {
  const queryParams = getQueryParams(filter, page, size);
  return await apiRequest(`/adoption?${queryParams}`, 'GET', null, 'application/json', true)
}

export async function createAdoption(data){
  return await apiRequest(`/adoption`, 'POST', data, 'multipart/form-data', true)
}

export async function getAdoption(id) {
  return await apiRequest(`/adoption/${id}`, 'GET', null, 'application/json', true)
}

export async function deleteAdoption(id){
  return await apiRequest(`/adoption/${id}`, 'DELETE', null, 'application/json', true)
}

export async function editAdoption(id, data) {
  return await apiRequest(`/adoption/${id}`, 'PUT', data, 'multipart/form-data', true)
}

