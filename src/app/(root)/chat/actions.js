'use server';

import { getToken } from "@/lib/session";
import { jwtDecode } from "jwt-decode";
import { getChat } from "@/lib/api/chat";
import { getProfileByUserId } from "@/lib/api/profile";

export async function getAccessToken() {
    return await getToken();
}

export async function getChatAction(id){
    return await getChat(id)
}

export async function getProfileByUserIdAction(userId) {
    return await getProfileByUserId(userId);
}


//TODO(nico): este metodo se llama en varios actions, encontrar alguna forma de hacerlo global.
export async function getUserId() {
    const token = await getToken()
    if (token) {
      const decoded = jwtDecode(token)
      return decoded.userId
    }
    throw new Error('No hay token')
}

export async function getUserEmail() {
    const token = await getToken()
    if (token) {
      const decoded = jwtDecode(token)
      return decoded.sub
    }
    throw new Error('No hay token')
  }