'use server'

import { setTokenCookie } from "../lib/session"

export async function login(data){
   await setTokenCookie(data)
}
