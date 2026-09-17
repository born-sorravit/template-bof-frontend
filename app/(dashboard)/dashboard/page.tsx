import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PageHeader } from "@/components/shell/page-header"
import { getDashboardStats } from "@/lib/data/orders"
import { formatDate, formatPrice } from "@/lib/orders-display"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const { tiles, revenueSeries, recentOrders } = await getDashboardStats()

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Dashboard"
          description="Everything on this page reads from the mock dataset in lib/data/orders.ts."
          actions={
            <Button
              render={<Link href="/orders" />}
              nativeButton={false}
            >
              View orders
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          }
        />
      </FadeIn>

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => {
          const up = tile.deltaPct >= 0
          return (
            <StaggerItem key={tile.key}>
              <Card>
                <CardHeader>
                  <CardDescription>{tile.label}</CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {tile.value}
                  </CardTitle>
                  <CardAction>
                    <Badge variant={up ? "success" : "danger"}>
                      {up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      {up ? "+" : ""}
                      {tile.deltaPct}%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter>
                  <span className="text-xs text-muted-foreground">
                    Compared with the previous period
                  </span>
                </CardFooter>
              </Card>
            </StaggerItem>
          )
        })}
      </Stagger>

      <Stagger className="grid gap-4 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by month</CardTitle>
              <CardDescription>
                Summed from every order created in 2021
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={revenueSeries} />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle>Recent orders</CardTitle>
              <CardDescription>The six most recently created</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="max-w-32">
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
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                render={<Link href="/orders" />}
                nativeButton={false}
              >
                All orders
              </Button>
            </CardFooter>
          </Card>
        </StaggerItem>
      </Stagger>
    </>
  )
}
