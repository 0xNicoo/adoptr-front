'use server'
import { registerAPI } from "@/lib/api/auth"
import { setSessionToken } from "@/lib/session"


export async function registerUser(data){
    await registerAPI(data)
}

export async function loginUser(data) {
    await setSessionToken(data);
}