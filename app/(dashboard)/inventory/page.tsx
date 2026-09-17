import type { Metadata } from "next"
import { PackageIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FadeIn } from "@/components/motion/fade-in"
import { CardHead } from "@/components/dashboard/card-head"
import { PageHeader } from "@/components/shell/page-header"
import { StatTiles } from "@/components/shell/stat-tiles"
import { getInventory, STOCK_STATE_META } from "@/lib/data/inventory"

export const metadata: Metadata = { title: "Inventory" }

export default async function InventoryPage() {
  const rows = await getInventory()
  const onHand = rows.reduce((sum, r) => sum + r.onHand, 0)
  const reserved = rows.reduce((sum, r) => sum + r.reserved, 0)
  const needsAction = rows.filter(
    (r) => r.state === "low" || r.state === "out" || r.state === "backorder"
  ).length

  return (
    <>
      <FadeIn>
        <PageHeader
          title="Inventory"
          description="Stock positions per SKU, with reserved units held against open orders."
        />
      </FadeIn>

      <StatTiles
        tiles={[
          { key: "skus", label: "SKUs tracked", value: rows.length },
          { key: "onhand", label: "Units on hand", value: onHand },
          { key: "reserved", label: "Reserved", value: reserved, hint: "Committed to open orders" },
          { key: "action", label: "Need action", value: needsAction, hint: "At or below reorder point" },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={PackageIcon}
            title="Stock by SKU"
            description="Available is on hand minus reserved"
          />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">On hand</TableHead>
                  <TableHead className="hidden text-right md:table-cell">
                    Reserved
                  </TableHead>
                  <TableHead className="w-40">Against reorder point</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const state = STOCK_STATE_META[row.state]
                  const pct = Math.min(
                    100,
                    Math.round((row.available / Math.max(row.reorderAt, 1)) * 100)
                  )
                  return (
                    <TableRow key={row.sku}>
                      <TableCell>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {row.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {row.sku}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {row.location}
                      </TableCell>
                      <TableCell>
                        <Badge variant={state.variant}>{state.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.onHand}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums md:table-cell">
                        {row.reserved}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {row.available} available · reorder at{" "}
                            {row.reorderAt}
                          </span>
                          <Progress value={pct} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </FadeIn>
    </>
  )
}
