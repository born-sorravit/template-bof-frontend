import type { Metadata } from "next"
import { MessageSquareIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemActions,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { FadeIn } from "@/components/motion/fade-in"
import { CardHead } from "@/components/dashboard/card-head"
import { PageHeader } from "@/components/shell/page-header"
import { StatTiles } from "@/components/shell/stat-tiles"
import {
  CHANNEL_META,
  MESSAGE_THREADS,
  relativeFromMinutes,
} from "@/lib/data/messages"
import { Fragment } from "react"

export const metadata: Metadata = { title: "Messages" }

export default function MessagesPage() {
  const unread = MESSAGE_THREADS.reduce((sum, t) => sum + t.unread, 0)
  const waiting = MESSAGE_THREADS.filter((t) => t.unread > 0).length

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Messages"
          description="Customer conversations across every channel."
        />
      </FadeIn>

      <StatTiles
        tiles={[
          { key: "threads", label: "Open threads", value: MESSAGE_THREADS.length },
          { key: "unread", label: "Unread messages", value: unread },
          { key: "waiting", label: "Awaiting reply", value: waiting },
          { key: "median", label: "Median first reply", value: 24, hint: "Minutes, last 7 days" },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={MessageSquareIcon}
            title="Inbox"
            description="Newest activity first"
          />
          <CardContent>
            <ItemGroup>
              {MESSAGE_THREADS.map((thread, index) => (
                <Fragment key={thread.id}>
                  {index > 0 ? <ItemSeparator /> : null}
                  <Item>
                    <ItemMedia>
                      <Avatar className="size-9">
                        <AvatarFallback>{thread.initials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        {thread.subject}
                        {thread.unread > 0 ? (
                          <Badge variant="info">{thread.unread} new</Badge>
                        ) : null}
                      </ItemTitle>
                      <ItemDescription>
                        {thread.customer} · {thread.preview}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex-col items-end gap-1">
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {relativeFromMinutes(thread.minutesAgo)}
                      </span>
                      <Badge variant="outline">
                        {CHANNEL_META[thread.channel].label}
                      </Badge>
                    </ItemActions>
                  </Item>
                </Fragment>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </FadeIn>
    </>
  )
}
