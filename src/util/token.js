import 'server-only';

import { getToken } from '@/lib/session';
import { jwtDecode } from 'jwt-decode';

export async function getValidToken() {
  const token = await getToken()
  
  if (!token) {
    throw new Error("No tiene token.")
  }

  const decodedToken = jwtDecode(token)
  const currentTime = Date.now() / 1000
  
  if (decodedToken.exp < currentTime) {
    throw new Error("Token expirado.")
  }

  return token
}
