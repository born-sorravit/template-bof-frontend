import { getAllOrders } from "@/lib/data/orders"
import type { OrderStatus } from "@/lib/types/order"

export type PaymentMethod = "card" | "transfer" | "cash" | "wallet"
export type PaymentState = "captured" | "pending" | "refunded" | "failed"

export type Payment = {
  id: string
  orderId: string
  customer: string
  method: PaymentMethod
  state: PaymentState
  amount: number
  createdAt: string
}

const METHODS: PaymentMethod[] = ["card", "transfer", "cash", "wallet"]

/** An order's payment state follows the order's own status. */
function stateFor(status: OrderStatus): PaymentState {
  if (status === "rejected") return "failed"
  if (status === "unpaid" || status === "pending") return "pending"
  if (status === "completed") return "refunded"
  return "captured"
}

export async function getPayments(): Promise<Payment[]> {
  const orders = await getAllOrders()
  return orders
    .map((order, index) => ({
      id: `PAY-${order.id.replace("-", "")}`,
      orderId: order.id,
      customer: order.customer.name,
      // Deterministic: derived from position, never Math.random().
      method: METHODS[index % METHODS.length],
      state: stateFor(order.status),
      amount: order.price,
      createdAt: order.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export const PAYMENT_METHOD_META: Record<PaymentMethod, { label: string }> = {
  card: { label: "Card" },
  transfer: { label: "Bank transfer" },
  cash: { label: "Cash on delivery" },
  wallet: { label: "Wallet" },
}

export const PAYMENT_STATE_META: Record<
  PaymentState,
  { label: string; variant: "success" | "warning" | "neutral" | "danger" }
> = {
  captured: { label: "Captured", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  refunded: { label: "Refunded", variant: "neutral" },
  failed: { label: "Failed", variant: "danger" },
}
