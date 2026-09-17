"use client"

import * as React from "react"
import { animate, useInView, useReducedMotion } from "motion/react"

export type CountFormat = "integer" | "currency" | "percent" | "delta"

/**
 * `format` is a string, not a function, because these counters are rendered
 * from server components and functions are not serializable across that
 * boundary.
 */
function formatValue(value: number, format: CountFormat) {
  switch (format) {
    case "currency":
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    case "percent":
      return `${value.toFixed(1)}%`
    // Signed, for period-over-period changes: "+12.4%" / "-3.2%".
    case "delta":
      return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
    case "integer":
      return Math.round(value).toLocaleString("en-US")
  }
}

/**
 * Counts from zero up to `value` the first time it scrolls into view.
 *
 * The final value is what gets server-rendered, so with JS blocked or slow the
 * real number is on screen — the animation is an enhancement, never the thing
 * standing between the reader and the data. (Same reasoning as the CSS
 * entrance animations in `app/globals.css`.)
 *
 * The tween writes `textContent` directly rather than driving React state:
 * that keeps 60 frames a second out of the reconciler, and avoids the
 * cascading-render pattern `react-hooks/set-state-in-effect` flags.
 */
export function CountUp({
  value,
  format = "integer",
  className,
  duration = 1.1,
}: {
  value: number
  format?: CountFormat
  className?: string
  duration?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()

  React.useEffect(() => {
    const el = ref.current
    if (!el || !inView || reduced) return

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current) => {
        el.textContent = formatValue(current, format)
      },
      // Guard against the tween settling a hair off the target.
      onComplete: () => {
        el.textContent = formatValue(value, format)
      },
    })

    return () => controls.stop()
  }, [inView, value, format, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {formatValue(value, format)}
    </span>
  )
}
