import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  BoxesIcon,
  ChartColumnIcon,
  CreditCardIcon,
  LayersIcon,
  ReceiptTextIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
  TruckIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CountUp } from "@/components/motion/count-up"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { CardHead } from "@/components/dashboard/card-head"
import { DonutCard } from "@/components/dashboard/donut-card"
import { OrdersBarChart } from "@/components/dashboard/orders-bar-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PageHeader } from "@/components/shell/page-header"
import { getDashboardStats } from "@/lib/data/orders"
import { ORDER_STATUS_META, formatDate, formatPrice } from "@/lib/orders-display"
import { getDictionary } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Dashboard",
}

/** Every card fills its grid row, so no row leaves a void under a short card. */
const CARD = "h-full"

export default async function DashboardPage() {
  const { dict } = await getDictionary()
  const t = dict.pages.dashboard
  const {
    tiles,
    revenueSeries,
    ordersByMonth,
    recentOrders,
    statusBreakdown,
    channelSplit,
    paymentSplit,
    topProducts,
    fulfilment,
  } = await getDashboardStats()

  const totalOrders = channelSplit.reduce((sum, s) => sum + s.value, 0)
  const maxStatus = Math.max(...statusBreakdown.map((r) => r.count), 1)

  // Slice labels are produced by the data layer in English; the dictionary owns
  // what the reader actually sees.
  const LABELS: Record<string, string> = {
    revenue: t.totalRevenue,
    orders: t.orders,
    completed: t.completed,
    unpaid: t.unpaid,
    pickups: t.pickups,
    returns: t.returns,
    settled: t.settled,
    awaiting: t.awaiting,
    rejected: t.rejected,
    "to-ship": t.toShip,
    shipping: t.inTransit,
    "in-query": t.inQuery,
    due: t.dueInSevenDays,
  }
  const relabel = <T extends { key: string; label: string }>(rows: T[]) =>
    rows.map((row) => ({ ...row, label: LABELS[row.key] ?? row.label }))

  return (
    <>
      <FadeIn>
        <PageHeader
          title={t.title}
          description={t.description}
          actions={
            <Button render={<Link href="/orders" />} nativeButton={false}>
              {dict.common.viewOrders}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          }
        />
      </FadeIn>

      {/* Row 1 — headline numbers. The first tile carries the brand accent. */}
      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile, index) => {
          const up = tile.deltaPct >= 0
          const featured = index === 0

          return (
            <StaggerItem key={tile.key}>
              <Card
                className={
                  featured
                    ? `${CARD} border-transparent bg-linear-to-br from-chart-1 to-chart-1/70 text-primary-foreground`
                    : CARD
                }
              >
                <CardHeader>
                  <CardDescription
                    className={featured ? "text-primary-foreground/80" : undefined}
                  >
                    {LABELS[tile.key] ?? tile.label}
                  </CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    <CountUp value={tile.value} format={tile.format} />
                  </CardTitle>
                  <CardAction>
                    <Badge
                      variant={
                        featured ? "outline" : up ? "success" : "danger"
                      }
                      className={
                        featured
                          ? "border-primary-foreground/30 text-primary-foreground"
                          : undefined
                      }
                    >
                      {up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      <CountUp value={tile.deltaPct} format="delta" duration={0.9} />
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter
                  className={featured ? "bg-transparent border-t-0" : undefined}
                >
                  <span
                    className={
                      featured
                        ? "text-xs text-primary-foreground/75"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {t.comparedWith}
                  </span>
                </CardFooter>
              </Card>
            </StaggerItem>
          )
        })}
      </Stagger>

      {/* Row 2 — revenue trend beside the channel split. */}
      <Stagger className="grid gap-4 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <Card className={CARD}>
            <CardHead
              icon={ChartColumnIcon}
              title={t.revenueByMonth}
              description={t.revenueByMonthHint}
            />
            <CardContent>
              <RevenueChart data={revenueSeries} />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className={CARD}>
            <CardHead
              icon={BoxesIcon}
              title={t.ordersByChannel}
              description={t.ordersByChannelHint}
            />
            <CardContent>
              <DonutCard
                slices={relabel(channelSplit)}
                total={totalOrders}
                unit={t.unitOrders}
              />
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>

      {/* Row 3 — three equal cards. */}
      <Stagger className="grid gap-4 lg:grid-cols-3">
        <StaggerItem>
          <Card className={CARD}>
            <CardHead
              icon={ReceiptTextIcon}
              title={t.ordersPerMonth}
              description={t.ordersPerMonthHint}
            />
            <CardContent>
              <OrdersBarChart data={ordersByMonth} />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className={CARD}>
            <CardHead
              icon={CreditCardIcon}
              title={t.paymentState}
              description={t.paymentStateHint}
            />
            <CardContent>
              <DonutCard
                slices={relabel(paymentSplit)}
                total={totalOrders}
                unit={t.unitOrders}
              />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className={CARD}>
            <CardHead
              icon={TruckIcon}
              title={t.fulfilment}
              description={t.fulfilmentHint}
            />
            <CardContent className="flex flex-1 flex-col">
              <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3">
                {fulfilment.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col gap-1 rounded-xl bg-muted/50 p-3"
                  >
                    <CountUp
                      value={item.value}
                      className="text-2xl font-semibold tabular-nums"
                    />
                    <span className="text-xs text-muted-foreground">
                      {LABELS[item.key] ?? item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>

      {/* Row 4 — the recent table beside the product ranking. */}
      <Stagger className="grid gap-4 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <Card className={CARD}>
            <CardHead
              icon={LayersIcon}
              title={t.recentOrders}
              description={t.recentOrdersHint}
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/orders" />}
                  nativeButton={false}
                >
                  {dict.common.allOrders}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              }
            />
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dict.pages.orders.columns.product}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {dict.pages.orders.columns.customer}
                    </TableHead>
                    <TableHead>{dict.pages.orders.columns.status}</TableHead>
                    <TableHead className="text-right">
                      {dict.pages.orders.columns.price}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="max-w-44">
                        <Link
                          href={`/orders/${order.id}`}
                          className="block truncate font-medium hover:underline"
                        >
                          {order.product}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {order.customer.name}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatPrice(order.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className={CARD}>
            <CardHead
              icon={TrophyIcon}
              title={t.topProducts}
              description={t.topProductsHint}
            />
            <CardContent className="flex flex-1 flex-col">
              <ol className="flex flex-1 flex-col justify-between gap-3">
                {topProducts.map((product) => (
                  <li key={product.name} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium tabular-nums">
                      {product.rank}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.orders} {t.unitOrders}
                      </span>
                    </span>
                    <CountUp
                      value={product.revenue}
                      format="currency"
                      className="ml-auto text-sm font-medium tabular-nums"
                    />
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>

      {/* Row 5 — the full status distribution. Seven categories, so bars. */}
      <FadeIn>
        <Card>
          <CardHead
            icon={ChartColumnIcon}
            title={t.breakdown}
            description={`${totalOrders} ${t.unitOrders}`}
          />
          <CardContent>
            <Separator className="mb-4" />
            <ul className="grid gap-4 md:grid-cols-2">
              {statusBreakdown.map((row) => {
                const meta = ORDER_STATUS_META[row.status]
                return (
                  <li key={row.status} className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={meta.variant}>
                          {dict.orderStatus[row.status]}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          <CountUp value={row.share} format="percent" />{" "}
                          {t.ofOrders}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <CountUp
                          value={row.value}
                          format="currency"
                          className="text-sm text-muted-foreground tabular-nums"
                        />
                        <CountUp
                          value={row.count}
                          className="text-lg font-semibold tabular-nums"
                        />
                      </div>
                    </div>
                    <Progress value={(row.count / maxStatus) * 100} />
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      </FadeIn>
    </>
  )
}
