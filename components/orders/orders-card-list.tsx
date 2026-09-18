"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DeliveryStatus } from "@/components/orders/delivery-status"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { OrdersRowActions } from "@/components/orders/orders-row-actions"
import { formatDate, formatPrice } from "@/lib/orders-display"
import { useI18n } from "@/components/i18n/locale-provider"
import type { Order } from "@/lib/types/order"

/**
 * Below `md` the nine-column table cannot shrink, so the same rows render as
 * one card per order. Both views are driven by the same `rows` prop and both
 * exist in the markup — the swap is CSS, so there is no hydration mismatch.
 */
export function OrdersCardList({
  rows,
  selectedIds,
  onToggleRow,
}: {
  rows: Order[]
  selectedIds: Set<string>
  onToggleRow: (id: string, checked: boolean) => void
}) {
  const { dict } = useI18n()
  const c = dict.pages.orders.columns

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {rows.map((order) => {
        const selected = selectedIds.has(order.id)

        return (
          <Card key={order.id} data-state={selected ? "selected" : undefined}>
            <CardHeader>
              <CardTitle className="text-base">
                <span className="line-clamp-2">{order.product}</span>
              </CardTitle>
              <CardDescription>
                {order.id} · {order.customer.name}
              </CardDescription>
              <CardAction>
                <Checkbox
                  aria-label={order.id}
                  checked={selected}
                  onCheckedChange={(checked) =>
                    onToggleRow(order.id, Boolean(checked))
                  }
                />
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={order.status} />
                <DeliveryStatus status={order.deliveryStatus} />
              </div>
              <Separator />
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">{c.created}</dt>
                  <dd>{formatDate(order.createdAt)}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">{c.deadline}</dt>
                  <dd>{formatDate(order.deadline)}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">{c.price}</dt>
                  <dd className="font-medium tabular-nums">
                    {formatPrice(order.price)}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">{c.channel}</dt>
                  <dd>{dict.orderChannel[order.channel]}</dd>
                </div>
              </dl>
            </CardContent>

            <CardFooter>
              <OrdersRowActions order={order} />
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
