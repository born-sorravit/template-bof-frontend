import type { Metadata } from "next"
import { ScrollTextIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
import { LEGAL_DOCUMENTS, LEGAL_STATE_META } from "@/lib/data/legal"
import { formatDate } from "@/lib/orders-display"
import { fill, getDictionary } from "@/lib/i18n"

export const metadata: Metadata = { title: "Legal documents" }

export default async function LegalPage() {
  const { dict } = await getDictionary()
  const t = dict.pages.legal
  const pendingReview = LEGAL_DOCUMENTS.filter(
    (d) => d.state === "review" || d.state === "draft"
  )

  return (
    <>
      <FadeIn>
        <PageHeader
          title={t.title}
          description={t.description}
        />
      </FadeIn>

      {pendingReview.length > 0 ? (
        <FadeIn>
          <Alert>
            <ScrollTextIcon />
            <AlertTitle>
              {fill(t.notLiveTitle, { count: pendingReview.length })}
            </AlertTitle>
            <AlertDescription>
              {fill(t.notLiveBody, {
                list: pendingReview
                  .map((d) => `${d.title} (${d.version})`)
                  .join(", "),
              })}
            </AlertDescription>
          </Alert>
        </FadeIn>
      ) : null}

      <FadeIn>
        <Card>
          <CardHead
            icon={ScrollTextIcon}
            title={t.register}
            description={fill(t.registerHint, { count: LEGAL_DOCUMENTS.length })}
          />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.document}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.owner}</TableHead>
                  <TableHead>{t.state}</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    {t.effectiveFrom}
                  </TableHead>
                  <TableHead className="w-44">{t.acceptance}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEGAL_DOCUMENTS.map((doc) => {
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {doc.title}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {doc.version}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {doc.owner}
                      </TableCell>
                      <TableCell>
                        <Badge variant={LEGAL_STATE_META[doc.state].variant}>
                          {dict.legalState[doc.state]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                        {formatDate(`${doc.effectiveFrom}T00:00:00.000Z`)}
                      </TableCell>
                      <TableCell>
                        {doc.acceptance > 0 ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {fill(t.accepted, { pct: doc.acceptance.toFixed(1) })}
                            </span>
                            <Progress value={doc.acceptance} />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {t.notCollecting}
                          </span>
                        )}
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
