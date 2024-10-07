import 'server-only';

import { apiRequest } from '../apiRequest';

export async function getChatList() {
  return await apiRequest(`/chat/all`, 'GET', null, 'application/json', true)
}

export async function getChatListGroupByPublication() {
  return await apiRequest(`/chat/publication/all`, 'GET', null, 'application/json', true)
}

export async function getChatListGroupByUser() {
  return await apiRequest(`/chat/user/all`, 'GET', null, 'application/json', true)
}

export async function getChatsByPublication(publicationId) {
  return await apiRequest(`/chat/publication/${publicationId}`, 'GET', null, 'application/json', true)
}

export async function getChat(id) {
  return await apiRequest(`/chat/${id}`, 'GET', null, 'application/json', true)
}