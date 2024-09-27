'use server';

import { createAdoption, deleteAdoption, editAdoption, getAdoption, getAdoptions } from "@/lib/api/adoption";

export async function getAdoptionsAction(filter, page) {
  const resp = await getAdoptions(filter, page, 8); 
  const total  = resp.headers.get('x-total-count');
  const data = await resp.json();
  return { total, data };
}

export async function createAdoptionAction(data){
  return await createAdoption(data)
}

export async function editAdoptionAction(id, data) {
  return await editAdoption(id, data); 
} 

export async function deleteAdoptionAction(id){
  await deleteAdoption(id)
}

export async function getAdoptionAction(adoptionId) {
  return await getAdoption(adoptionId); 
}