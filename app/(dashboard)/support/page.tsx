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

export const metadata: Metadata = { title: "Support" }

function hoursLabel(hours: number) {
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function SupportPage() {
  const open = TICKETS.filter((t) => t.state === "open")
  const unassigned = TICKETS.filter((t) => t.assignee === null)
  const urgent = TICKETS.filter(
    (t) => t.priority === "urgent" && t.state !== "solved"
  )

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Support"
          description="Tickets raised against orders, deliveries and accounts."
        />
      </FadeIn>

      <StatTiles
        tiles={[
          { key: "open", label: "Open tickets", value: open.length },
          { key: "urgent", label: "Urgent", value: urgent.length, hint: "Breach risk within 4 hours" },
          { key: "unassigned", label: "Unassigned", value: unassigned.length },
          { key: "solved", label: "Solved this week", value: TICKETS.filter((t) => t.state === "solved").length },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={LifeBuoyIcon}
            title="Ticket queue"
            description="Sorted by most recent activity"
          />
          <CardContent>
            {TICKETS.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <LifeBuoyIcon />
                  </EmptyMedia>
                  <EmptyTitle>Nothing in the queue</EmptyTitle>
                  <EmptyDescription>
                    New tickets will appear here as customers write in.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Requester
                    </TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Assignee
                    </TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TICKETS.map((ticket) => {
                    const priority = PRIORITY_META[ticket.priority]
                    const state = TICKET_STATE_META[ticket.state]
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
                          <Badge variant={priority.variant}>
                            {priority.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={state.variant}>{state.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {ticket.assignee ? (
                            <span className="text-muted-foreground">
                              {ticket.assignee}
                            </span>
                          ) : (
                            <Badge variant="warning">Unassigned</Badge>
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
