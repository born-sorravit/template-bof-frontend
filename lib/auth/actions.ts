"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { dictionaryFor } from "@/lib/i18n"
import { getLocale } from "@/lib/i18n"
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session"
import { DEMO_PASSWORD, findUser } from "@/lib/auth/users"

export type SignInState = { error: string | null }

/**
 * Validates against the in-memory demo users and stores the user id in a
 * cookie. Replace the two lines that touch `findUser`/`DEMO_PASSWORD` with a
 * real credential check and the rest of the app is unaffected.
 */
export async function signIn(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const dict = dictionaryFor(await getLocale())

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const next = String(formData.get("next") ?? "/dashboard")

  if (!email || !password) return { error: dict.login.missing }

  const user = findUser(email)
  if (!user || password !== DEMO_PASSWORD) {
    return { error: dict.login.invalid }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, user.id, {
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
  })

  // Only ever redirect to an in-app path, never to an attacker-supplied host.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard")
}

export async function signOut() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect("/login")
}
