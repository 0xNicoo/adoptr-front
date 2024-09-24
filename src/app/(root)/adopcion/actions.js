'use server';


import { getAdoptions } from "@/lib/api/adoption";
import { getProvinces } from "@/lib/api/location";
import { getLocalitiesByProvince } from "@/lib/api/location";

export async function getAdoption(filter, page) {
  const resp = await getAdoptions(filter, page, 8); 
  const total  = resp.headers.get('x-total-count');
  const data = await resp.json();
  return { total, data };
}

export async function getProvince() {
  return await getProvinces(); 
}

export async function getLocality(provinceId) {
  return await getLocalitiesByProvince(provinceId); 
}
