import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Route protection. In Next 16 this file is `proxy.ts` — the `middleware`
 * convention is deprecated and renamed.
 *
 * The proxy runs before rendering and may be deployed to a CDN, so it must not
 * import app modules or share globals. It therefore only checks that the
 * session cookie *exists*; whether it resolves to a real user is decided in
 * `getSession()` on the server, and the dashboard layout redirects if not.
 */
const SESSION_COOKIE = "session"
const PUBLIC_PATHS = ["/login"]

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value)
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )

  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.search = ""
    // Remember where they were headed so sign-in can return them there.
    if (pathname !== "/") url.searchParams.set("next", pathname + search)
    return NextResponse.redirect(url)
  }

  if (hasSession && isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Everything except Next internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"],
}
