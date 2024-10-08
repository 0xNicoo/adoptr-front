'use server';

import { changeAdoptionStatus, createAdoption, deleteAdoption, editAdoption, getAdoption, getAdoptions } from "@/lib/api/adoption";

export async function getAdoptionsAction(filter, page, size) {
  const {data, headers} = await getAdoptions(filter, page, size); 
  return { total: headers.totalCount, data };
}

export async function createAdoptionAction(formData){
  const {data, headers} = await createAdoption(formData);
  return data
}

export async function editAdoptionAction(id, formData) {
  const {data, headers} = await editAdoption(id, formData)
  return data; 
} 

export async function deleteAdoptionAction(id){
  const {data, headers} = await deleteAdoption(id)
  return data 
}

export async function getAdoptionAction(adoptionId) {
  const {data, headers} = await getAdoption(adoptionId); 
  return data
}

export async function changeAdoptionStatusAction(id, nextStatus){
  const {data, headers} = await changeAdoptionStatus(id, nextStatus);
  return data
}