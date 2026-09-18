"use client"

import * as React from "react"
import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/components/i18n/locale-provider"
import { setLocale } from "@/lib/i18n/actions"
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config"

export function LanguageSwitcher({
  variant = "icon",
}: {
  variant?: "icon" | "labelled"
}) {
  const { locale, dict } = useI18n()
  const [pending, startTransition] = React.useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={dict.common.language}
        disabled={pending}
        render={
          variant === "icon" ? (
            <Button variant="ghost" size="icon" />
          ) : (
            <Button variant="outline" size="sm" />
          )
        }
      >
        <LanguagesIcon data-icon={variant === "icon" ? undefined : "inline-start"} />
        {variant === "labelled" ? LOCALE_LABELS[locale].short : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(next) =>
              startTransition(() => {
                void setLocale(String(next))
              })
            }
          >
            {LOCALES.map((value) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {LOCALE_LABELS[value].label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
