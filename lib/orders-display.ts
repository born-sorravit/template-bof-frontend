import type { badgeVariants } from "@/components/ui/badge"
import type { VariantProps } from "class-variance-authority"
import type {
  DeliveryStatus,
  OrderSortKey,
  OrderStatus,
  OrderTab,
} from "@/lib/types/order"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

/**
 * Presentation lookups. Keeping these as maps (rather than switches inside
 * JSX) means a new status is a one-line change and TypeScript flags any
 * status that has no rendering.
 */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; variant: BadgeVariant }
> = {
  rejected: { label: "Rejected", variant: "danger" },
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  "to-ship": { label: "To ship", variant: "info" },
  shipping: { label: "Shipping", variant: "transit" },
  unpaid: { label: "Unpaid", variant: "neutral" },
  paid: { label: "Paid", variant: "settled" },
}

export const DELIVERY_STATUS_META: Record<
  DeliveryStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  received: {
    label: "Received",
    dotClass: "bg-status-info",
    textClass: "text-status-info",
  },
  draft: {
    label: "Draft",
    dotClass: "bg-status-neutral",
    textClass: "text-status-neutral",
  },
  rejected: {
    label: "Rejected",
    dotClass: "bg-status-danger",
    textClass: "text-status-danger",
  },
  completed: {
    label: "Completed",
    dotClass: "bg-status-success",
    textClass: "text-status-success",
  },
  "in-query": {
    label: "In Query",
    dotClass: "bg-status-warning",
    textClass: "text-status-warning",
  },
}

export const ORDER_TAB_META: Record<OrderTab, { label: string }> = {
  all: { label: "All orders" },
  pickups: { label: "Pickups" },
  returns: { label: "Returns" },
}

export const ORDER_SORT_META: Record<OrderSortKey, { label: string }> = {
  createdAt: { label: "Created date" },
  deadline: { label: "Deadline" },
  price: { label: "Price" },
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

const TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
})

const CURRENCY_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

/**
 * All formatting is pinned to UTC and en-US so the server render and the
 * client hydration agree regardless of the viewer's locale or timezone.
 */
export function formatDate(iso: string) {
  return DATE_FORMAT.format(new Date(iso))
}

export function formatTime(iso: string) {
  return TIME_FORMAT.format(new Date(iso))
}

export function formatPrice(value: number) {
  return CURRENCY_FORMAT.format(value)
}

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
