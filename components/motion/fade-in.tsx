import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Entrance animations, implemented in CSS (see `.entrance-*` in
 * `app/globals.css`) rather than with motion.dev.
 *
 * The reason is load-bearing: a motion.dev entrance needs `initial={{ opacity:
 * 0 }}`, which means the server sends every section invisible and only
 * hydration reveals it. That ships a blank page to anyone whose JS is slow or
 * blocked. A CSS keyframe animates *from* transparent toward the element's
 * natural state, so the resting state is visible and the worst case is
 * "no animation", never "no content".
 *
 * These are plain server components — no `"use client"`, no JS shipped.
 * motion.dev handles the interaction-driven animations instead, where JS is
 * running by definition: `orders-filter-chips.tsx` and `orders-bulk-bar.tsx`.
 */

export function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("entrance-rise min-w-0", className)}>{children}</div>
  )
}

/** Staggers its direct children. Wrap each one in `StaggerItem`. */
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("entrance-stagger min-w-0", className)}>{children}</div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("min-w-0", className)}>{children}</div>
}
