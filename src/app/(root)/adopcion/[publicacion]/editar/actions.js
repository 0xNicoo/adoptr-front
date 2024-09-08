'use server';

import { getToken } from "@/lib/session";
import { jwtDecode } from "jwt-decode";
import { getProvinces, getLocalitiesByProvince } from "@/lib/api/location";
import { editAdoption } from "@/lib/api/adoption";

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
  return await getLocalitiesByProvince(provinceId); 
}

export async function editAdoptionAction(id, data) {
  return await editAdoption(id, data); 
}