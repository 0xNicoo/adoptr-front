'use server'

import { getAllFavorites, getFavorite, setFavorite } from "@/lib/api/favorite"

export async function getAllFavoritesAction(){
  return await getAllFavorites()
}

export async function setFavoriteAction(publicationId){
  return await setFavorite(publicationId)
}

export async function getFavoriteAction(publicationId){
  return await getFavorite(publicationId)
}
