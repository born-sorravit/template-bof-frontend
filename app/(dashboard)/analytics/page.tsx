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
import { getDictionary } from "@/lib/i18n"
import { getPayments } from "@/lib/data/payments"
import type { PaymentMethod } from "@/lib/data/payments"

export const metadata: Metadata = { title: "Analytics" }

export default async function AnalyticsPage() {
  const { dict } = await getDictionary()
  const t = dict.pages.analytics
  const [{ headline, revenueByCity, aovByMonth, deliveryMix }, payments] =
    await Promise.all([getAnalytics(), getPayments()])
  const deliveryTotal = deliveryMix.reduce((sum, s) => sum + s.value, 0)
  const deliverySlices = deliveryMix.map((slice) => ({
    ...slice,
    label:
      dict.deliveryStatus[slice.key as keyof typeof dict.deliveryStatus] ??
      slice.label,
  }))

  const methodOrder: PaymentMethod[] = ["card", "transfer", "cash", "wallet"]
  const methodMix = methodOrder
    .map((method) => ({
      key: method,
      label: dict.paymentMethod[method],
      value: payments.filter((p) => p.method === method).length,
    }))
    .filter((slice) => slice.value > 0)

  return (
    <>
      <FadeIn>
        <PageHeader
          title={t.title}
          description={t.description}
        />
      </FadeIn>

      {/* Aggregate labels come from the dictionary, keyed by what the data
          layer emits. */}
      <StatTiles
        tiles={headline.map((tile) => ({
          ...tile,
          label:
            ({
              revenue: t.revenue,
              aov: t.aov,
              cities: t.citiesServed,
              customers: t.uniqueCustomers,
            } as Record<string, string>)[tile.key] ?? tile.label,
        }))}
      />

      <Stagger className="grid gap-4 lg:grid-cols-2">
        <StaggerItem>
          <Card className="h-full">
            <CardHead
              icon={MapPinIcon}
              title={t.revenueByCity}
              description={t.revenueByCityHint}
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
              title={t.aovTitle}
              description={t.aovHint}
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
              title={t.deliveryMix}
              description={t.deliveryMixHint}
            />
            <CardContent>
              <DonutCard
                slices={deliverySlices}
                total={deliveryTotal}
                unit={dict.pages.dashboard.unitOrders}
              />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="h-full">
            <CardHead
              icon={CreditCardIcon}
              title={t.paymentMethods}
              description={t.paymentMethodsHint}
            />
            <CardContent>
              <DonutCard
                slices={methodMix}
                total={payments.length}
                unit={dict.pages.dashboard.unitPayments}
              />
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>
    </>
  )
}
