"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  BookmarkIcon,
  CalendarIcon,
  MapPinIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  Settings2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ORDER_STATUS_META } from "@/lib/orders-display"
import {
  buildOrdersHref,
  ORDER_STATUS_VALUES,
} from "@/lib/orders-query"
import type { OrderStatus, OrdersQuery } from "@/lib/types/order"

type StatusItem = { label: string; value: OrderStatus | null }

const STATUS_ITEMS: StatusItem[] = [
  { label: "All statuses", value: null },
  ...ORDER_STATUS_VALUES.map((value) => ({
    label: ORDER_STATUS_META[value].label,
    value: value as OrderStatus | null,
  })),
]

function StatusSelect({ query }: { query: OrdersQuery }) {
  const router = useRouter()

  return (
    <Select
      items={STATUS_ITEMS}
      value={query.status}
      onValueChange={(value) =>
        router.push(
          buildOrdersHref(query, { status: value as OrderStatus | null }),
          { scroll: false }
        )
      }
    >
      <SelectTrigger className="w-full md:w-auto" aria-label="Filter by status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        <SelectGroup>
          {STATUS_ITEMS.map((item) => (
            <SelectItem key={item.label} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

/**
 * The template's date-range, address and saved-filter controls are visual
 * scaffolding: they demonstrate the composition but do not narrow the mock
 * data. Only search, status and the tabs are wired to the URL.
 */
function ScaffoldPopover({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: React.ComponentType
  label: string
  title: string
  description: string
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className="w-full md:w-auto" />}
      >
        <Icon data-icon="inline-start" />
        {label}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <PopoverTitle>{title}</PopoverTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </PopoverContent>
    </Popover>
  )
}

function FilterControls({ query }: { query: OrdersQuery }) {
  return (
    <>
      <ScaffoldPopover
        icon={CalendarIcon}
        label="Date range"
        title="Date range"
        description="Wire this to your date picker of choice — the URL already carries every other filter."
      />
      <StatusSelect query={query} />
      <ScaffoldPopover
        icon={MapPinIcon}
        label="Address"
        title="Address"
        description="Filter by delivery region once your API exposes it."
      />
      <ScaffoldPopover
        icon={BookmarkIcon}
        label="Saved filters (15)"
        title="Saved filters"
        description="Persist a named set of search params per user."
      />
      <ScaffoldPopover
        icon={Settings2Icon}
        label="More filters"
        title="More filters"
        description="Delivery status, price band, channel — add them to parseOrdersQuery."
      />
    </>
  )
}

export function OrdersToolbar({ query }: { query: OrdersQuery }) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-3 md:flex-row md:items-center md:justify-between">
      <form
        className="w-full md:max-w-sm"
        onSubmit={(event) => {
          event.preventDefault()
          const value = new FormData(event.currentTarget).get("q")
          router.push(
            buildOrdersHref(query, { q: String(value ?? "").trim() }),
            { scroll: false }
          )
        }}
      >
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          {/* Uncontrolled, and re-keyed on `query.q`: when the URL changes from
              elsewhere (a chip cleared, the back button) React remounts the
              field with the new value. No resync effect, no stale draft. */}
          <InputGroupInput
            key={query.q}
            name="q"
            defaultValue={query.q}
            placeholder="Search anything..."
            aria-label="Search orders"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" aria-label="Apply search">
              <SlidersHorizontalIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>

      {/* Desktop: the filters sit inline. */}
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        <FilterControls query={query} />
      </div>

      {/* Mobile: five pills wrap badly, so they move into a sheet. */}
      <Sheet>
        <SheetTrigger render={<Button variant="outline" className="md:hidden" />}>
          <SlidersHorizontalIcon data-icon="inline-start" />
          Filters
        </SheetTrigger>
        <SheetContent side="bottom" className="md:hidden">
          <SheetHeader>
            <SheetTitle>Filter orders</SheetTitle>
          </SheetHeader>
          <FieldGroup className="p-4">
            <Field>
              <FieldLabel>Filters</FieldLabel>
              <div className="flex flex-col gap-2">
                <FilterControls query={query} />
              </div>
            </Field>
          </FieldGroup>
        </SheetContent>
      </Sheet>
    </div>
  )
}
