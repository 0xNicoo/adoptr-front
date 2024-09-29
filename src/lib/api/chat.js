import 'server-only';

import { apiRequest } from '../apiRequest';

export async function getChatList() {
  return await apiRequest(`/chat/all`, 'GET', null, 'application/json', true)
}

export async function getChatByPublication(publicationId) {
  return await apiRequest(`/chat/publication/${publicationId}`, 'GET', null, 'application/json', true)
}

export async function getChat(id) {
  return await apiRequest(`/chat/${id}`, 'GET', null, 'application/json', true)
}