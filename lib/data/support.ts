export type TicketPriority = "urgent" | "high" | "normal" | "low"
export type TicketState = "open" | "pending" | "solved"

export type Ticket = {
  id: string
  subject: string
  requester: string
  priority: TicketPriority
  state: TicketState
  /** Hours since last update. */
  hoursAgo: number
  assignee: string | null
}

export const TICKETS: Ticket[] = [
  { id: "SUP-1042", subject: "Courier marked delivered but nothing arrived", requester: "Ngozi Okafor", priority: "urgent", state: "open", hoursAgo: 1, assignee: "Amara Nwosu" },
  { id: "SUP-1041", subject: "Card charged twice for order 776-8330", requester: "Mbah Jacob", priority: "urgent", state: "open", hoursAgo: 3, assignee: null },
  { id: "SUP-1038", subject: "Cannot download invoice PDF", requester: "Edwin Martins", priority: "normal", state: "pending", hoursAgo: 9, assignee: "Amara Nwosu" },
  { id: "SUP-1036", subject: "Wrong colour variant shipped", requester: "Folake Bello", priority: "high", state: "open", hoursAgo: 14, assignee: "Samuel Adeyemi" },
  { id: "SUP-1031", subject: "Request trade pricing for 12 units", requester: "Chiamaka Eze", priority: "low", state: "pending", hoursAgo: 28, assignee: "Samuel Adeyemi" },
  { id: "SUP-1024", subject: "Returned item not refunded yet", requester: "David Oshodi", priority: "high", state: "solved", hoursAgo: 52, assignee: "Amara Nwosu" },
  { id: "SUP-1019", subject: "Update billing address on account", requester: "Grace Umeh", priority: "low", state: "solved", hoursAgo: 96, assignee: "Grace Umeh" },
]

export const PRIORITY_META: Record<
  TicketPriority,
  { label: string; variant: "danger" | "warning" | "info" | "neutral" }
> = {
  urgent: { label: "Urgent", variant: "danger" },
  high: { label: "High", variant: "warning" },
  normal: { label: "Normal", variant: "info" },
  low: { label: "Low", variant: "neutral" },
}

export const TICKET_STATE_META: Record<
  TicketState,
  { label: string; variant: "warning" | "info" | "success" }
> = {
  open: { label: "Open", variant: "warning" },
  pending: { label: "Pending", variant: "info" },
  solved: { label: "Solved", variant: "success" },
}
