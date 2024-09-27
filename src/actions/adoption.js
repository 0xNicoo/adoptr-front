'use server';

import { createAdoption, getAdoptions } from "@/lib/api/adoption";
import { getAllFavorites } from "@/lib/api/favorite";
import { getProvinces } from "@/lib/api/location";
import { getLocalities } from "@/lib/api/location";

export async function getAdoptionAction(filter, page) {
  const resp = await getAdoptions(filter, page, 8); 
  const total  = resp.headers.get('x-total-count');
  const data = await resp.json();
  return { total, data };
}

export async function getProvinceAction() {
  return await getProvinces(); 
}

export async function getLocalitiesAction(provinceId) {
  return await getLocalities(provinceId); 
}


export async function getAllFavoritesAction(){
  return await getAllFavorites()
}

export async function createAdoptionAction(data){
  return await createAdoption(data)
}
