import type { LucideIcon } from "lucide-react"
import type * as React from "react"

import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardIcon } from "@/components/dashboard/card-icon"

/**
 * Icon tile beside the title, with the description under it.
 *
 * `CardHeader` is a grid that stacks its direct children, so the icon and the
 * text block are nested in a flex row instead of being siblings -- otherwise
 * the tile lands on its own row above the title.
 */
export function CardHead({
  icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <CardIcon icon={icon} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
      </div>
      {action ? <CardAction>{action}</CardAction> : null}
    </CardHeader>
  )
}
