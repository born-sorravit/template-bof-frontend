import type {
  DateRangeKey,
  DeliveryStatus,
  Order,
  OrderAddress,
  OrderChannel,
  OrderStatus,
  OrderTab,
  PriceBandKey,
  OrdersQuery,
  OrdersResult,
} from "@/lib/types/order"

/**
 * The single seam between the UI and a real backend.
 *
 * Everything below builds an in-memory fixture and filters/sorts/pages it.
 * To move to a real API, reimplement `getOrders`, `getOrder` and
 * `getDashboardStats` — no component needs to change.
 */

/**
 * Deterministic PRNG (mulberry32). A fixed seed keeps the fixture identical
 * between the server render and the client hydration; `Math.random()` here
 * would desync the two and throw hydration errors.
 */
function createRandom(seed: number) {
  let a = seed
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PRODUCTS = [
  "Brand New Bike, Local buyer only",
  "Macbook Pro 16 inch (2021) For Sale",
  "Lego Star'War edition",
  "DJI Mavic Pro 2",
  "Heimer Miller Sofa (Mint Condition)",
  "Gaming Chair, local pickup only",
  "Playstation 5 Limited Edition (+ games)",
  "Coach Tabby 26 for sale",
  "Gopro hero 7 (with receipt)",
  "Air Jordan 1 Top 3 Sneaker (DS)",
  "Sony A7 III body only",
  "Herman Miller Aeron, size B",
  "iPad Pro 12.9 M2 with Pencil",
  "Vintage Omega Seamaster 1968",
  "Dyson V15 Detect Absolute",
  "Nintendo Switch OLED + 3 games",
  "Bose QC Ultra headphones",
  "Specialized Allez road bike",
  "Kindle Oasis, like new",
  "Technics SL-1200MK7 turntable",
  "Le Creuset dutch oven 5.5qt",
  "Fujifilm X100V, boxed",
  "Peloton Bike+ with shoes",
  "Yeti Tundra 45 cooler",
]

const CUSTOMERS = [
  "Oludayo Ayomide",
  "Edwin Martins",
  "Hellen Jummy",
  "Adekunle Fisayo",
  "Mbah Jacob",
  "Hellena John",
  "James Friday",
  "David Oshodi",
  "Adeleke Peter",
  "Ngozi Okafor",
  "Tunde Bakare",
  "Chiamaka Eze",
  "Samuel Adeyemi",
  "Grace Umeh",
  "Ibrahim Yusuf",
  "Folake Bello",
]

const ADDRESSES: OrderAddress[] = [
  { line1: "12 Awolowo Rd, Ikoyi", city: "Lagos" },
  { line1: "44 Aminu Kano Cres, Wuse II", city: "Abuja" },
  { line1: "8 Zik Ave, Uwani", city: "Enugu" },
  { line1: "301 Ring Rd", city: "Ibadan" },
  { line1: "17 Ahmadu Bello Way", city: "Kaduna" },
  { line1: "5 Trans Amadi Rd", city: "Port Harcourt" },
]

/** Every city present in the fixture, for the Address filter. */
export const ORDER_CITIES = ADDRESSES.map((a) => a.city)

const STATUSES: OrderStatus[] = [
  "rejected",
  "completed",
  "pending",
  "to-ship",
  "shipping",
  "unpaid",
  "paid",
]

const DELIVERY_STATUSES: DeliveryStatus[] = [
  "received",
  "draft",
  "rejected",
  "completed",
  "in-query",
]

function emailFor(name: string) {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`
}

function timelineFor(createdAt: string, status: OrderStatus): Order["timeline"] {
  const created = new Date(createdAt)
  const step = (days: number, label: string, note?: string) => ({
    at: new Date(created.getTime() + days * 86_400_000).toISOString(),
    label,
    note,
  })

  const events: Order["timeline"] = [
    step(0, "Order placed", "Customer completed checkout."),
    step(1, "Payment authorised"),
  ]

  if (status === "rejected") {
    events.push(step(2, "Rejected", "Address could not be verified."))
    return events
  }
  if (status === "unpaid") {
    return [events[0], step(1, "Awaiting payment")]
  }
  if (status === "pending") {
    events.push(step(2, "Awaiting warehouse confirmation"))
    return events
  }
  if (status === "to-ship") {
    events.push(step(2, "Picked and packed"))
    return events
  }
  if (status === "shipping") {
    events.push(step(2, "Picked and packed"), step(3, "Handed to courier"))
    return events
  }

  events.push(
    step(2, "Picked and packed"),
    step(3, "Handed to courier"),
    step(5, status === "paid" ? "Settled" : "Delivered")
  )
  return events
}

/**
 * The first ten rows mirror the reference design's products, customers,
 * statuses and prices. Their dates are expressed as offsets from
 * `DATA_ANCHOR` rather than the reference's literal 2021 dates, so they stay
 * inside the relative date windows.
 */
type ReferenceSeed = {
  id: string
  product: string
  customer: string
  status: OrderStatus
  deliveryStatus: DeliveryStatus
  /** Days before the anchor that the order was created. */
  daysAgo: number
  /** Days after creation that it is due. */
  dueInDays: number
  price: number
  channel: OrderChannel
}

type Seed = {
  id: string
  product: string
  customer: string
  status: OrderStatus
  deliveryStatus: DeliveryStatus
  createdAt: string
  deadline: string
  price: number
  channel: OrderChannel
}

const REFERENCE_ROWS: ReferenceSeed[] = [
{ id: "998-5878", product: PRODUCTS[0], customer: CUSTOMERS[0], status: "rejected", deliveryStatus: "received", daysAgo: 2, dueInDays: 9, price: 17.84, channel: "pickups" },
  { id: "623-4534", product: PRODUCTS[1], customer: CUSTOMERS[1], status: "completed", deliveryStatus: "received", daysAgo: 5, dueInDays: 21, price: 6.48, channel: "pickups" },
  { id: "998-5879", product: PRODUCTS[2], customer: CUSTOMERS[2], status: "pending", deliveryStatus: "draft", daysAgo: 9, dueInDays: 14, price: 11.7, channel: "returns" },
  { id: "395-9823", product: PRODUCTS[3], customer: CUSTOMERS[3], status: "to-ship", deliveryStatus: "received", daysAgo: 13, dueInDays: 30, price: 5.22, channel: "pickups" },
  { id: "398-5783", product: PRODUCTS[4], customer: CUSTOMERS[4], status: "completed", deliveryStatus: "completed", daysAgo: 18, dueInDays: 11, price: 14.81, channel: "pickups" },
  { id: "395-9824", product: PRODUCTS[5], customer: CUSTOMERS[5], status: "shipping", deliveryStatus: "rejected", daysAgo: 22, dueInDays: 26, price: 5.22, channel: "returns" },
  { id: "395-9825", product: PRODUCTS[6], customer: CUSTOMERS[6], status: "unpaid", deliveryStatus: "draft", daysAgo: 27, dueInDays: 18, price: 8.99, channel: "pickups" },
  { id: "234-5343", product: PRODUCTS[7], customer: CUSTOMERS[7], status: "rejected", deliveryStatus: "completed", daysAgo: 33, dueInDays: 12, price: 14.81, channel: "returns" },
  { id: "684-8735", product: PRODUCTS[8], customer: CUSTOMERS[2], status: "unpaid", deliveryStatus: "in-query", daysAgo: 41, dueInDays: 23, price: 8.99, channel: "pickups" },
  { id: "654-3245", product: PRODUCTS[9], customer: CUSTOMERS[8], status: "paid", deliveryStatus: "rejected", daysAgo: 54, dueInDays: 16, price: 11.7, channel: "returns" },
]

const TOTAL_ORDERS = 88
const RETURNS_TARGET = 27

/**
 * Start of today, UTC, resolved once when this module loads.
 *
 * The fixture's dates are generated backwards from here so the relative date
 * filters have something to match -- a fixture pinned to 2021 would make
 * "Last 7 days" return zero rows and read as a broken filter. `getOrders`
 * measures its windows from the same anchor, so the two never disagree.
 *
 * This module is only ever imported by server components, so reading the clock
 * at module scope cannot desync a client render.
 */
export const DATA_ANCHOR = (() => {
  const now = new Date()
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
})()

const DAY_MS = 86_400_000

/** Spread across the last ~11 months, densest in the most recent weeks. */
function createdAtFor(index: number, random: () => number): string {
  // Biased toward today so the short date windows stay populated, but not so
  // hard that a dozen orders pile onto the anchor day.
  const roll = random() ** 1.8
  const daysAgo = Math.floor(roll * 330)
  const minutes = Math.floor(random() * 1440)
  return new Date(DATA_ANCHOR - daysAgo * DAY_MS + minutes * 60_000).toISOString()
}

function buildOrders(): Order[] {
  const random = createRandom(20_210_313)
  const seeds: Seed[] = REFERENCE_ROWS.map((row) => {
    const created = DATA_ANCHOR - row.daysAgo * DAY_MS + 8 * 3_600_000
    return {
      id: row.id,
      product: row.product,
      customer: row.customer,
      status: row.status,
      deliveryStatus: row.deliveryStatus,
      createdAt: new Date(created).toISOString(),
      deadline: new Date(created + row.dueInDays * DAY_MS).toISOString(),
      price: row.price,
      channel: row.channel,
    }
  })
  const usedIds = new Set(seeds.map((s) => s.id))

  while (seeds.length < TOTAL_ORDERS) {
    let id = ""
    do {
      const a = 100 + Math.floor(random() * 900)
      const b = 1000 + Math.floor(random() * 9000)
      id = `${a}-${b}`
    } while (usedIds.has(id))
    usedIds.add(id)

    const created = new Date(createdAtFor(seeds.length, random))
    const deadline = new Date(
      created.getTime() + (3 + Math.floor(random() * 90)) * DAY_MS
    )

    seeds.push({
      id,
      product: PRODUCTS[Math.floor(random() * PRODUCTS.length)],
      customer: CUSTOMERS[Math.floor(random() * CUSTOMERS.length)],
      status: STATUSES[Math.floor(random() * STATUSES.length)],
      deliveryStatus:
        DELIVERY_STATUSES[Math.floor(random() * DELIVERY_STATUSES.length)],
      createdAt: created.toISOString(),
      deadline: deadline.toISOString(),
      price: Math.round((4 + random() * 1996) * 100) / 100,
      // Assign channels so the tab counts land on exactly 61 / 27,
      // matching the reference design.
      channel:
        seeds.filter((s) => s.channel === "returns").length < RETURNS_TARGET &&
        random() < 0.45
          ? "returns"
          : "pickups",
    })
  }

  // Top up "returns" from the tail if the random walk under-filled it.
  let returns = seeds.filter((s) => s.channel === "returns").length
  for (let i = seeds.length - 1; i >= 0 && returns < RETURNS_TARGET; i--) {
    if (seeds[i].channel === "pickups") {
      seeds[i].channel = "returns"
      returns++
    }
  }

  return seeds.map((seed) => {
    const random2 = createRandom(
      seed.id.split("-").reduce((acc, part) => acc + Number(part), 0)
    )
    const itemCount = 1 + Math.floor(random2() * 3)
    const names = [seed.product]
    while (names.length < itemCount) {
      const candidate = PRODUCTS[Math.floor(random2() * PRODUCTS.length)]
      if (!names.includes(candidate)) names.push(candidate)
    }
    // Split `seed.price` across the line items so the detail page's subtotal
    // equals the order total exactly. Done in integer cents: distributing a
    // float and then rounding reintroduces a one-cent drift. The final line
    // has qty 1 so it can absorb the remainder on its own unit price.
    const priceCents = Math.round(seed.price * 100)
    const quantities = names.map((_, index) =>
      index === names.length - 1 ? 1 : 1 + Math.floor(random2() * 3)
    )
    const leadingUnits = quantities
      .slice(0, -1)
      .reduce((sum, qty) => sum + qty, 0)
    const perUnitCents = Math.floor(priceCents / (leadingUnits + 1))
    const lastCents = priceCents - perUnitCents * leadingUnits

    const items = names.map((name, index) => ({
      name,
      qty: quantities[index],
      unitPrice:
        (index === names.length - 1 ? lastCents : perUnitCents) / 100,
    }))

    return {
      id: seed.id,
      product: seed.product,
      customer: { name: seed.customer, email: emailFor(seed.customer) },
      status: seed.status,
      deliveryStatus: seed.deliveryStatus,
      createdAt: seed.createdAt,
      deadline: seed.deadline,
      price: seed.price,
      channel: seed.channel,
      address: ADDRESSES[Math.floor(random2() * ADDRESSES.length)],
      items,
      timeline: timelineFor(seed.createdAt, seed.status),
    } satisfies Order
  })
}

const ORDERS = buildOrders()

function matchesQuery(order: Order, q: string) {
  if (!q) return true
  const needle = q.toLowerCase()
  return (
    order.id.toLowerCase().includes(needle) ||
    order.product.toLowerCase().includes(needle) ||
    order.customer.name.toLowerCase().includes(needle) ||
    order.customer.email.toLowerCase().includes(needle) ||
    order.address.line1.toLowerCase().includes(needle) ||
    order.address.city.toLowerCase().includes(needle)
  )
}

const RANGE_DAYS: Record<Exclude<DateRangeKey, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "12m": 365,
}

function matchesRange(order: Order, range: DateRangeKey) {
  if (range === "all") return true
  const cutoff = DATA_ANCHOR - (RANGE_DAYS[range] - 1) * DAY_MS
  return new Date(order.createdAt).getTime() >= cutoff
}

const PRICE_BANDS: Record<
  Exclude<PriceBandKey, "all">,
  { min: number; max: number }
> = {
  "under-100": { min: 0, max: 100 },
  "100-500": { min: 100, max: 500 },
  "500-1000": { min: 500, max: 1000 },
  "over-1000": { min: 1000, max: Number.POSITIVE_INFINITY },
}

function matchesPrice(order: Order, band: PriceBandKey) {
  if (band === "all") return true
  const { min, max } = PRICE_BANDS[band]
  return order.price >= min && order.price < max
}

function compare(a: Order, b: Order, query: OrdersQuery) {
  const factor = query.dir === "asc" ? 1 : -1
  if (query.sort === "price") return (a.price - b.price) * factor
  const left = new Date(a[query.sort]).getTime()
  const right = new Date(b[query.sort]).getTime()
  return (left - right) * factor
}

export async function getOrders(query: OrdersQuery): Promise<OrdersResult> {
  const searched = ORDERS.filter(
    (order) =>
      matchesQuery(order, query.q) &&
      (query.status === null || order.status === query.status) &&
      (query.delivery === null || order.deliveryStatus === query.delivery) &&
      (query.city === null || order.address.city === query.city) &&
      matchesRange(order, query.range) &&
      matchesPrice(order, query.price)
  )

  // Counts describe what each tab would show under the *other* active filters,
  // so switching tabs never lands on a number the user did not expect.
  const counts: Record<OrderTab, number> = {
    all: searched.length,
    pickups: searched.filter((o) => o.channel === "pickups").length,
    returns: searched.filter((o) => o.channel === "returns").length,
  }

  const filtered = searched.filter(
    (order) => query.tab === "all" || order.channel === query.tab
  )

  const sorted = [...filtered].sort((a, b) => compare(a, b, query))

  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / query.perPage))
  const page = Math.min(query.page, pageCount)
  const start = (page - 1) * query.perPage
  const rows = sorted.slice(start, start + query.perPage)

  return {
    rows,
    total,
    page,
    perPage: query.perPage,
    pageCount,
    from: total === 0 ? 0 : start + 1,
    to: total === 0 ? 0 : start + rows.length,
    counts,
  }
}

/**
 * The whole fixture, for pages that derive their own view of it (customers,
 * payments, inventory). Keeping those derived rather than independently
 * randomised means every page in the template agrees on the same 88 orders.
 */
export async function getAllOrders(): Promise<Order[]> {
  return ORDERS
}

/** Cuts that the dashboard does not already show. */
export async function getAnalytics(): Promise<AnalyticsStats> {
  const cities = [...new Set(ORDERS.map((o) => o.address.city))]
  const revenueByCity = cities
    .map((city) => ({
      city,
      revenue: Math.round(
        ORDERS.filter((o) => o.address.city === city).reduce(
          (sum, o) => sum + o.price,
          0
        )
      ),
    }))
    .sort((a, b) => b.revenue - a.revenue)

  const anchor = new Date(DATA_ANCHOR)
  const months = Array.from({ length: 12 }, (_, offset) => {
    const d = new Date(
      Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - 11 + offset, 1)
    )
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
  })

  const aovByMonth = months.map(({ year, month }) => {
    const rows = ORDERS.filter((o) => {
      const d = new Date(o.createdAt)
      return d.getUTCFullYear() === year && d.getUTCMonth() === month
    })
    return {
      month: MONTHS[month],
      aov: rows.length
        ? Math.round(rows.reduce((sum, o) => sum + o.price, 0) / rows.length)
        : 0,
    }
  })

  const deliveryMix: DonutSlice[] = DELIVERY_STATUSES.map((status) => ({
    key: status,
    label: status
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
    value: ORDERS.filter((o) => o.deliveryStatus === status).length,
  })).filter((slice) => slice.value > 0)

  const revenue = ORDERS.reduce((sum, o) => sum + o.price, 0)

  return {
    revenueByCity,
    aovByMonth,
    deliveryMix,
    headline: [
      { key: "revenue", label: "Revenue", value: Math.round(revenue), format: "currency" },
      { key: "aov", label: "Average order value", value: Math.round(revenue / ORDERS.length), format: "currency" },
      { key: "cities", label: "Cities served", value: cities.length, format: "integer" },
      { key: "customers", label: "Unique customers", value: new Set(ORDERS.map((o) => o.customer.name)).size, format: "integer" },
    ],
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  return ORDERS.find((order) => order.id === id) ?? null
}

export type DashboardTile = {
  key: string
  label: string
  /** Numeric so the UI can animate it; formatting is the component's job. */
  value: number
  format: "integer" | "currency"
  deltaPct: number
}

export type StatusBreakdownRow = {
  status: OrderStatus
  count: number
  /** Share of all orders, 0-100. */
  share: number
  value: number
}

export type AnalyticsStats = {
  revenueByCity: Array<{ city: string; revenue: number }>
  aovByMonth: Array<{ month: string; aov: number }>
  deliveryMix: DonutSlice[]
  headline: Array<{ key: string; label: string; value: number; format: "integer" | "currency" }>
}

export type DonutSlice = {
  key: string
  label: string
  value: number
}

export type TopProduct = {
  rank: number
  name: string
  orders: number
  revenue: number
}

export type DashboardStats = {
  tiles: DashboardTile[]
  revenueSeries: Array<{ month: string; revenue: number }>
  ordersByMonth: Array<{ month: string; orders: number }>
  recentOrders: Order[]
  statusBreakdown: StatusBreakdownRow[]
  channelSplit: DonutSlice[]
  paymentSplit: DonutSlice[]
  topProducts: TopProduct[]
  fulfilment: Array<{ key: string; label: string; value: number }>
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export async function getDashboardStats(): Promise<DashboardStats> {
  const revenue = ORDERS.reduce((sum, order) => sum + order.price, 0)
  const completed = ORDERS.filter((o) => o.status === "completed").length
  const unpaid = ORDERS.filter((o) => o.status === "unpaid").length

  // The 12 months ending with the anchor month, in chronological order.
  const anchor = new Date(DATA_ANCHOR)
  const buckets = Array.from({ length: 12 }, (_, offset) => {
    const d = new Date(
      Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - 11 + offset, 1)
    )
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
  })

  const revenueSeries = buckets.map(({ year, month }) => ({
    month: MONTHS[month],
    revenue: Math.round(
      ORDERS.filter((o) => {
        const d = new Date(o.createdAt)
        return d.getUTCFullYear() === year && d.getUTCMonth() === month
      }).reduce((sum, o) => sum + o.price, 0)
    ),
  }))

  const recentOrders = [...ORDERS]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6)

  const statusBreakdown: StatusBreakdownRow[] = STATUSES.map((status) => {
    const rows = ORDERS.filter((o) => o.status === status)
    return {
      status,
      count: rows.length,
      share: Math.round((rows.length / ORDERS.length) * 1000) / 10,
      value: Math.round(rows.reduce((sum, o) => sum + o.price, 0)),
    }
  }).sort((a, b) => b.count - a.count)

  const channelSplit: DonutSlice[] = [
    {
      key: "pickups",
      label: "Pickups",
      value: ORDERS.filter((o) => o.channel === "pickups").length,
    },
    {
      key: "returns",
      label: "Returns",
      value: ORDERS.filter((o) => o.channel === "returns").length,
    },
  ]

  const settled = ORDERS.filter((o) =>
    ["paid", "completed"].includes(o.status)
  ).length
  const awaiting = ORDERS.filter((o) =>
    ["unpaid", "pending", "to-ship", "shipping"].includes(o.status)
  ).length
  const paymentSplit: DonutSlice[] = [
    { key: "settled", label: "Settled", value: settled },
    { key: "awaiting", label: "Awaiting", value: awaiting },
    {
      key: "rejected",
      label: "Rejected",
      value: ORDERS.filter((o) => o.status === "rejected").length,
    },
  ]

  const byProduct = new Map<string, { orders: number; revenue: number }>()
  for (const order of ORDERS) {
    const row = byProduct.get(order.product) ?? { orders: 0, revenue: 0 }
    row.orders += 1
    row.revenue += order.price
    byProduct.set(order.product, row)
  }
  const topProducts: TopProduct[] = [...byProduct.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([name, row], index) => ({
      rank: index + 1,
      name,
      orders: row.orders,
      revenue: Math.round(row.revenue),
    }))

  const ordersByMonth = buckets.map(({ year, month }) => ({
    month: MONTHS[month],
    orders: ORDERS.filter((o) => {
      const d = new Date(o.createdAt)
      return d.getUTCFullYear() === year && d.getUTCMonth() === month
    }).length,
  }))

  const dueSoon = ORDERS.filter((o) => {
    const due = new Date(o.deadline).getTime()
    return due >= DATA_ANCHOR && due <= DATA_ANCHOR + 7 * DAY_MS
  }).length

  const fulfilment = [
    { key: "to-ship", label: "To ship", value: ORDERS.filter((o) => o.status === "to-ship").length },
    { key: "shipping", label: "In transit", value: ORDERS.filter((o) => o.status === "shipping").length },
    { key: "in-query", label: "In query", value: ORDERS.filter((o) => o.deliveryStatus === "in-query").length },
    { key: "due", label: "Due in 7 days", value: dueSoon },
  ]

  return {
    tiles: [
      {
        key: "revenue",
        label: "Total revenue",
        value: Math.round(revenue),
        format: "currency",
        deltaPct: 12.4,
      },
      {
        key: "orders",
        label: "Orders",
        value: ORDERS.length,
        format: "integer",
        deltaPct: 4.1,
      },
      {
        key: "completed",
        label: "Completed",
        value: completed,
        format: "integer",
        deltaPct: 8.6,
      },
      {
        key: "unpaid",
        label: "Unpaid",
        value: unpaid,
        format: "integer",
        deltaPct: -3.2,
      },
    ],
    revenueSeries,
    ordersByMonth,
    recentOrders,
    statusBreakdown,
    channelSplit,
    paymentSplit,
    topProducts,
    fulfilment,
  }
}
