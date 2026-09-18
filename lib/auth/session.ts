import { cookies } from "next/headers"

import { DEMO_USERS, type DemoUser } from "@/lib/auth/users"

export const SESSION_COOKIE = "session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

/**
 * The session is just the user id in a cookie.
 *
 * This is deliberately NOT a real auth scheme — there is no signing, no
 * expiry check and no server-side store, so it must not ship as-is. It exists
 * so the seam is in the right place: swap `getSession` for a real lookup and
 * `signIn` for a real credential check, and nothing in the UI changes.
 */
export async function getSession(): Promise<DemoUser | null> {
  const store = await cookies()
  const id = store.get(SESSION_COOKIE)?.value
  if (!id) return null
  return DEMO_USERS.find((user) => user.id === id) ?? null
}
