export type OrderStatus =
  | "rejected"
  | "completed"
  | "pending"
  | "to-ship"
  | "shipping"
  | "unpaid"
  | "paid"

export type DeliveryStatus =
  | "received"
  | "draft"
  | "rejected"
  | "completed"
  | "in-query"

/** Every order belongs to exactly one channel. */
export type OrderChannel = "pickups" | "returns"

/** The Orders tabs: "all" is the union of both channels. */
export type OrderTab = "all" | OrderChannel

export type OrderLineItem = {
  name: string
  qty: number
  unitPrice: number
}

export type OrderEvent = {
  at: string
  label: string
  note?: string
}

export type Order = {
  /** Display id, e.g. "998-5878". Unique across the fixture. */
  id: string
  product: string
  customer: {
    name: string
    email: string
  }
  status: OrderStatus
  deliveryStatus: DeliveryStatus
  /** ISO 8601 */
  createdAt: string
  /** ISO 8601 */
  deadline: string
  price: number
  channel: OrderChannel
  address: string
  items: OrderLineItem[]
  timeline: OrderEvent[]
}

export type OrderSortKey = "createdAt" | "deadline" | "price"
export type SortDirection = "asc" | "desc"

export type OrdersQuery = {
  q: string
  status: OrderStatus | null
  tab: OrderTab
  page: number
  perPage: number
  sort: OrderSortKey
  dir: SortDirection
}

export type OrdersResult = {
  rows: Order[]
  total: number
  page: number
  perPage: number
  pageCount: number
  /** 1-based index of the first row on this page, or 0 when empty. */
  from: number
  /** 1-based index of the last row on this page, or 0 when empty. */
  to: number
  counts: Record<OrderTab, number>
}
