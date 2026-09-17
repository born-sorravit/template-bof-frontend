export type MessageThread = {
  id: string
  customer: string
  initials: string
  subject: string
  preview: string
  /** Minutes ago, so the list is stable without a clock read at render. */
  minutesAgo: number
  unread: number
  channel: "email" | "chat" | "whatsapp"
}

export const MESSAGE_THREADS: MessageThread[] = [
  { id: "t-1", customer: "Ngozi Okafor", initials: "NO", subject: "Where is my DJI Mavic?", preview: "Hi, the tracking has not moved in three days. Could you check with the courier?", minutesAgo: 12, unread: 2, channel: "chat" },
  { id: "t-2", customer: "Tunde Bakare", initials: "TB", subject: "Refund for rejected order", preview: "The Macbook order was rejected but the payment still shows as pending on my card.", minutesAgo: 48, unread: 1, channel: "email" },
  { id: "t-3", customer: "Folake Bello", initials: "FB", subject: "Change delivery address", preview: "Can I move the Air Jordan delivery to my office in Ikoyi instead?", minutesAgo: 95, unread: 0, channel: "whatsapp" },
  { id: "t-4", customer: "Edwin Martins", initials: "EM", subject: "Invoice copy", preview: "Please send a PDF invoice for order 623-4534 for my expense claim.", minutesAgo: 240, unread: 0, channel: "email" },
  { id: "t-5", customer: "Oludayo Ayomide", initials: "OA", subject: "Bike frame size", preview: "Is the frame a 54cm? The listing does not say and I need it before I confirm.", minutesAgo: 420, unread: 0, channel: "chat" },
  { id: "t-6", customer: "Chiamaka Eze", initials: "CE", subject: "Bulk order enquiry", preview: "We would like 12 gaming chairs for a new office. Do you offer trade pricing?", minutesAgo: 1450, unread: 0, channel: "email" },
]

export const CHANNEL_META: Record<
  MessageThread["channel"],
  { label: string }
> = {
  email: { label: "Email" },
  chat: { label: "Live chat" },
  whatsapp: { label: "WhatsApp" },
}

/** Formats without reading the clock, so server and client agree. */
export function relativeFromMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
