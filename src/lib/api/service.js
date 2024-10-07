import 'server-only';

import { apiRequest } from '../apiRequest';
import { getQueryParams } from '@/util/queryparams';

export async function getServices(filter, page, size) {
  const queryParams = getQueryParams(filter, page, size)
  return await apiRequest(`/service?${queryParams}`, 'GET', null, 'application/json', true)
}

export async function getServiceTypes() {
  return await apiRequest(`/serviceType?page=0&size=20`, 'GET', null, 'application/json', true)
}

export async function createService(data){
  return await apiRequest(`/service`, 'POST', data, 'multipart/form-data', true)
}

export async function getServiceById(id) {
  return await apiRequest(`/service/${id}`, 'GET', null, 'application/json', true)
}

export async function deleteService(id){
  return await apiRequest(`/service/${id}`, 'DELETE', null, 'application/json', true)
}

export async function editService(id, data) {
  return await apiRequest(`/service/${id}`, 'PUT', data, 'multipart/form-data', true)
}

export async function getServiceTypeId(id) {
  return await apiRequest(`/serviceType/${id}`, 'GET', null, 'application/json', true)
}
