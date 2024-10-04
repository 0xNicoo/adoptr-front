import 'server-only';

import { apiRequest } from '../apiRequest';

export async function getPosts(page, size) {
  return await apiRequest(`/post/all?page=${page}&size=${size}`, 'GET', null, 'application/json', true)
}

export async function getAllPosts(page, size) {
  return await apiRequest(`/post/community/all?page=${page}&size=${size}`, 'GET', null, 'application/json', true)
}

export async function getPost(id) {
  return await apiRequest(`/post/${id}`, 'GET', null, 'application/json', true)
}

export async function getPostsByUserId(userId) {
  return await apiRequest(`/post/user/${userId}`, 'GET', null, 'application/json', true)
}

export async function createPost(formData) {
  return await apiRequest(`/post`, 'POST', formData, 'multipart/form-data', true)
}

export async function deletePost(id){
  return await apiRequest(`/post/${id}`, 'DELETE', null, 'application/json', true)
}