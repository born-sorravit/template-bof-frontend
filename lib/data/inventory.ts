import { getProducts } from "@/lib/data/products"

export type StockState = "healthy" | "low" | "out" | "backorder"

export type InventoryRow = {
  sku: string
  name: string
  category: string
  location: string
  onHand: number
  reserved: number
  reorderAt: number
  /** onHand - reserved. */
  available: number
  state: StockState
}

const LOCATIONS = ["Lagos DC", "Abuja DC", "Ibadan hub", "Enugu hub"]

function stateFor(available: number, reorderAt: number): StockState {
  if (available <= 0) return "out"
  if (available < reorderAt / 2) return "backorder"
  if (available < reorderAt) return "low"
  return "healthy"
}

export async function getInventory(): Promise<InventoryRow[]> {
  const products = await getProducts()

  return products.map((product, index) => {
    // Deterministic reserved/reorder figures derived from position and stock.
    const reserved = Math.min(product.stock, (index * 3) % 7)
    const reorderAt = 6 + (index % 4) * 3
    const available = product.stock - reserved

    return {
      sku: product.sku,
      name: product.name,
      category: product.category,
      location: LOCATIONS[index % LOCATIONS.length],
      onHand: product.stock,
      reserved,
      reorderAt,
      available,
      state: stateFor(available, reorderAt),
    }
  })
}

export const STOCK_STATE_META: Record<
  StockState,
  { label: string; variant: "success" | "warning" | "danger" | "info" }
> = {
  healthy: { label: "Healthy", variant: "success" },
  low: { label: "Low", variant: "warning" },
  backorder: { label: "Backorder", variant: "info" },
  out: { label: "Out of stock", variant: "danger" },
}
