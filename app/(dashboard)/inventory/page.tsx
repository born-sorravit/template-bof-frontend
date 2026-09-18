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
import { fill, getDictionary } from "@/lib/i18n"

export const metadata: Metadata = { title: "Inventory" }

export default async function InventoryPage() {
  const { dict } = await getDictionary()
  const t = dict.pages.inventory
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
          title={t.title}
          description={t.description}
        />
      </FadeIn>

      <StatTiles
        tiles={[
          { key: "skus", label: t.skusTracked, value: rows.length },
          { key: "onhand", label: t.unitsOnHand, value: onHand },
          { key: "reserved", label: t.reserved, value: reserved, hint: t.reservedHint },
          { key: "action", label: t.needAction, value: needsAction, hint: t.needActionHint },
        ]}
      />

      <FadeIn>
        <Card>
          <CardHead
            icon={PackageIcon}
            title={t.stockBySku}
            description={t.stockBySkuHint}
          />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.sku}</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    {t.location}
                  </TableHead>
                  <TableHead>{t.state}</TableHead>
                  <TableHead className="text-right">{t.onHand}</TableHead>
                  <TableHead className="hidden text-right md:table-cell">
                    {t.reserved}
                  </TableHead>
                  <TableHead className="w-40">{t.againstReorder}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
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
                        <Badge variant={STOCK_STATE_META[row.state].variant}>
                          {dict.stockState[row.state]}
                        </Badge>
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
                            {fill(t.availableReorder, {
                              available: row.available,
                              reorderAt: row.reorderAt,
                            })}
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
