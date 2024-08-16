import 'server-only'
import { cookies } from 'next/headers'
import { loginAPI } from './api/auth'

export async function setTokenCookie(data){
  const res = await loginAPI(data)
  cookies().set('session', res.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })
}   