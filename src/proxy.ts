import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_COOKIE = 'auth_token'
const PUBLIC_PATHS = ['/login', '/signup']

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow auth pages and auth API routes
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    await jwtVerify(token, secret())
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.set(AUTH_COOKIE, '', { path: '/', maxAge: 0 })
    return res
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
