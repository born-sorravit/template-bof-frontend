"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ORDER_TAB_META } from "@/lib/orders-display"
import { buildOrdersHref, ORDER_TAB_VALUES } from "@/lib/orders-query"
import type { OrderTab, OrdersQuery } from "@/lib/types/order"

export function OrdersTabs({
  query,
  counts,
}: {
  query: OrdersQuery
  counts: Record<OrderTab, number>
}) {
  return (
    <Tabs value={query.tab} className="w-full">
      <TabsList variant="line" className="w-full justify-start overflow-x-auto">
        {ORDER_TAB_VALUES.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex-none gap-2"
            render={<Link href={buildOrdersHref(query, { tab })} scroll={false} />}
            nativeButton={false}
          >
            {ORDER_TAB_META[tab].label}
            <Badge variant="secondary">{counts[tab]}</Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
