'use server';

import { getProvinces } from "@/lib/api/location";
import { getLocalitiesByProvince } from "@/lib/api/location";
import { createProfile } from "@/lib/api/profile";

export async function getProvince() {
  return await getProvinces(); 
}

export async function getLocality(provinceId) {
  return await getLocalitiesByProvince(provinceId); 
}

export async function handleCreatePerfil(data) {
  await createProfile(data); 
}
