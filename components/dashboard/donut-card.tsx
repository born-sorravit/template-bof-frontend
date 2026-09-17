"use client"

import * as React from "react"
import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CountUp } from "@/components/motion/count-up"
import type { DonutSlice } from "@/lib/data/orders"

/**
 * Part-to-whole with a hero total in the hole, plus a legend list.
 *
 * Identity is never colour-alone: every slice is named in the legend with its
 * value, which is also the secondary encoding the categorical palette's CVD
 * band requires. Slices are assigned chart-1..n in fixed order, never cycled.
 */
export function DonutCard({
  slices,
  total,
  unit,
}: {
  slices: DonutSlice[]
  total: number
  unit: string
}) {
  const config = React.useMemo(() => {
    const entries: ChartConfig = {}
    slices.forEach((slice, index) => {
      const token = `var(--chart-${index + 1})`
      entries[slice.key] = {
        label: slice.label,
        theme: { light: token, dark: token },
      }
    })
    return entries
  }, [slices])

  return (
    <div className="flex flex-col gap-4">
      {/* The hole's total is HTML, not a recharts <Label>: recharts 3 renders
          no Label element for a Pie child, and plain text also means real font
          tokens and a shared CountUp. `pointer-events-none` keeps the slices
          hoverable through it. */}
      <div className="relative mx-auto w-full max-w-56">
        <ChartContainer config={config} className="h-44 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="key"
              innerRadius="64%"
              outerRadius="94%"
              // 2px of surface between segments, per the mark spec.
              paddingAngle={2}
              strokeWidth={0}
            >
              {slices.map((slice) => (
                <Cell key={slice.key} fill={`var(--color-${slice.key})`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <CountUp
            value={total}
            className="text-2xl font-semibold tabular-nums"
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {slices.map((slice, index) => (
          <li key={slice.key} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: `var(--chart-${index + 1})` }}
            />
            <span className="truncate text-muted-foreground">{slice.label}</span>
            <CountUp
              value={slice.value}
              className="ml-auto font-medium tabular-nums"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
