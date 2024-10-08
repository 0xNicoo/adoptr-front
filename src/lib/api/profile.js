import 'server-only';

import { apiRequest } from '../apiRequest';

export async function createProfile(data) {
    return await apiRequest(`/profile`, 'POST', data, 'multipart/form-data', true)
}

export async function getProfile() {
    return await apiRequest(`/profile`, 'GET', null, 'application/json', true)
}

export async function getProfileByUserId(userId) {
    return await apiRequest(`/profile/user/${userId}`, 'GET', null, 'application/json', true)
}

export async function editProfile(id, data) {
    return await apiRequest(`/profile/${id}`, 'PUT', data, 'multipart/form-data', true)
}
