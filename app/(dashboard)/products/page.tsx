import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { PageHeader } from "@/components/shell/page-header"
import { getProducts } from "@/lib/data/products"
import { formatPrice } from "@/lib/orders-display"

export const metadata: Metadata = {
  title: "Products",
}

function stockBadge(stock: number) {
  if (stock === 0) return { variant: "danger" as const, label: "Out of stock" }
  if (stock < 5) return { variant: "warning" as const, label: `Low · ${stock}` }
  return { variant: "success" as const, label: `In stock · ${stock}` }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Products"
          description={`${products.length} products in the mock catalogue.`}
        />
      </FadeIn>

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const stock = stockBadge(product.stock)

          return (
            <StaggerItem key={product.id}>
              <Card>
                <CardHeader>
                  <CardDescription>{product.category}</CardDescription>
                  <CardTitle>{product.name}</CardTitle>
                  <CardAction>
                    <Badge variant={stock.variant}>{stock.label}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-semibold tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </CardContent>
                <CardFooter>
                  <span className="font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </span>
                </CardFooter>
              </Card>
            </StaggerItem>
          )
        })}
      </Stagger>
    </>
  )
}
