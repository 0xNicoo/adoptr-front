'use server'

import { createService, deleteService, editService, getServiceById, getServiceTypes, getServices } from "@/lib/api/service";

export async function getServicesAction(filter, page, size) {
  return await getServices(filter, page, size);
}

export async function editServiceAction(id, data) {
  return await editService(id, data); 
}

export async function getServiceTypesAction() {
  return await getServiceTypes(); 
}

export async function getServiceAction(serviceId) {
  return await getServiceById(serviceId); 
}

export async function deleteServiceAction(id){
  await deleteService(id)
}


export async function createServiceAction(data){
  return await createService(data)
}