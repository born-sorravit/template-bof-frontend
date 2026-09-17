import type { Metadata } from "next"
import { UsersIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FadeIn } from "@/components/motion/fade-in"
import { CardHead } from "@/components/dashboard/card-head"
import { PageHeader } from "@/components/shell/page-header"
import { StatTiles } from "@/components/shell/stat-tiles"
import { CUSTOMER_TIER_META, getCustomers } from "@/lib/data/customers"
import { formatDate, formatPrice, initialsOf } from "@/lib/orders-display"

export const metadata: Metadata = { title: "Customers" }

export default async function CustomersPage() {
  const customers = await getCustomers()
  const spend = customers.reduce((sum, c) => sum + c.spend, 0)
  const vip = customers.filter((c) => c.tier === "vip").length

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Customers"
          description="Aggregated from the same 88 orders, so the totals reconcile with /orders."
        />
      </FadeIn>

      <StatTiles
        tiles={[
          { key: "total", label: "Customers", value: customers.length },
          { key: "spend", label: "Lifetime revenue", value: Math.round(spend), format: "currency" },
          { key: "vip", label: "VIP tier", value: vip, hint: "Spend of $8,000 or more" },
          {
            key: "aov",
            label: "Average per customer",
            value: Math.round(spend / Math.max(customers.length, 1)),
            format: "currency",
          },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={UsersIcon}
            title="All customers"
            description={`${customers.length} people have ordered at least once`}
          />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                    Last order
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const tier = CUSTOMER_TIER_META[customer.tier]
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>
                              {initialsOf(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">
                              {customer.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {customer.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {customer.city}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tier.variant}>{tier.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {customer.orders}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatPrice(customer.spend)}
                      </TableCell>
                      <TableCell className="hidden text-right whitespace-nowrap text-muted-foreground lg:table-cell">
                        {formatDate(customer.lastOrderAt)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </FadeIn>
    </>
  )
}
