'use server'

import { getProvinces } from "@/lib/api/location";
import { getLocalities } from "@/lib/api/location";
import { getServiceTypes } from "@/lib/api/service";
import { createService } from "@/lib/api/service";

export async function getProvince() {
    return await getProvinces(); 
}
  
export async function getLocality(provinceId) {
    return await getLocalities(provinceId); 
}

export async function getServiceType() {
    return await getServiceTypes(); 
}

export async function handleCreateService(data){
    return await createService(data)
  }