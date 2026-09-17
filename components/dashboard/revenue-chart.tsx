"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * A single series on `--chart-1`. The zinc chart ramp is a lightness scale, so
 * a categorical multi-series chart would be unreadable; one series keeps it
 * honest and legible in both themes.
 */
const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: { light: "var(--chart-1)", dark: "var(--chart-1)" },
  },
} satisfies ChartConfig

export function RevenueChart({
  data,
}: {
  data: Array<{ month: string; revenue: number }>
}) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          minTickGap={16}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={52}
          tickCount={5}
          tickFormatter={(value: number) =>
            value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`
          }
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="url(#revenue-fill)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
