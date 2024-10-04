import 'server-only';

import { apiRequest } from '../apiRequest';
import { getQueryParams } from '@/util/queryparams';

export async function createLost(data){
    return await apiRequest(`/lost`, 'POST', data, 'multipart/form-data', true)
  }

export async function getLosts(filter, page, size) {
  const queryParams = getQueryParams(filter, page, size);
  return await apiRequest(`/lost?${queryParams}`, 'GET', null, 'application/json', true)
}

export async function getLost(id) {
  return await apiRequest(`/lost/${id}`, 'GET', null, 'application/json', true)
}