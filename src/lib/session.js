import 'server-only'
import { cookies } from 'next/headers'
import { loginAPI } from './api/auth'
import { getIronSession } from 'iron-session'

//TODO (nico) hacer un middlewere o algo antes de cada request para checkear si tiene token.

export async function setSessionToken(data){
  const res = await loginAPI(data)
  const session = await getSession()
  session.token = res.accessToken
  await session.save()
}   

export async function getToken(){
  const session = await getSession()
  return session.token
}

export async function getSession(){
  return await getIronSession(
    cookies(), {
      password: process.env.SESSION_SECRET,
      cookieName: "session", 
      cookieOptions: {
        httpOnly: true,
      }
    })
}

