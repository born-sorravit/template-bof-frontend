"use client"

import type * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buildOrdersHref, PER_PAGE_OPTIONS } from "@/lib/orders-query"
import { useI18n } from "@/components/i18n/locale-provider"
import type { OrdersQuery, OrdersResult } from "@/lib/types/order"

const PER_PAGE_ITEMS = PER_PAGE_OPTIONS.map((value) => ({
  label: String(value),
  value: String(value),
}))

/**
 * A compact page window: always the first and last page, the current page and
 * its neighbours, with ellipses for the gaps. Keeps the control a fixed width
 * whether there are 6 pages or 600.
 */
function pageWindow(page: number, pageCount: number): Array<number | "gap"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, pageCount, page])
  if (page - 1 > 1) pages.add(page - 1)
  if (page + 1 < pageCount) pages.add(page + 1)

  const sorted = [...pages].sort((a, b) => a - b)
  const out: Array<number | "gap"> = []
  let previous = 0
  for (const value of sorted) {
    if (previous && value - previous > 1) out.push("gap")
    out.push(value)
    previous = value
  }
  return out
}

/**
 * Prev/next. A disabled arrow must stay a real `<button>` (an `<a>` cannot be
 * disabled), so the two cases render separately rather than juggling
 * `nativeButton` on one element.
 */
function StepButton({
  href,
  disabled,
  label,
  children,
}: {
  href: string
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <Button variant="ghost" size="icon" aria-label={label} disabled>
        {children}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      render={<Link href={href} scroll={false} />}
      nativeButton={false}
    >
      {children}
    </Button>
  )
}

export function OrdersResultsBar({
  query,
  result,
  /** The top bar is hidden on small screens; the bottom one always shows. */
  hideOnMobile = false,
}: {
  query: OrdersQuery
  result: OrdersResult
  hideOnMobile?: boolean
}) {
  const router = useRouter()
  const { dict } = useI18n()
  const { from, to, total, page, pageCount } = result
  const pages = pageWindow(page, pageCount)

  return (
    <div
      className={
        hideOnMobile
          ? "hidden flex-col items-center gap-3 md:flex md:flex-row md:justify-between"
          : "flex flex-col items-center gap-3 md:flex-row md:justify-between"
      }
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {total === 0
          ? dict.common.noResults
          : `${from} - ${to} / ${total}`}
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <StepButton
              href={buildOrdersHref(query, { page: page - 1 })}
              disabled={page <= 1}
              label="Go to previous page"
            >
              <ChevronLeftIcon />
            </StepButton>
          </PaginationItem>

          {pages.map((entry, index) =>
            entry === "gap" ? (
              <PaginationItem key={`gap-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <Button
                  variant={entry === page ? "outline" : "ghost"}
                  size="icon"
                  aria-label={`Go to page ${entry}`}
                  aria-current={entry === page ? "page" : undefined}
                  render={
                    <Link
                      href={buildOrdersHref(query, { page: entry })}
                      scroll={false}
                    />
                  }
                  nativeButton={false}
                >
                  {entry}
                </Button>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <StepButton
              href={buildOrdersHref(query, { page: page + 1 })}
              disabled={page >= pageCount}
              label="Go to next page"
            >
              <ChevronRightIcon />
            </StepButton>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {dict.pages.orders.itemsPerPage}
        </span>
        <Select
          items={PER_PAGE_ITEMS}
          value={String(query.perPage)}
          onValueChange={(value) =>
            router.push(
              buildOrdersHref(query, { perPage: Number(value) }),
              { scroll: false }
            )
          }
        >
          <SelectTrigger size="sm" aria-label={dict.pages.orders.itemsPerPage}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end">
            <SelectGroup>
              {PER_PAGE_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
