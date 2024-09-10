'use server';

import { getAdoptionById, deleteAdoption, editAdoption } from "@/lib/api/adoption";
import { setFavorite, getFavorite } from "@/lib/api/favorite";
import { getChatByPublicationId } from "@/lib/api/chat";
import { getToken } from "@/lib/session";
import { jwtDecode } from "jwt-decode";

export async function getAdoptionDetail(adoptionId) {
    return await getAdoptionById(adoptionId); 
}

//TODO(nico): este metodo se llama en varios actions, encontrar alguna forma de hacerlo global.
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

export async function editAdoptionAction(id){
  await editAdoption(id)
}

export async function getChatByPublicationIdAction(publicationId){
  return await getChatByPublicationId(publicationId)
}

export async function setFavoriteAction(publicationId){
  return await setFavorite(publicationId)
}

export async function getFavoriteAction(publicationId){
  return await getFavorite(publicationId)
}

