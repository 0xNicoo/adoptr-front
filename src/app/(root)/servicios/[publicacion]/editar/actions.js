'use server';

import { getToken } from "@/lib/session";
import { jwtDecode } from "jwt-decode";
import { getProvinces, getLocalities } from "@/lib/api/location";
import { editService } from "@/lib/api/service"; 
import { getServiceTypes } from "@/lib/api/service";

//TODO(nico): este metodo se llama en varios actions, encontrar alguna forma de hacerlo global.
export async function getUserId() {
  const token = await getToken()
  if (token) {
    const decoded = jwtDecode(token)
    return decoded.userId
  }
  throw new Error('No hay token')
}

export async function getProvince() {
  return await getProvinces(); 
}

export async function getLocality(provinceId) {
  return await getLocalities(provinceId); 
}

export async function editServiceAction(id, data) {
  return await editService(id, data); 
}

export async function getServiceType() {
  return await getServiceTypes(); 
}