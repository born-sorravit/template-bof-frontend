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

const PER_PAGE = [
  { label: "10 rows", value: "10" },
  { label: "20 rows", value: "20" },
  { label: "50 rows", value: "50" },
]

/** A URL-free form: these preferences are local state, not searchParams. */
export function SettingsForm() {
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
      toast.add({
        title: "Settings saved",
        description: "Mock only — wire this to your API to persist it.",
      })
    }, 700)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend variant="label">Workspace</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
            <Input
              id="workspace-name"
              name="workspaceName"
              defaultValue="Northwind Commerce"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="support-email">Support email</FieldLabel>
            <Input
              id="support-email"
              name="supportEmail"
              type="email"
              defaultValue="support@northwind.example"
            />
            <FieldDescription>
              Shown on invoices and in customer emails.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="address">Registered address</FieldLabel>
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
        <FieldLegend variant="label">Regional</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Select
              items={CURRENCIES}
              value={currency}
              onValueChange={(value) => setCurrency(String(value))}
            >
              <SelectTrigger className="w-full" aria-label="Currency">
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
            <FieldLabel>Timezone</FieldLabel>
            <Select
              items={TIMEZONES}
              value={timezone}
              onValueChange={(value) => setTimezone(String(value))}
            >
              <SelectTrigger className="w-full" aria-label="Timezone">
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
            <FieldDescription>
              Dates in this template are pinned to UTC so the server and browser
              always agree.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Default rows per page</FieldLabel>
            <Select
              items={PER_PAGE}
              value={perPage}
              onValueChange={(value) => setPerPage(String(value))}
            >
              <SelectTrigger className="w-full" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {PER_PAGE.map((item) => (
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
        <FieldLegend variant="label">Notifications</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notify-orders">New order alerts</FieldLabel>
            <Switch id="notify-orders" name="notifyOrders" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notify-failed">
              Failed payment alerts
            </FieldLabel>
            <Switch id="notify-failed" name="notifyFailed" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notify-digest">Weekly digest</FieldLabel>
            <Switch id="notify-digest" name="notifyDigest" />
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {pending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
    </form>
  )
}
