"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

import { isLocale, LOCALE_COOKIE } from "@/lib/i18n/config"

const ONE_YEAR = 60 * 60 * 24 * 365

/** Cookies can only be written from a Server Function or Route Handler. */
export async function setLocale(next: string) {
  if (!isLocale(next)) return

  const store = await cookies()
  store.set(LOCALE_COOKIE, next, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  })

  // Every page reads the dictionary on the server, so the whole tree restyles.
  revalidatePath("/", "layout")
}
