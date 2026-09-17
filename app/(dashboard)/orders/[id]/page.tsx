import { Fragment } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, MapPinIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { DeliveryStatus } from "@/components/orders/delivery-status"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PageHeader } from "@/components/shell/page-header"
import { getOrder } from "@/lib/data/orders"
import {
  formatDate,
  formatPrice,
  formatTime,
  initialsOf,
} from "@/lib/orders-display"

export async function generateMetadata({
  params,
}: PageProps<"/orders/[id]">): Promise<Metadata> {
  const { id } = await params
  const order = await getOrder(id)
  return { title: order ? `Order ${order.id}` : "Order not found" }
}

export default async function OrderDetailPage({
  params,
}: PageProps<"/orders/[id]">) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) notFound()

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  )

  return (
    <>
      <FadeIn>
        <PageHeader
          title={`Order ${order.id}`}
          description={order.product}
          actions={
            <Button
              variant="outline"
              render={<Link href="/orders" />}
              nativeButton={false}
            >
              <ArrowLeftIcon data-icon="inline-start" />
              Back to orders
            </Button>
          }
        />
      </FadeIn>

      <Stagger className="grid gap-4 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Line items</CardTitle>
              <CardDescription>
                {order.items.length} item{order.items.length === 1 ? "" : "s"} in
                this order
              </CardDescription>
              <CardAction>
                <OrderStatusBadge status={order.status} />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={`${item.name}-${index}`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.qty}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatPrice(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatPrice(item.qty * item.unitPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </CardFooter>
          </Card>
        </StaggerItem>

        <StaggerItem className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{initialsOf(order.customer.name)}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="font-medium">{order.customer.name}</span>
                <span className="truncate text-sm text-muted-foreground">
                  {order.customer.email}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              <Separator />
              <span className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                {order.address.line1}, {order.address.city}
              </span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>
                    <DeliveryStatus status={order.deliveryStatus} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Channel</dt>
                  <dd className="capitalize">{order.channel}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>
                    {formatDate(order.createdAt)} {formatTime(order.createdAt)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Deadline</dt>
                  <dd>{formatDate(order.deadline)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-medium tabular-nums">
                    {formatPrice(order.price)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>
                Everything recorded against this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                {order.timeline.map((event, index) => (
                  <Fragment key={`${event.at}-${index}`}>
                    {index > 0 ? <ItemSeparator /> : null}
                    <Item>
                      <ItemContent>
                        <ItemTitle>{event.label}</ItemTitle>
                        <ItemDescription>
                          {formatDate(event.at)} {formatTime(event.at)}
                          {event.note ? ` — ${event.note}` : ""}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </Fragment>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>
    </>
  )
}
