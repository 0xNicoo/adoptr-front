import 'server-only';

import { apiRequest } from '../apiRequest';
import { getQueryParams } from '@/util/queryparams';

export async function createLost(data){
    return await apiRequest(`/lost`, 'POST', data, 'multipart/form-data', true)
  }
  