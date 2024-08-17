'use server'

import { setSessionToken } from "../../lib/session"

export async function login(data){
   await setSessionToken(data)
}
