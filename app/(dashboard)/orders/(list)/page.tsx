import type { Metadata } from "next"

import { FadeIn } from "@/components/motion/fade-in"
import { OrdersHeaderActions } from "@/components/orders/orders-header-actions"
import { OrdersView } from "@/components/orders/orders-view"
import { PageHeader } from "@/components/shell/page-header"
import { getOrders } from "@/lib/data/orders"
import { parseOrdersQuery } from "@/lib/orders-query"

export const metadata: Metadata = {
  title: "Orders",
}

export default async function OrdersPage({
  searchParams,
}: PageProps<"/orders">) {
  // In Next 16 `searchParams` is a Promise.
  const query = parseOrdersQuery(await searchParams)
  const result = await getOrders(query)

  return (
    <>
      <FadeIn>
        <PageHeader title="Orders" actions={<OrdersHeaderActions />} />
      </FadeIn>
      <OrdersView query={query} result={result} />
    </>
  )
}
