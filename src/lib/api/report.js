import 'server-only';

import { apiRequest } from '../apiRequest';

export async function reportProfile(data) {
    return await apiRequest(`/report/profile`, 'POST', data, 'application/json', true)
}


export async function reportPublication(data) {
    return await apiRequest(`/report/publication`, 'POST', data, 'application/json', true)
}
