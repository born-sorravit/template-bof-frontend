import type { OrdersQuery } from "@/lib/types/order"

export type SavedFilter = {
  id: string
  name: string
  description: string
  /** Applied on top of the cleared query, so saved views are self-contained. */
  patch: Partial<OrdersQuery>
}

/**
 * Stand-in for per-user saved views. In a real app these would come from the
 * database keyed by user; the shape is deliberately just a query patch so
 * persisting them is a matter of storing JSON.
 */
export const SAVED_FILTERS: SavedFilter[] = [
  {
    id: "needs-attention",
    name: "Needs attention",
    description: "Rejected orders from the last 30 days",
    patch: { status: "rejected", range: "30d" },
  },
  {
    id: "unpaid-chasing",
    name: "Unpaid - chasing",
    description: "Unpaid, oldest first",
    patch: { status: "unpaid", sort: "createdAt", dir: "asc" },
  },
  {
    id: "ready-to-ship",
    name: "Ready to ship",
    description: "To ship, deadline soonest",
    patch: { status: "to-ship", sort: "deadline", dir: "asc" },
  },
  {
    id: "in-transit",
    name: "In transit",
    description: "Currently shipping",
    patch: { status: "shipping" },
  },
  {
    id: "high-value",
    name: "High value",
    description: "Over $1,000, most expensive first",
    patch: { price: "over-1000", sort: "price", dir: "desc" },
  },
  {
    id: "small-orders",
    name: "Small orders",
    description: "Under $100",
    patch: { price: "under-100", sort: "price", dir: "asc" },
  },
  {
    id: "this-week",
    name: "This week",
    description: "Created in the last 7 days",
    patch: { range: "7d" },
  },
  {
    id: "quarter-to-date",
    name: "Quarter to date",
    description: "Created in the last 90 days",
    patch: { range: "90d" },
  },
  {
    id: "returns-open",
    name: "Open returns",
    description: "Returns still in query",
    patch: { tab: "returns", delivery: "in-query" },
  },
  {
    id: "returns-rejected",
    name: "Rejected returns",
    description: "Returns whose delivery was rejected",
    patch: { tab: "returns", delivery: "rejected" },
  },
  {
    id: "pickups-pending",
    name: "Pickups pending",
    description: "Pickups awaiting the warehouse",
    patch: { tab: "pickups", status: "pending" },
  },
  {
    id: "lagos",
    name: "Lagos deliveries",
    description: "Everything going to Lagos",
    patch: { city: "Lagos" },
  },
  {
    id: "abuja",
    name: "Abuja deliveries",
    description: "Everything going to Abuja",
    patch: { city: "Abuja" },
  },
  {
    id: "drafts",
    name: "Delivery drafts",
    description: "Delivery not yet dispatched",
    patch: { delivery: "draft" },
  },
  {
    id: "settled",
    name: "Settled this month",
    description: "Paid in the last 30 days",
    patch: { status: "paid", range: "30d" },
  },
]
