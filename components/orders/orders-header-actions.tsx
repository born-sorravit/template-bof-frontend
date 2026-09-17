"use client"

import {
  ExternalLinkIcon,
  PlusIcon,
  PrinterIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { CreateOrderDialog } from "@/components/orders/create-order-dialog"

export function OrdersHeaderActions() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Export queued",
            description: "A CSV of the current filters would be emailed to you.",
          })
        }
      >
        Export
        <ExternalLinkIcon data-icon="inline-end" />
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.add({ title: "Sent to printer" })}
      >
        <PrinterIcon data-icon="inline-start" />
        Print
      </Button>
      <CreateOrderDialog
        trigger={
          <Button>
            <PlusIcon data-icon="inline-start" />
            Create order
          </Button>
        }
      />
    </>
  )
}
