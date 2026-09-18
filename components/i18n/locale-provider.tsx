"use client"

import * as React from "react"

import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { Locale } from "@/lib/i18n/config"

type I18nValue = { locale: Locale; dict: Dictionary }

const I18nContext = React.createContext<I18nValue | null>(null)

/**
 * Carries the server-resolved dictionary into client components. The dictionary
 * is plain serialisable data, so passing it across the boundary is cheap and
 * there is no second fetch on the client.
 */
export function LocaleProvider({
  locale,
  dict,
  children,
}: I18nValue & { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ locale, dict }), [locale, dict])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const value = React.useContext(I18nContext)
  if (!value) {
    throw new Error("useI18n must be used inside a LocaleProvider.")
  }
  return value
}
