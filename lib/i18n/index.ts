import { cookies } from "next/headers"

import { en } from "@/lib/i18n/dictionaries/en"
import { th } from "@/lib/i18n/dictionaries/th"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config"

const DICTIONARIES: Record<Locale, Dictionary> = { en, th }

/** Server-only: reads the locale cookie. `cookies()` is async in Next 16. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export function dictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}

export async function getDictionary(): Promise<{
  locale: Locale
  dict: Dictionary
}> {
  const locale = await getLocale()
  return { locale, dict: DICTIONARIES[locale] }
}

export { fill } from "@/lib/i18n/fill"
