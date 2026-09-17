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

export const metadata: Metadata = { title: "Legal documents" }

export default function LegalPage() {
  const pendingReview = LEGAL_DOCUMENTS.filter(
    (d) => d.state === "review" || d.state === "draft"
  )

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Legal documents"
          description="Versioned policies and the share of customers who accepted each one."
        />
      </FadeIn>

      {pendingReview.length > 0 ? (
        <FadeIn>
          <Alert>
            <ScrollTextIcon />
            <AlertTitle>
              {pendingReview.length} documents are not live yet
            </AlertTitle>
            <AlertDescription>
              {pendingReview.map((d) => `${d.title} (${d.version})`).join(", ")}{" "}
              still need sign-off before their effective date.
            </AlertDescription>
          </Alert>
        </FadeIn>
      ) : null}

      <FadeIn>
        <Card>
          <CardHead
            icon={ScrollTextIcon}
            title="Document register"
            description={`${LEGAL_DOCUMENTS.length} policies tracked`}
          />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead className="hidden md:table-cell">Owner</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Effective from
                  </TableHead>
                  <TableHead className="w-44">Acceptance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEGAL_DOCUMENTS.map((doc) => {
                  const state = LEGAL_STATE_META[doc.state]
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
                        <Badge variant={state.variant}>{state.label}</Badge>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                        {formatDate(`${doc.effectiveFrom}T00:00:00.000Z`)}
                      </TableCell>
                      <TableCell>
                        {doc.acceptance > 0 ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {doc.acceptance.toFixed(1)}% accepted
                            </span>
                            <Progress value={doc.acceptance} />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Not collecting yet
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
