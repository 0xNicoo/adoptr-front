'use server'

import { getProvinces } from "@/lib/api/location";
import { getLocalities } from "@/lib/api/location";
import { createAdoption } from "@/lib/api/adoption"

export async function getProvince() {
  return await getProvinces(); 
}

export async function getLocality(provinceId) {
  return await getLocalities(provinceId); 
}

export async function handleCreateAdoption(data){
  return await createAdoption(data)
}