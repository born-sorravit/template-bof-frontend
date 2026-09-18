"use client"

import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/locale-provider"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import { buildOrdersHref, CLEARED_FILTERS } from "@/lib/orders-query"
import type { OrdersQuery } from "@/lib/types/order"

type Chip = { key: string; label: string; href: string }

function chipsFor(query: OrdersQuery, dict: Dictionary): Chip[] {
  const chips: Chip[] = []

  if (query.q) {
    chips.push({
      key: "q",
      label: `${dict.pages.orders.searchPlaceholder} ${query.q}`,
      href: buildOrdersHref(query, { q: "" }),
    })
  }
  if (query.status) {
    chips.push({
      key: "status",
      label: dict.orderStatus[query.status],
      href: buildOrdersHref(query, { status: null }),
    })
  }
  if (query.delivery) {
    chips.push({
      key: "delivery",
      label: dict.deliveryStatus[query.delivery],
      href: buildOrdersHref(query, { delivery: null }),
    })
  }
  if (query.range !== "all") {
    chips.push({
      key: "range",
      label: dict.dateRange[query.range],
      href: buildOrdersHref(query, { range: "all" }),
    })
  }
  if (query.city) {
    chips.push({
      key: "city",
      label: query.city,
      href: buildOrdersHref(query, { city: null }),
    })
  }
  if (query.price !== "all") {
    chips.push({
      key: "price",
      label: dict.priceBand[query.price],
      href: buildOrdersHref(query, { price: "all" }),
    })
  }
  if (query.tab !== "all") {
    chips.push({
      key: "tab",
      label: dict.pages.orders.tabs[query.tab],
      href: buildOrdersHref(query, { tab: "all" }),
    })
  }

  return chips
}

export function OrdersFilterChips({ query }: { query: OrdersQuery }) {
  const reduced = useReducedMotion()
  const { dict } = useI18n()
  const chips = chipsFor(query, dict)

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">
        {dict.common.activeFilters}
      </span>
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
        {dict.common.clearAll}
      </Button>
    </div>
  )
}
