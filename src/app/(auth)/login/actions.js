'use server'

import { redirect } from 'next/navigation'
import { setSessionToken } from "../../../lib/session"

const ROOT_PATH = "/"

export async function login(data){
   await setSessionToken(data)
   redirect(ROOT_PATH)
}
