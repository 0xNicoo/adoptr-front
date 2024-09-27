'use server';

import { getProvinces } from "@/lib/api/location";
import { getLocalities } from "@/lib/api/location";

export async function getProvinceAction() {
    return await getProvinces(); 
}
  
export async function getLocalitiesAction(provinceId) {
    return await getLocalities(provinceId); 
}