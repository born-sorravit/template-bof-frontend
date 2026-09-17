"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookmarkIcon,
  CalendarIcon,
  MapPinIcon,
  SearchIcon,
  Settings2Icon,
  SlidersHorizontalIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import {
  DATE_RANGE_META,
  DELIVERY_STATUS_META,
  ORDER_STATUS_META,
  PRICE_BAND_META,
} from "@/lib/orders-display"
import {
  buildOrdersHref,
  CLEARED_FILTERS,
  DATE_RANGE_VALUES,
  DELIVERY_STATUS_VALUES,
  ORDER_STATUS_VALUES,
  PRICE_BAND_VALUES,
} from "@/lib/orders-query"
import type { SavedFilter } from "@/lib/data/saved-filters"
import type {
  DateRangeKey,
  DeliveryStatus,
  OrderStatus,
  OrdersQuery,
  PriceBandKey,
} from "@/lib/types/order"

/**
 * A URL-driven Select. Base UI needs `items` on the root, and the "any" choice
 * is an item with `value: null` rather than a placeholder string.
 */
function FilterSelect<T extends string>({
  label,
  value,
  items,
  onPick,
  className,
}: {
  label: string
  value: T | null
  items: Array<{ label: string; value: T | null }>
  onPick: (value: T | null) => void
  className?: string
}) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => onPick(next as T | null)}
    >
      <SelectTrigger className={className} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.label} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const STATUS_ITEMS: Array<{ label: string; value: OrderStatus | null }> = [
  { label: "All statuses", value: null },
  ...ORDER_STATUS_VALUES.map((value) => ({
    label: ORDER_STATUS_META[value].label,
    value: value as OrderStatus | null,
  })),
]

const DELIVERY_ITEMS: Array<{ label: string; value: DeliveryStatus | null }> = [
  { label: "Any delivery status", value: null },
  ...DELIVERY_STATUS_VALUES.map((value) => ({
    label: DELIVERY_STATUS_META[value].label,
    value: value as DeliveryStatus | null,
  })),
]

const RANGE_ITEMS = DATE_RANGE_VALUES.map((value) => ({
  label: DATE_RANGE_META[value].label,
  value: value as DateRangeKey | null,
}))

const PRICE_ITEMS = PRICE_BAND_VALUES.map((value) => ({
  label: PRICE_BAND_META[value].label,
  value: value as PriceBandKey | null,
}))

function DateRangeFilter({
  query,
  push,
}: {
  query: OrdersQuery
  push: (patch: Partial<OrdersQuery>) => void
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className="w-full md:w-auto" />}
      >
        <CalendarIcon data-icon="inline-start" />
        {query.range === "all"
          ? "Date range"
          : DATE_RANGE_META[query.range].label}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56">
        <PopoverTitle>Created date</PopoverTitle>
        <FieldGroup className="pt-2">
          <Field>
            <FieldLabel className="sr-only">Date range</FieldLabel>
            <FilterSelect
              label="Filter by created date"
              className="w-full"
              value={query.range}
              items={RANGE_ITEMS}
              onPick={(range) => push({ range: range ?? "all" })}
            />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}

function AddressFilter({
  query,
  cities,
  push,
}: {
  query: OrdersQuery
  cities: string[]
  push: (patch: Partial<OrdersQuery>) => void
}) {
  const items = React.useMemo(
    () => [
      { label: "Any address", value: null },
      ...cities.map((city) => ({ label: city, value: city as string | null })),
    ],
    [cities]
  )

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className="w-full md:w-auto" />}
      >
        <MapPinIcon data-icon="inline-start" />
        {query.city ?? "Address"}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56">
        <PopoverTitle>Delivery city</PopoverTitle>
        <FieldGroup className="pt-2">
          <Field>
            <FieldLabel className="sr-only">City</FieldLabel>
            <FilterSelect
              label="Filter by city"
              className="w-full"
              value={query.city}
              items={items}
              onPick={(city) => push({ city })}
            />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}

function SavedFiltersPopover({
  query,
  savedFilters,
}: {
  query: OrdersQuery
  savedFilters: SavedFilter[]
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className="w-full md:w-auto" />}
      >
        <BookmarkIcon data-icon="inline-start" />
        Saved filters ({savedFilters.length})
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="p-3 pb-1">
          <PopoverTitle>Saved filters</PopoverTitle>
        </div>
        <ScrollArea className="h-72">
          <ItemGroup className="p-1">
            {savedFilters.map((saved) => (
              <Item
                key={saved.id}
                render={
                  <Link
                    href={buildOrdersHref(query, {
                      ...CLEARED_FILTERS,
                      ...saved.patch,
                    })}
                    scroll={false}
                  />
                }
              >
                <ItemContent>
                  <ItemTitle>{saved.name}</ItemTitle>
                  <ItemDescription>{saved.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function MoreFiltersPopover({
  query,
  push,
}: {
  query: OrdersQuery
  push: (patch: Partial<OrdersQuery>) => void
}) {
  const extraCount =
    (query.delivery !== null ? 1 : 0) + (query.price !== "all" ? 1 : 0)

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className="w-full md:w-auto" />}
      >
        <Settings2Icon data-icon="inline-start" />
        More filters
        {extraCount > 0 ? (
          <Badge variant="secondary" data-icon="inline-end">
            {extraCount}
          </Badge>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <PopoverTitle>More filters</PopoverTitle>
        <FieldGroup className="pt-2">
          <Field>
            <FieldLabel>Delivery status</FieldLabel>
            <FilterSelect
              label="Filter by delivery status"
              className="w-full"
              value={query.delivery}
              items={DELIVERY_ITEMS}
              onPick={(delivery) => push({ delivery })}
            />
          </Field>
          <Field>
            <FieldLabel>Price</FieldLabel>
            <FilterSelect
              label="Filter by price"
              className="w-full"
              value={query.price}
              items={PRICE_ITEMS}
              onPick={(price) => push({ price: price ?? "all" })}
            />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}

export function OrdersToolbar({
  query,
  cities,
  savedFilters,
}: {
  query: OrdersQuery
  cities: string[]
  savedFilters: SavedFilter[]
}) {
  const router = useRouter()

  const push = React.useCallback(
    (patch: Partial<OrdersQuery>) => {
      router.push(buildOrdersHref(query, patch), { scroll: false })
    },
    [query, router]
  )

  const controls = (
    <>
      <DateRangeFilter query={query} push={push} />
      <FilterSelect
        label="Filter by status"
        className="w-full md:w-auto"
        value={query.status}
        items={STATUS_ITEMS}
        onPick={(status) => push({ status })}
      />
      <AddressFilter query={query} cities={cities} push={push} />
      <SavedFiltersPopover query={query} savedFilters={savedFilters} />
      <MoreFiltersPopover query={query} push={push} />
    </>
  )

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-3 md:flex-row md:items-center md:justify-between">
      <form
        className="w-full md:max-w-sm"
        onSubmit={(event) => {
          event.preventDefault()
          const value = new FormData(event.currentTarget).get("q")
          push({ q: String(value ?? "").trim() })
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
        {controls}
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
          <div className="flex flex-col gap-2 p-4">{controls}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
