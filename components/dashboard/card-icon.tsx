import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The small rounded tile that prefixes every dashboard card title. Uses the
 * muted surface rather than an accent so it never competes with the chart
 * colours inside the card.
 */
export function CardIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground",
        className
      )}
    >
      <Icon className="size-4.5" />
    </span>
  )
}
