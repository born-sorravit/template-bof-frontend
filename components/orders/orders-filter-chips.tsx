"use client"

import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DATE_RANGE_META,
  DELIVERY_STATUS_META,
  ORDER_STATUS_META,
  ORDER_TAB_META,
  PRICE_BAND_META,
} from "@/lib/orders-display"
import { buildOrdersHref, CLEARED_FILTERS } from "@/lib/orders-query"
import type { OrdersQuery } from "@/lib/types/order"

type Chip = { key: string; label: string; href: string }

function chipsFor(query: OrdersQuery): Chip[] {
  const chips: Chip[] = []

  if (query.q) {
    chips.push({
      key: "q",
      label: `Search: ${query.q}`,
      href: buildOrdersHref(query, { q: "" }),
    })
  }
  if (query.status) {
    chips.push({
      key: "status",
      label: `Status: ${ORDER_STATUS_META[query.status].label}`,
      href: buildOrdersHref(query, { status: null }),
    })
  }
  if (query.delivery) {
    chips.push({
      key: "delivery",
      label: `Delivery: ${DELIVERY_STATUS_META[query.delivery].label}`,
      href: buildOrdersHref(query, { delivery: null }),
    })
  }
  if (query.range !== "all") {
    chips.push({
      key: "range",
      label: DATE_RANGE_META[query.range].label,
      href: buildOrdersHref(query, { range: "all" }),
    })
  }
  if (query.city) {
    chips.push({
      key: "city",
      label: `City: ${query.city}`,
      href: buildOrdersHref(query, { city: null }),
    })
  }
  if (query.price !== "all") {
    chips.push({
      key: "price",
      label: PRICE_BAND_META[query.price].label,
      href: buildOrdersHref(query, { price: "all" }),
    })
  }
  if (query.tab !== "all") {
    chips.push({
      key: "tab",
      label: `Tab: ${ORDER_TAB_META[query.tab].label}`,
      href: buildOrdersHref(query, { tab: "all" }),
    })
  }

  return chips
}

export function OrdersFilterChips({ query }: { query: OrdersQuery }) {
  const reduced = useReducedMotion()
  const chips = chipsFor(query)

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Active filters</span>
      <AnimatePresence initial={false} mode="popLayout">
        {chips.map((chip) => (
          <motion.span
            key={chip.key}
            layout={!reduced}
            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge
              variant="outline"
              render={<Link href={chip.href} scroll={false} />}
            >
              {chip.label}
              <XIcon />
            </Badge>
          </motion.span>
        ))}
      </AnimatePresence>
      <Button
        variant="ghost"
        size="xs"
        render={<Link href={buildOrdersHref(query, CLEARED_FILTERS)} scroll={false} />}
        nativeButton={false}
      >
        Clear all
      </Button>
    </div>
  )
}
