'use server'

import { createService, deleteService, editService, getServiceById, getServiceTypes, getServices, getServiceTypeId } from "@/lib/api/service";

export async function getServicesAction(filter, page, size) {
  const {data, headers} = await getServices(filter, page, size)
  return { total: headers.totalCount, data }
}

export async function editServiceAction(id, formData) {
  const {data, headers} = await editService(id, formData)
  return data
}

export async function getServiceTypesAction() {
  const {data, headers} = await getServiceTypes()
  return data
}

export async function getServiceAction(serviceId) {
  const {data, headers} = await getServiceById(serviceId)
  return data
}

export async function deleteServiceAction(id){
  const {data, headers} = await deleteService(id)
  return data
}

export async function createServiceAction(formData){
  const {data, headers} = await createService(formData)
  return data
}

export async function getServiceTypeIdAction(serviceTypeId) {
  try {
    const { data, headers } = await getServiceTypeId(serviceTypeId); 
    return data;
  } catch (error) {
    console.error("Error en getServiceTypeIdAction:", error); 
    throw error;
  }
}
