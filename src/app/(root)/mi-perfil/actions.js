'use server';

import { getProfile } from "@/lib/api/profile";
import { getAdoptions } from "@/lib/api/adoption";
import { deleteAdoption } from "@/lib/api/adoption";
import { getPosts } from "@/lib/api/post";
import { createPost } from "@/lib/api/post";
import { getToken } from "@/lib/session";
import { jwtDecode } from "jwt-decode";


export async function handleGetProfile() {
  return await getProfile();
}

export async function handleGetAdoptions(filter, page, size) {
  const res = await getAdoptions(filter, page, size);
  if (!res.ok) {
    throw new Error('Failed to fetch adoptions');
  }
  return res.json(); 
}

export async function deleteAdoptionAction(id){
  await deleteAdoption(id)
}

//TODO(nico): este metodo se llama en varios actions, encontrar alguna forma de hacerlo global.
export async function getUserId() {
  const token = await getToken()
  if (token) {
    const decoded = jwtDecode(token)
    return decoded.userId
  }
  throw new Error('No hay token')
}


export async function handleGetPosts() {
  return await getPosts();
}

export async function handleCreatePost(FormData) {
  return await createPost(FormData);
}