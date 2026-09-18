"use client"

import Link from "next/link"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeliveryStatus } from "@/components/orders/delivery-status"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { OrdersRowActions } from "@/components/orders/orders-row-actions"
import { formatDate, formatPrice, formatTime } from "@/lib/orders-display"
import { useI18n } from "@/components/i18n/locale-provider"
import { buildOrdersHref, nextSortDirection } from "@/lib/orders-query"
import type { Order, OrderSortKey, OrdersQuery } from "@/lib/types/order"

function SortHeader({
  column,
  query,
  className,
}: {
  column: OrderSortKey
  query: OrdersQuery
  className?: string
}) {
  const { dict } = useI18n()
  const label = {
    createdAt: dict.pages.orders.columns.created,
    deadline: dict.pages.orders.columns.deadline,
    price: dict.pages.orders.columns.price,
  }[column]
  const active = query.sort === column
  const Icon = !active
    ? ChevronsUpDownIcon
    : query.dir === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        aria-label={label}
        render={
          <Link
            href={buildOrdersHref(query, {
              sort: column,
              dir: nextSortDirection(query, column),
            })}
            scroll={false}
          />
        }
        nativeButton={false}
      >
        <Icon data-icon="inline-start" />
        {label}
      </Button>
    </TableHead>
  )
}

export function OrdersTable({
  rows,
  query,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: {
  rows: Order[]
  query: OrdersQuery
  selectedIds: Set<string>
  onToggleRow: (id: string, checked: boolean) => void
  onToggleAll: (checked: boolean) => void
}) {
  const { dict } = useI18n()
  const c = dict.pages.orders.columns
  const visibleSelected = rows.filter((row) => selectedIds.has(row.id)).length
  const allSelected = rows.length > 0 && visibleSelected === rows.length

  return (
    <div className="hidden rounded-2xl bg-muted/40 p-2 md:block">
      {/* `border-separate` is what lets a row render as a rounded card: in the
          collapsed-borders model a <tr> discards border-radius entirely. */}
      <Table className="border-separate border-spacing-y-1">
        <TableHeader>
          <TableRow className="hover:bg-transparent [&>th]:border-b">
            <TableHead className="w-10">
              <Checkbox
                aria-label={c.id}
                checked={allSelected}
                indeterminate={visibleSelected > 0 && !allSelected}
                onCheckedChange={(checked) => onToggleAll(Boolean(checked))}
              />
            </TableHead>
            <TableHead>{c.id}</TableHead>
            <TableHead>{c.product}</TableHead>
            <TableHead className="hidden lg:table-cell">{c.customer}</TableHead>
            <TableHead>{c.status}</TableHead>
            <TableHead className="hidden lg:table-cell">{c.delivery}</TableHead>
            <SortHeader
              column="createdAt"
              query={query}
              className="hidden xl:table-cell"
            />
            <SortHeader
              column="deadline"
              query={query}
              className="hidden xl:table-cell"
            />
            <SortHeader column="price" query={query} />
            <TableHead className="text-right">{c.actions}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((order) => {
            const selected = selectedIds.has(order.id)

            return (
              <TableRow
                key={order.id}
                variant="lifted"
                data-state={selected ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={order.id}
                    checked={selected}
                    onCheckedChange={(checked) =>
                      onToggleRow(order.id, Boolean(checked))
                    }
                  />
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {order.id}
                </TableCell>
                <TableCell className="max-w-56 font-medium">
                  <span className="block truncate">{order.product}</span>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {order.customer.name}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <DeliveryStatus status={order.deliveryStatus} />
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground xl:table-cell">
                  <span className="block">{formatDate(order.createdAt)}</span>
                  <span className="block text-xs">
                    {formatTime(order.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground xl:table-cell">
                  {formatDate(order.deadline)}
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatPrice(order.price)}
                </TableCell>
                <TableCell>
                  <OrdersRowActions order={order} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
