"use client"

import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/i18n/locale-provider"
import { ORDER_STATUS_META } from "@/lib/orders-display"
import type { OrderStatus } from "@/lib/types/order"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { dict } = useI18n()
  // The map keeps the colour; the label comes from the dictionary.
  return (
    <Badge variant={ORDER_STATUS_META[status].variant}>
      {dict.orderStatus[status]}
    </Badge>
  )
}
