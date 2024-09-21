'use server';

import { getProfileByUserId } from "@/lib/api/profile";
import { getPostsByUserId } from "@/lib/api/post";
import { getAdoptions } from "@/lib/api/adoption";
import { getToken } from "@/lib/session";

export async function handleGetProfile(userId) {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token');
      }
      const profile = await getProfileByUserId(userId, token);
      return profile;
    } catch (error) {
      console.error('Error en handleGetProfile:', error);
      throw error;
    }
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


export async function handleGetPosts(userId) {
  return await getPostsByUserId(userId);
}

export async function handleGetAdoptions(filter, page, size) {
  const res = await getAdoptions(filter, page, size);
  if (!res.ok) {
    throw new Error('Failed to fetch adoptions');
  }
  return res.json(); 
}