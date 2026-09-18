"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
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
import { toast } from "@/components/ui/toast"
import { ORDER_STATUS_VALUES } from "@/lib/orders-query"
import { useI18n } from "@/components/i18n/locale-provider"
import type { OrderStatus } from "@/lib/types/order"

export function CreateOrderDialog({
  trigger,
}: {
  trigger: React.ReactElement
}) {
  const { dict } = useI18n()
  const statusItems = ORDER_STATUS_VALUES.map((value) => ({
    label: dict.orderStatus[value],
    value,
  }))
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [status, setStatus] = React.useState<OrderStatus>("pending")

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    // Mock persistence: there is no API behind this template yet.
    window.setTimeout(() => {
      setPending(false)
      setOpen(false)
      toast.add({
        title: dict.pages.orders.createOrder,
        description: dict.common.mockAction,
      })
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{dict.pages.orders.createOrder}</DialogTitle>
            <DialogDescription>{dict.common.mockAction}</DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="create-product">
                {dict.pages.orders.columns.product}
              </FieldLabel>
              <Input
                id="create-product"
                name="product"
                required
                placeholder="Macbook Pro 16 inch"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="create-customer">
                {dict.pages.orders.columns.customer}
              </FieldLabel>
              <Input
                id="create-customer"
                name="customer"
                required
                placeholder="Edwin Martins"
              />
              <FieldDescription>
                {dict.pages.settings.supportEmailHint}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="create-price">
                {dict.pages.orders.columns.price}
              </FieldLabel>
              <Input
                id="create-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="1299.00"
              />
            </Field>
            <Field>
              <FieldLabel>{dict.pages.orders.columns.status}</FieldLabel>
              <Select
                items={statusItems}
                value={status}
                onValueChange={(value) => setStatus(value as OrderStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {statusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              {dict.common.cancel}
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? dict.common.saving : dict.pages.orders.createOrder}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
