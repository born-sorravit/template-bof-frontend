import type { Metadata } from "next"
import { LifeBuoyIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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
import { PRIORITY_META, TICKETS, TICKET_STATE_META } from "@/lib/data/support"
import { getDictionary } from "@/lib/i18n"

export const metadata: Metadata = { title: "Support" }

function hoursLabel(hours: number) {
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default async function SupportPage() {
  const { dict } = await getDictionary()
  const t = dict.pages.support
  const open = TICKETS.filter((t) => t.state === "open")
  const unassigned = TICKETS.filter((t) => t.assignee === null)
  const urgent = TICKETS.filter(
    (t) => t.priority === "urgent" && t.state !== "solved"
  )

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
          { key: "open", label: t.openTickets, value: open.length },
          { key: "urgent", label: t.urgent, value: urgent.length, hint: t.urgentHint },
          { key: "unassigned", label: t.unassigned, value: unassigned.length },
          { key: "solved", label: t.solvedWeek, value: TICKETS.filter((row) => row.state === "solved").length },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={LifeBuoyIcon}
            title={t.queue}
            description={t.queueHint}
          />
          <CardContent>
            {TICKETS.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <LifeBuoyIcon />
                  </EmptyMedia>
                  <EmptyTitle>{t.emptyTitle}</EmptyTitle>
                  <EmptyDescription>{t.emptyBody}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.ticket}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t.requester}
                    </TableHead>
                    <TableHead>{t.priority}</TableHead>
                    <TableHead>{t.state}</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      {t.assignee}
                    </TableHead>
                    <TableHead className="text-right">{t.updated}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TICKETS.map((ticket) => {
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="max-w-72">
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">
                              {ticket.subject}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {ticket.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {ticket.requester}
                        </TableCell>
                        <TableCell>
                          <Badge variant={PRIORITY_META[ticket.priority].variant}>
                            {dict.ticketPriority[ticket.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={TICKET_STATE_META[ticket.state].variant}>
                            {dict.ticketState[ticket.state]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {ticket.assignee ? (
                            <span className="text-muted-foreground">
                              {ticket.assignee}
                            </span>
                          ) : (
                            <Badge variant="warning">{t.unassigned}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-muted-foreground">
                          {hoursLabel(ticket.hoursAgo)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </>
  )
}
