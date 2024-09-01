'use server'

import { getProvinces } from "@/lib/api/location";
import { getLocalitiesByProvince } from "@/lib/api/location";
import { createAdoption } from "@/lib/api/adoption"

export async function getProvince() {
  return await getProvinces(); 
}

export async function getLocality(provinceId) {
  return await getLocalitiesByProvince(provinceId); 
}

export async function handleCreateAdoption(data){
  await createAdoption(data)
}