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
import { getPayments, PAYMENT_STATE_META } from "@/lib/data/payments"
import { formatDate, formatPrice } from "@/lib/orders-display"
import { fill, getDictionary } from "@/lib/i18n"

export const metadata: Metadata = { title: "Payments" }

export default async function PaymentsPage() {
  const { dict } = await getDictionary()
  const t = dict.pages.payments
  const payments = await getPayments()
  const sum = (state: string) =>
    payments.filter((p) => p.state === state).reduce((s, p) => s + p.amount, 0)

  return (
    <>
      <FadeIn>
        <PageHeader
          title={t.title}
          description={t.description}
        />
      </FadeIn>

      <StatTiles
        tiles={[
          { key: "captured", label: t.captured, value: Math.round(sum("captured")), format: "currency" },
          { key: "pending", label: t.pending, value: Math.round(sum("pending")), format: "currency" },
          { key: "refunded", label: t.refunded, value: Math.round(sum("refunded")), format: "currency" },
          { key: "failed", label: t.failed, value: payments.filter((p) => p.state === "failed").length, hint: t.failedHint },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={CreditCardIcon}
            title={t.ledger}
            description={fill(t.ledgerHint, { count: payments.length })}
          />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.payment}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {dict.pages.customers.customer}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">{t.method}</TableHead>
                  <TableHead>{t.state}</TableHead>
                  <TableHead className="text-right">{t.amount}</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                    {t.date}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 30).map((payment) => {
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
                        {dict.paymentMethod[payment.method]}
                      </TableCell>
                      <TableCell>
                        <Badge variant={PAYMENT_STATE_META[payment.state].variant}>
                          {dict.paymentState[payment.state]}
                        </Badge>
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
