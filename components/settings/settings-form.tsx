"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { useI18n } from "@/components/i18n/locale-provider"
import { fill } from "@/lib/i18n/fill"

const CURRENCIES = [
  { label: "US dollar (USD)", value: "USD" },
  { label: "Nigerian naira (NGN)", value: "NGN" },
  { label: "Thai baht (THB)", value: "THB" },
  { label: "Euro (EUR)", value: "EUR" },
]

const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "Africa/Lagos", value: "Africa/Lagos" },
  { label: "Asia/Bangkok", value: "Asia/Bangkok" },
  { label: "Europe/London", value: "Europe/London" },
]

const PER_PAGE_VALUES = ["10", "20", "50"] as const

/** A URL-free form: these preferences are local state, not searchParams. */
export function SettingsForm() {
  const { dict } = useI18n()
  const t = dict.pages.settings
  const perPageItems = PER_PAGE_VALUES.map((value) => ({
    label: fill(t.rows, { count: value }),
    value,
  }))
  const [pending, setPending] = React.useState(false)
  const [currency, setCurrency] = React.useState("USD")
  const [timezone, setTimezone] = React.useState("UTC")
  const [perPage, setPerPage] = React.useState("10")

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    // Mock persistence: there is no API behind this template yet.
    window.setTimeout(() => {
      setPending(false)
      toast.add({ title: t.saved, description: t.savedHint })
    }, 700)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend variant="label">{t.workspace}</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="workspace-name">{t.workspaceName}</FieldLabel>
            <Input
              id="workspace-name"
              name="workspaceName"
              defaultValue="Northwind Commerce"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="support-email">{t.supportEmail}</FieldLabel>
            <Input
              id="support-email"
              name="supportEmail"
              type="email"
              defaultValue="support@northwind.example"
            />
            <FieldDescription>{t.supportEmailHint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="address">{t.address}</FieldLabel>
            <Textarea
              id="address"
              name="address"
              rows={3}
              defaultValue={"12 Awolowo Rd, Ikoyi\nLagos, Nigeria"}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend variant="label">{t.regional}</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>{t.currency}</FieldLabel>
            <Select
              items={CURRENCIES}
              value={currency}
              onValueChange={(value) => setCurrency(String(value))}
            >
              <SelectTrigger className="w-full" aria-label={t.currency}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {CURRENCIES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{t.timezone}</FieldLabel>
            <Select
              items={TIMEZONES}
              value={timezone}
              onValueChange={(value) => setTimezone(String(value))}
            >
              <SelectTrigger className="w-full" aria-label={t.timezone}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {TIMEZONES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>{t.timezoneHint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>{t.rowsPerPage}</FieldLabel>
            <Select
              items={perPageItems}
              value={perPage}
              onValueChange={(value) => setPerPage(String(value))}
            >
              <SelectTrigger className="w-full" aria-label={t.rowsPerPage}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {perPageItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend variant="label">{dict.common.language}</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>{t.language}</FieldLabel>
            <LanguageSwitcher variant="labelled" />
          </Field>
          <FieldDescription>{t.languageHint}</FieldDescription>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend variant="label">{t.notifications}</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notify-orders">{t.newOrderAlerts}</FieldLabel>
            <Switch id="notify-orders" name="notifyOrders" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notify-failed">{t.failedPaymentAlerts}</FieldLabel>
            <Switch id="notify-failed" name="notifyFailed" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notify-digest">{t.weeklyDigest}</FieldLabel>
            <Switch id="notify-digest" name="notifyDigest" />
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {pending ? dict.common.saving : dict.common.save}
        </Button>
        <Button type="reset" variant="outline">
          {dict.common.reset}
        </Button>
      </div>
    </form>
  )
}
