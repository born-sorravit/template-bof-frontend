"use client"

import Link from "next/link"
import {
  CopyIcon,
  EllipsisVerticalIcon,
  PrinterIcon,
  ReceiptTextIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { useI18n } from "@/components/i18n/locale-provider"
import type { Order } from "@/lib/types/order"

export function OrdersRowActions({ order }: { order: Order }) {
  const { dict } = useI18n()

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        render={<Link href={`/orders/${order.id}`} />}
        nativeButton={false}
      >
        {dict.common.manage}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" />}
          aria-label={`Actions for order ${order.id}`}
        >
          <span className="hidden sm:inline">{dict.common.actions}</span>
          <EllipsisVerticalIcon data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                void navigator.clipboard?.writeText(order.id)
                toast.add({ title: order.id, description: dict.common.mockAction })
              }}
            >
              <CopyIcon />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`/orders/${order.id}`} />}>
              <ReceiptTextIcon />
              View invoice
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toast.add({ title: order.id, description: dict.common.mockAction })
              }
            >
              <TruckIcon />
              Track shipment
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toast.add({
                  title: dict.common.print,
                  description: dict.common.mockAction,
                })
              }
            >
              <PrinterIcon />
              Print packing slip
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                toast.add({
                  title: order.id,
                  description: dict.common.mockAction,
                })
              }
            >
              <XCircleIcon />
              Cancel order
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
