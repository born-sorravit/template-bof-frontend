"use client"

import {
  ExternalLinkIcon,
  PlusIcon,
  PrinterIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { CreateOrderDialog } from "@/components/orders/create-order-dialog"
import { useI18n } from "@/components/i18n/locale-provider"

export function OrdersHeaderActions() {
  const { dict } = useI18n()

  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: dict.common.export,
            description: dict.common.mockAction,
          })
        }
      >
        {dict.common.export}
        <ExternalLinkIcon data-icon="inline-end" />
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ title: dict.common.print, description: dict.common.mockAction })
        }
      >
        <PrinterIcon data-icon="inline-start" />
        {dict.common.print}
      </Button>
      <CreateOrderDialog
        trigger={
          <Button>
            <PlusIcon data-icon="inline-start" />
            {dict.pages.orders.createOrder}
          </Button>
        }
      />
    </>
  )
}
