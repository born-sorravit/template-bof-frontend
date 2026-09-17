"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  aov: {
    label: "Avg order value",
    theme: { light: "var(--chart-4)", dark: "var(--chart-4)" },
  },
} satisfies ChartConfig

export function AovChart({
  data,
}: {
  data: Array<{ month: string; aov: number }>
}) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
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
          width={44}
          tickFormatter={(v: number) => `$${v}`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {/* 2px line, >=8px markers, per the mark spec. */}
        <Line
          dataKey="aov"
          type="monotone"
          stroke="var(--color-aov)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
