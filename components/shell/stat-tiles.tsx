import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CountUp } from "@/components/motion/count-up"
import { Stagger, StaggerItem } from "@/components/motion/fade-in"
import type { CountFormat } from "@/components/motion/count-up"

export type StatTile = {
  key: string
  label: string
  value: number
  format?: CountFormat
  hint?: string
}

/** The four-across headline strip used at the top of the list pages. */
export function StatTiles({ tiles }: { tiles: StatTile[] }) {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <StaggerItem key={tile.key}>
          <Card className="h-full">
            <CardHeader>
              <CardDescription>{tile.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                <CountUp value={tile.value} format={tile.format ?? "integer"} />
              </CardTitle>
              {tile.hint ? (
                <CardDescription className="text-xs">
                  {tile.hint}
                </CardDescription>
              ) : null}
            </CardHeader>
          </Card>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
