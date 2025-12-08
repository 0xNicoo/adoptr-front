import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
 
const protectedRoutes = ['/profile']
 
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
 
  const token = (await cookies()).get('access_token')?.value
 
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  return NextResponse.next()
}

export const config = { 
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}