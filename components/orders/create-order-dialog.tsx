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
import { ORDER_STATUS_META } from "@/lib/orders-display"
import { ORDER_STATUS_VALUES } from "@/lib/orders-query"
import type { OrderStatus } from "@/lib/types/order"

const STATUS_ITEMS = ORDER_STATUS_VALUES.map((value) => ({
  label: ORDER_STATUS_META[value].label,
  value,
}))

export function CreateOrderDialog({
  trigger,
}: {
  trigger: React.ReactElement
}) {
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
        title: "Order created",
        description: "Mock only — wire this to your API to persist it.",
      })
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Create order</DialogTitle>
            <DialogDescription>
              Nothing is persisted — this demonstrates the form composition.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="create-product">Product</FieldLabel>
              <Input
                id="create-product"
                name="product"
                required
                placeholder="Macbook Pro 16 inch"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="create-customer">Customer</FieldLabel>
              <Input
                id="create-customer"
                name="customer"
                required
                placeholder="Edwin Martins"
              />
              <FieldDescription>
                Used for the confirmation email.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="create-price">Price</FieldLabel>
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
              <FieldLabel>Status</FieldLabel>
              <Select
                items={STATUS_ITEMS}
                value={status}
                onValueChange={(value) => setStatus(value as OrderStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {STATUS_ITEMS.map((item) => (
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
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? "Creating..." : "Create order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
