"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { buildOrdersHref, ORDER_TAB_VALUES } from "@/lib/orders-query"
import { useI18n } from "@/components/i18n/locale-provider"
import type { OrderTab, OrdersQuery } from "@/lib/types/order"

export function OrdersTabs({
  query,
  counts,
}: {
  query: OrdersQuery
  counts: Record<OrderTab, number>
}) {
  const { dict } = useI18n()

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
            {dict.pages.orders.tabs[tab]}
            <Badge variant="secondary">{counts[tab]}</Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
