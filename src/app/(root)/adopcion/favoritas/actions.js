'use server';

import { getAllFavorites } from "@/lib/api/favorite";


export async function getAllFavoritesAction(){
  return await getAllFavorites()
}

