import { getAllOrders } from "@/lib/data/orders"
import type { Order } from "@/lib/types/order"

export type CustomerTier = "vip" | "regular" | "new"

export type Customer = {
  id: string
  name: string
  email: string
  city: string
  orders: number
  spend: number
  lastOrderAt: string
  tier: CustomerTier
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z]+/g, "-")
}

/** Derived from the order fixture, so totals reconcile with /orders. */
export async function getCustomers(): Promise<Customer[]> {
  const orders = await getAllOrders()
  const byName = new Map<string, Order[]>()
  for (const order of orders) {
    const list = byName.get(order.customer.name) ?? []
    list.push(order)
    byName.set(order.customer.name, list)
  }

  return [...byName.entries()]
    .map(([name, rows]) => {
      const spend = rows.reduce((sum, o) => sum + o.price, 0)
      const lastOrderAt = rows
        .map((o) => o.createdAt)
        .sort()
        .at(-1)!
      const tier: CustomerTier =
        spend >= 8000 ? "vip" : rows.length >= 3 ? "regular" : "new"

      return {
        id: slugify(name),
        name,
        email: rows[0].customer.email,
        city: rows[0].address.city,
        orders: rows.length,
        spend,
        lastOrderAt,
        tier,
      }
    })
    .sort((a, b) => b.spend - a.spend)
}

export const CUSTOMER_TIER_META: Record<
  CustomerTier,
  { label: string; variant: "settled" | "info" | "neutral" }
> = {
  vip: { label: "VIP", variant: "settled" },
  regular: { label: "Regular", variant: "info" },
  new: { label: "New", variant: "neutral" },
}
