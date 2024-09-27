'use server'

import { registerAPI } from "@/lib/api/auth";
import { setSessionToken } from "@/lib/session";

export async function loginAction(data){
    await setSessionToken(data)
}

 export async function registerAction(data){
    await registerAPI(data)
}
