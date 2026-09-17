import type { Metadata } from "next"
import {
  CreditCardIcon,
  MapPinIcon,
  TrendingUpIcon,
  TruckIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { AovChart } from "@/components/dashboard/aov-chart"
import { CardHead } from "@/components/dashboard/card-head"
import { CityBarChart } from "@/components/dashboard/city-bar-chart"
import { DonutCard } from "@/components/dashboard/donut-card"
import { PageHeader } from "@/components/shell/page-header"
import { StatTiles } from "@/components/shell/stat-tiles"
import { getAnalytics } from "@/lib/data/orders"
import { getPayments, PAYMENT_METHOD_META } from "@/lib/data/payments"
import type { PaymentMethod } from "@/lib/data/payments"

export const metadata: Metadata = { title: "Analytics" }

export default async function AnalyticsPage() {
  const [{ headline, revenueByCity, aovByMonth, deliveryMix }, payments] =
    await Promise.all([getAnalytics(), getPayments()])
  const deliveryTotal = deliveryMix.reduce((sum, s) => sum + s.value, 0)

  const methodOrder: PaymentMethod[] = ["card", "transfer", "cash", "wallet"]
  const methodMix = methodOrder
    .map((method) => ({
      key: method,
      label: PAYMENT_METHOD_META[method].label,
      value: payments.filter((p) => p.method === method).length,
    }))
    .filter((slice) => slice.value > 0)

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Analytics"
          description="Cuts the dashboard does not cover: geography, order value and delivery mix."
        />
      </FadeIn>

      <StatTiles tiles={headline} />

      <Stagger className="grid gap-4 lg:grid-cols-2">
        <StaggerItem>
          <Card className="h-full">
            <CardHead
              icon={MapPinIcon}
              title="Revenue by city"
              description="All-time, highest first"
            />
            <CardContent>
              <CityBarChart data={revenueByCity} />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="h-full">
            <CardHead
              icon={TrendingUpIcon}
              title="Average order value"
              description="Monthly mean over the last 12 months"
            />
            <CardContent>
              <AovChart data={aovByMonth} />
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>

      <Stagger className="grid gap-4 lg:grid-cols-2">
        <StaggerItem>
          <Card className="h-full">
            <CardHead
              icon={TruckIcon}
              title="Delivery mix"
              description="Where every order sits with the courier"
            />
            <CardContent>
              <DonutCard
                slices={deliveryMix}
                total={deliveryTotal}
                unit="orders"
              />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="h-full">
            <CardHead
              icon={CreditCardIcon}
              title="Payment methods"
              description="How customers paid across all orders"
            />
            <CardContent>
              <DonutCard
                slices={methodMix}
                total={payments.length}
                unit="payments"
              />
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>
    </>
  )
}
