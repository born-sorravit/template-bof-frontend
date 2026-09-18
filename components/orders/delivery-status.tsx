"use client"

import { cn } from "@/lib/utils"
import { useI18n } from "@/components/i18n/locale-provider"
import { DELIVERY_STATUS_META } from "@/lib/orders-display"
import type { DeliveryStatus as DeliveryStatusValue } from "@/lib/types/order"

export function DeliveryStatus({
  status,
  className,
}: {
  status: DeliveryStatusValue
  className?: string
}) {
  const { dict } = useI18n()
  const meta = DELIVERY_STATUS_META[status]

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", meta.dotClass)}
      />
      <span className={meta.textClass}>{dict.deliveryStatus[status]}</span>
    </span>
  )
}
