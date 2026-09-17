import type {
  DeliveryStatus,
  Order,
  OrderChannel,
  OrderStatus,
  OrderTab,
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

const CITIES = [
  "12 Awolowo Rd, Ikoyi, Lagos",
  "44 Aminu Kano Cres, Wuse II, Abuja",
  "8 Zik Ave, Uwani, Enugu",
  "301 Ring Rd, Ibadan, Oyo",
  "17 Ahmadu Bello Way, Kaduna",
  "5 Trans Amadi Rd, Port Harcourt",
]

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

/** The first ten rows mirror the reference design exactly. */
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

const REFERENCE_ROWS: Seed[] = [
  { id: "998-5878", product: PRODUCTS[0], customer: CUSTOMERS[0], status: "rejected", deliveryStatus: "received", createdAt: "2021-03-13T08:05:00.000Z", deadline: "2021-01-01T00:00:00.000Z", price: 17.84, channel: "pickups" },
  { id: "623-4534", product: PRODUCTS[1], customer: CUSTOMERS[1], status: "completed", deliveryStatus: "received", createdAt: "2021-09-04T00:14:00.000Z", deadline: "2021-08-18T00:00:00.000Z", price: 6.48, channel: "pickups" },
  { id: "998-5879", product: PRODUCTS[2], customer: CUSTOMERS[2], status: "pending", deliveryStatus: "draft", createdAt: "2021-01-11T13:49:00.000Z", deadline: "2021-08-03T00:00:00.000Z", price: 11.7, channel: "returns" },
  { id: "395-9823", product: PRODUCTS[3], customer: CUSTOMERS[3], status: "to-ship", deliveryStatus: "received", createdAt: "2021-08-03T00:10:00.000Z", deadline: "2021-02-21T00:00:00.000Z", price: 5.22, channel: "pickups" },
  { id: "398-5783", product: PRODUCTS[4], customer: CUSTOMERS[4], status: "completed", deliveryStatus: "completed", createdAt: "2021-10-13T08:05:00.000Z", deadline: "2021-01-11T00:00:00.000Z", price: 14.81, channel: "pickups" },
  { id: "395-9824", product: PRODUCTS[5], customer: CUSTOMERS[5], status: "shipping", deliveryStatus: "rejected", createdAt: "2021-11-04T00:13:00.000Z", deadline: "2021-10-13T00:00:00.000Z", price: 5.22, channel: "returns" },
  { id: "395-9825", product: PRODUCTS[6], customer: CUSTOMERS[6], status: "unpaid", deliveryStatus: "draft", createdAt: "2021-02-21T15:05:00.000Z", deadline: "2021-03-13T00:00:00.000Z", price: 8.99, channel: "pickups" },
  { id: "234-5343", product: PRODUCTS[7], customer: CUSTOMERS[7], status: "rejected", deliveryStatus: "completed", createdAt: "2021-08-18T16:12:00.000Z", deadline: "2021-09-04T00:00:00.000Z", price: 14.81, channel: "returns" },
  { id: "684-8735", product: PRODUCTS[8], customer: CUSTOMERS[2], status: "unpaid", deliveryStatus: "in-query", createdAt: "2021-02-21T15:05:00.000Z", deadline: "2021-02-21T00:00:00.000Z", price: 8.99, channel: "pickups" },
  { id: "654-3245", product: PRODUCTS[9], customer: CUSTOMERS[8], status: "paid", deliveryStatus: "rejected", createdAt: "2021-01-01T13:49:00.000Z", deadline: "2021-11-04T00:00:00.000Z", price: 11.7, channel: "returns" },
]

const TOTAL_ORDERS = 88
const RETURNS_TARGET = 27

function buildOrders(): Order[] {
  const random = createRandom(20_210_313)
  const seeds: Seed[] = [...REFERENCE_ROWS]
  const usedIds = new Set(seeds.map((s) => s.id))

  while (seeds.length < TOTAL_ORDERS) {
    let id = ""
    do {
      const a = 100 + Math.floor(random() * 900)
      const b = 1000 + Math.floor(random() * 9000)
      id = `${a}-${b}`
    } while (usedIds.has(id))
    usedIds.add(id)

    const created = new Date(
      Date.UTC(
        2021,
        Math.floor(random() * 12),
        1 + Math.floor(random() * 28),
        Math.floor(random() * 24),
        Math.floor(random() * 60)
      )
    )
    const deadline = new Date(
      created.getTime() + (3 + Math.floor(random() * 90)) * 86_400_000
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
      address: CITIES[Math.floor(random2() * CITIES.length)],
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
    order.address.toLowerCase().includes(needle)
  )
}

function compare(a: Order, b: Order, query: OrdersQuery) {
  const factor = query.dir === "asc" ? 1 : -1
  if (query.sort === "price") return (a.price - b.price) * factor
  const left = new Date(a[query.sort]).getTime()
  const right = new Date(b[query.sort]).getTime()
  return (left - right) * factor
}

export async function getOrders(query: OrdersQuery): Promise<OrdersResult> {
  const searched = ORDERS.filter((order) => matchesQuery(order, query.q))

  const counts: Record<OrderTab, number> = {
    all: searched.length,
    pickups: searched.filter((o) => o.channel === "pickups").length,
    returns: searched.filter((o) => o.channel === "returns").length,
  }

  const filtered = searched
    .filter((order) => query.tab === "all" || order.channel === query.tab)
    .filter((order) => query.status === null || order.status === query.status)

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

export async function getOrder(id: string): Promise<Order | null> {
  return ORDERS.find((order) => order.id === id) ?? null
}

export type DashboardTile = {
  key: string
  label: string
  value: string
  deltaPct: number
}

export type DashboardStats = {
  tiles: DashboardTile[]
  revenueSeries: Array<{ month: string; revenue: number }>
  recentOrders: Order[]
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export async function getDashboardStats(): Promise<DashboardStats> {
  const revenue = ORDERS.reduce((sum, order) => sum + order.price, 0)
  const completed = ORDERS.filter((o) => o.status === "completed").length
  const unpaid = ORDERS.filter((o) => o.status === "unpaid").length

  const revenueSeries = MONTHS.map((month, index) => ({
    month,
    revenue: Math.round(
      ORDERS.filter((o) => new Date(o.createdAt).getUTCMonth() === index).reduce(
        (sum, o) => sum + o.price,
        0
      )
    ),
  }))

  const recentOrders = [...ORDERS]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6)

  return {
    tiles: [
      {
        key: "revenue",
        label: "Total revenue",
        value: revenue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }),
        deltaPct: 12.4,
      },
      { key: "orders", label: "Orders", value: String(ORDERS.length), deltaPct: 4.1 },
      { key: "completed", label: "Completed", value: String(completed), deltaPct: 8.6 },
      { key: "unpaid", label: "Unpaid", value: String(unpaid), deltaPct: -3.2 },
    ],
    revenueSeries,
    recentOrders,
  }
}
