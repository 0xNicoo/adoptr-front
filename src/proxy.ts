import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Guardia de navegación por presencia de cookie: no valida el JWT ni autoriza.
// `protectedTrees` cubre también las subrutas (/profile cubre /profile/new); `protectedPaths`
// es la ruta exacta, porque /adoptions y /adoptions/[id] son públicas.
const protectedTrees = ['/profile']
const protectedPaths = ['/adoptions/new', '/saved']

const protectedPatterns = [/^\/adoptions\/[^/]+\/edit$/]

function isProtected(path: string) {
  return (
    protectedPaths.includes(path) ||
    protectedPatterns.some((pattern) => pattern.test(path)) ||
    protectedTrees.some((route) => path === route || path.startsWith(`${route}/`))
  )
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  const token = (await cookies()).get('access_token')?.value

  if (isProtected(path) && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
