"use client"

import * as React from "react"
import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { OrdersBulkBar } from "@/components/orders/orders-bulk-bar"
import { OrdersCardList } from "@/components/orders/orders-card-list"
import { OrdersFilterChips } from "@/components/orders/orders-filter-chips"
import { OrdersResultsBar } from "@/components/orders/orders-results-bar"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrdersTabs } from "@/components/orders/orders-tabs"
import { OrdersToolbar } from "@/components/orders/orders-toolbar"
import { buildOrdersHref, hasActiveFilters } from "@/lib/orders-query"
import type { OrdersQuery, OrdersResult } from "@/lib/types/order"

/**
 * Owns the only state that cannot live in the URL: which rows are ticked.
 * Everything else — search, status, tab, sort, page, per-page — arrives as
 * props from the server page, which parsed it out of `searchParams`.
 */
export function OrdersView({
  query,
  result,
}: {
  query: OrdersQuery
  result: OrdersResult
}) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const toggleRow = React.useCallback((id: string, checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const toggleAll = React.useCallback(
    (checked: boolean) => {
      setSelectedIds((previous) => {
        const next = new Set(previous)
        for (const row of result.rows) {
          if (checked) next.add(row.id)
          else next.delete(row.id)
        }
        return next
      })
    },
    [result.rows]
  )

  const clearSelection = React.useCallback(() => setSelectedIds(new Set()), [])

  const isEmpty = result.rows.length === 0

  return (
    <>
      <Stagger className="flex flex-col gap-4">
        <StaggerItem>
          <OrdersToolbar query={query} />
        </StaggerItem>

        {hasActiveFilters(query) ? (
          <StaggerItem>
            <OrdersFilterChips query={query} />
          </StaggerItem>
        ) : null}

        <StaggerItem>
          <OrdersTabs query={query} counts={result.counts} />
        </StaggerItem>

        {isEmpty ? (
          <FadeIn>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchXIcon />
                </EmptyMedia>
                <EmptyTitle>No orders match these filters</EmptyTitle>
                <EmptyDescription>
                  Try a different search term, or clear the filters to see all 88
                  orders.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  render={
                    <Link
                      href={buildOrdersHref(query, {
                        q: "",
                        status: null,
                        tab: "all",
                      })}
                      scroll={false}
                    />
                  }
                  nativeButton={false}
                >
                  Clear filters
                </Button>
              </EmptyContent>
            </Empty>
          </FadeIn>
        ) : (
          <>
            <StaggerItem>
              <OrdersResultsBar query={query} result={result} hideOnMobile />
            </StaggerItem>

            <StaggerItem>
              <OrdersTable
                rows={result.rows}
                query={query}
                selectedIds={selectedIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
              />
              <OrdersCardList
                rows={result.rows}
                selectedIds={selectedIds}
                onToggleRow={toggleRow}
              />
            </StaggerItem>

            <StaggerItem>
              <OrdersResultsBar query={query} result={result} />
            </StaggerItem>
          </>
        )}

      </Stagger>

      {/* Outside <Stagger>: AnimatePresence renders no DOM node of its own, so
          inside it the bar became a stagger child and a 360ms backwards fill
          held it at opacity 0 -- overriding motion's own inline opacity. */}
      <OrdersBulkBar count={selectedIds.size} onClear={clearSelection} />
    </>
  )
}
