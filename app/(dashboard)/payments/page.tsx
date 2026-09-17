import type { Metadata } from "next"
import Link from "next/link"
import { CreditCardIcon } from "lucide-react"

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
import {
  getPayments,
  PAYMENT_METHOD_META,
  PAYMENT_STATE_META,
} from "@/lib/data/payments"
import { formatDate, formatPrice } from "@/lib/orders-display"

export const metadata: Metadata = { title: "Payments" }

export default async function PaymentsPage() {
  const payments = await getPayments()
  const sum = (state: string) =>
    payments.filter((p) => p.state === state).reduce((s, p) => s + p.amount, 0)

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Payments"
          description="One payment per order. State follows the order's own status."
        />
      </FadeIn>

      <StatTiles
        tiles={[
          { key: "captured", label: "Captured", value: Math.round(sum("captured")), format: "currency" },
          { key: "pending", label: "Pending", value: Math.round(sum("pending")), format: "currency" },
          { key: "refunded", label: "Refunded", value: Math.round(sum("refunded")), format: "currency" },
          { key: "failed", label: "Failed", value: payments.filter((p) => p.state === "failed").length, hint: "Needs a retry or a call" },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={CreditCardIcon}
            title="Payment ledger"
            description={`${payments.length} payments, newest first`}
          />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Method</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 30).map((payment) => {
                  const state = PAYMENT_STATE_META[payment.state]
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-muted-foreground">
                            {payment.id}
                          </span>
                          <Link
                            href={`/orders/${payment.orderId}`}
                            className="font-medium tabular-nums hover:underline"
                          >
                            {payment.orderId}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {payment.customer}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {PAYMENT_METHOD_META[payment.method].label}
                      </TableCell>
                      <TableCell>
                        <Badge variant={state.variant}>{state.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatPrice(payment.amount)}
                      </TableCell>
                      <TableCell className="hidden text-right whitespace-nowrap text-muted-foreground lg:table-cell">
                        {formatDate(payment.createdAt)}
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
