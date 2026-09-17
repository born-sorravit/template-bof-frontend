import type {
  DateRangeKey,
  DeliveryStatus,
  OrderSortKey,
  OrderStatus,
  OrderTab,
  OrdersQuery,
  PriceBandKey,
  SortDirection,
} from "@/lib/types/order"

export type RawSearchParams = Record<string, string | string[] | undefined>

export const PER_PAGE_OPTIONS = [10, 20, 50] as const

export const ORDER_STATUS_VALUES = [
  "rejected",
  "completed",
  "pending",
  "to-ship",
  "shipping",
  "unpaid",
  "paid",
] as const satisfies readonly OrderStatus[]

export const DELIVERY_STATUS_VALUES = [
  "received",
  "draft",
  "rejected",
  "completed",
  "in-query",
] as const satisfies readonly DeliveryStatus[]

export const DATE_RANGE_VALUES = ["all", "7d", "30d", "90d", "12m"] as const

export const PRICE_BAND_VALUES = [
  "all",
  "under-100",
  "100-500",
  "500-1000",
  "over-1000",
] as const

export const ORDER_TAB_VALUES = ["all", "pickups", "returns"] as const
export const ORDER_SORT_VALUES = ["createdAt", "deadline", "price"] as const

export const DEFAULT_ORDERS_QUERY: OrdersQuery = {
  q: "",
  status: null,
  delivery: null,
  tab: "all",
  range: "all",
  city: null,
  price: "all",
  page: 1,
  perPage: 10,
  sort: "createdAt",
  dir: "desc",
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Coerces raw `searchParams` into a validated query. Unknown values fall back
 * to the defaults rather than throwing, so a hand-edited URL can never 500.
 */
export function parseOrdersQuery(params: RawSearchParams): OrdersQuery {
  const q = first(params.q)?.trim() ?? ""

  const rawStatus = first(params.status)
  const status = ORDER_STATUS_VALUES.includes(rawStatus as OrderStatus)
    ? (rawStatus as OrderStatus)
    : null

  const rawDelivery = first(params.delivery)
  const delivery = DELIVERY_STATUS_VALUES.includes(rawDelivery as DeliveryStatus)
    ? (rawDelivery as DeliveryStatus)
    : null

  const rawRange = first(params.range)
  const range = DATE_RANGE_VALUES.includes(rawRange as DateRangeKey)
    ? (rawRange as DateRangeKey)
    : DEFAULT_ORDERS_QUERY.range

  const rawPrice = first(params.price)
  const price = PRICE_BAND_VALUES.includes(rawPrice as PriceBandKey)
    ? (rawPrice as PriceBandKey)
    : DEFAULT_ORDERS_QUERY.price

  // Cities come from the dataset, so they cannot be whitelisted here without
  // importing server-only data. An unknown city simply matches nothing.
  const rawCity = first(params.city)?.trim()
  const city = rawCity ? rawCity : null

  const rawTab = first(params.tab)
  const tab = ORDER_TAB_VALUES.includes(rawTab as OrderTab)
    ? (rawTab as OrderTab)
    : DEFAULT_ORDERS_QUERY.tab

  const rawSort = first(params.sort)
  const sort = ORDER_SORT_VALUES.includes(rawSort as OrderSortKey)
    ? (rawSort as OrderSortKey)
    : DEFAULT_ORDERS_QUERY.sort

  const dir: SortDirection = first(params.dir) === "asc" ? "asc" : "desc"

  const parsedPerPage = Number(first(params.perPage))
  const perPage = PER_PAGE_OPTIONS.includes(
    parsedPerPage as (typeof PER_PAGE_OPTIONS)[number]
  )
    ? parsedPerPage
    : DEFAULT_ORDERS_QUERY.perPage

  const parsedPage = Number(first(params.page))
  const page =
    Number.isInteger(parsedPage) && parsedPage >= 1
      ? parsedPage
      : DEFAULT_ORDERS_QUERY.page

  return { q, status, delivery, tab, range, city, price, page, perPage, sort, dir }
}

/**
 * Builds an `/orders` href from a query plus a patch. Values equal to the
 * default are omitted, so the common case stays a clean `/orders`.
 *
 * Any patch other than `page` itself resets to page 1 — otherwise narrowing a
 * filter while on page 5 lands the user on an empty page.
 */
export function buildOrdersHref(
  current: OrdersQuery,
  patch: Partial<OrdersQuery> = {}
): string {
  const next: OrdersQuery = { ...current, ...patch }
  const onlyPageChanged = Object.keys(patch).length > 0 && "page" in patch
  if (!onlyPageChanged) next.page = 1

  const search = new URLSearchParams()
  if (next.q) search.set("q", next.q)
  if (next.status) search.set("status", next.status)
  if (next.delivery) search.set("delivery", next.delivery)
  if (next.city) search.set("city", next.city)
  if (next.range !== DEFAULT_ORDERS_QUERY.range) search.set("range", next.range)
  if (next.price !== DEFAULT_ORDERS_QUERY.price) search.set("price", next.price)
  if (next.tab !== DEFAULT_ORDERS_QUERY.tab) search.set("tab", next.tab)
  if (next.sort !== DEFAULT_ORDERS_QUERY.sort) search.set("sort", next.sort)
  if (next.dir !== DEFAULT_ORDERS_QUERY.dir) search.set("dir", next.dir)
  if (next.perPage !== DEFAULT_ORDERS_QUERY.perPage) {
    search.set("perPage", String(next.perPage))
  }
  if (next.page !== DEFAULT_ORDERS_QUERY.page) {
    search.set("page", String(next.page))
  }

  const qs = search.toString()
  return qs ? `/orders?${qs}` : "/orders"
}

/** True when anything is narrowing the result set. */
export function hasActiveFilters(query: OrdersQuery): boolean {
  return (
    query.q !== "" ||
    query.status !== null ||
    query.delivery !== null ||
    query.city !== null ||
    query.range !== "all" ||
    query.price !== "all" ||
    query.tab !== "all"
  )
}

/** Everything a "Clear all" should reset, leaving sort and per-page alone. */
export const CLEARED_FILTERS: Partial<OrdersQuery> = {
  q: "",
  status: null,
  delivery: null,
  city: null,
  range: "all",
  price: "all",
  tab: "all",
}

/** Toggles a sort column: same column flips direction, a new column starts desc. */
export function nextSortDirection(
  query: OrdersQuery,
  column: OrderSortKey
): SortDirection {
  if (query.sort !== column) return "desc"
  return query.dir === "desc" ? "asc" : "desc"
}
