'use server'

import { getToken } from "@/lib/session"
import { jwtDecode } from "jwt-decode"

export async function getUserId() {
    const token = await getToken()
    if (token) {
      const decoded = jwtDecode(token)
      return decoded.userId
    }
    throw new Error('No hay token')
}