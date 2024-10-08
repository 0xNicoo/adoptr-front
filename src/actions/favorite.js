'use server'

import { getAllFavorites, getFavorite, setFavorite } from "@/lib/api/favorite"

export async function getAllFavoritesAction(){
  const {data, headers} = await getAllFavorites()
  return data
}

export async function setFavoriteAction(publicationId){
  const {data, headers} = await setFavorite(publicationId)
  return data
}

export async function getFavoriteAction(publicationId){
  const {data, headers} = await getFavorite(publicationId)
  return data
}
