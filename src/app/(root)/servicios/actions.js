'use server';

import { getServices } from "@/lib/api/service";
import { getProvinces } from "@/lib/api/location";
import { getLocalities } from "@/lib/api/location";
import { getServiceTypes } from "@/lib/api/service";

export async function getService(filter, page) {
  const resp = await getServices(filter, page, 8); 
  const total  = resp.headers.get('x-total-count');
  const data = await resp.json();
  return { total, data };
}

export async function getProvince() {
  return await getProvinces(); 
}

export async function getLocality(provinceId) {
  return await getLocalities(provinceId); 
}

export async function getServiceType() {
  return await getServiceTypes(); 
}