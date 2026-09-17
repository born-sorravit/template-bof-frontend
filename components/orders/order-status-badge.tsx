import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_META } from "@/lib/orders-display"
import type { OrderStatus } from "@/lib/types/order"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}
