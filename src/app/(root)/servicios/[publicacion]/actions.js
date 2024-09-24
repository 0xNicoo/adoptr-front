'use server';

import { getServiceById, deleteService} from "@/lib/api/service";
import { getToken } from "@/lib/session";
import { getChatByPublicationId } from "@/lib/api/chat";
import { jwtDecode } from "jwt-decode";

export async function getServiceDetail(serviceId) {
    return await getServiceById(serviceId); 
}

export async function getUserId() {
  const token = await getToken()
  if (token) {
    const decoded = jwtDecode(token)
    return decoded.userId
  }
  throw new Error('No hay token')
}

export async function deleteServiceAction(id){
  await deleteService(id)
}

export async function getChatByPublicationIdAction(publicationId){
  return await getChatByPublicationId(publicationId)
}

