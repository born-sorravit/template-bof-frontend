"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { labelForSegment } from "@/components/shell/nav-items"

type Crumb = { label: string; href: string }

function crumbsFor(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean)

  const crumbs: Crumb[] = [{ label: "Home page", href: "/dashboard" }]
  let href = ""
  for (const segment of segments) {
    href += `/${segment}`
    if (href === "/dashboard") continue
    crumbs.push({ label: labelForSegment(segment), href })
  }
  return crumbs
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const crumbs = crumbsFor(pathname)

  const first = crumbs[0]
  const last = crumbs[crumbs.length - 1]
  const middle = crumbs.slice(1, -1)

  // Beyond three levels the middle collapses behind an ellipsis dropdown so a
  // deep route never wraps the header onto a second line.
  const collapsed = middle.length > 2
  const shown = collapsed ? middle.slice(-1) : middle
  const hidden = collapsed ? middle.slice(0, -1) : []

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {crumbs.length > 1 ? (
          <>
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink render={<Link href={first.href} />}>
                {first.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
          </>
        ) : null}

        {hidden.length > 0 ? (
          <>
            <BreadcrumbItem className="hidden sm:inline-flex">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Show hidden breadcrumbs"
                  className="flex items-center rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    {hidden.map((crumb) => (
                      <DropdownMenuItem
                        key={crumb.href}
                        render={<Link href={crumb.href} />}
                      >
                        {crumb.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
          </>
        ) : null}

        {shown.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink render={<Link href={crumb.href} />}>
                {crumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
          </React.Fragment>
        ))}

        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate">{last.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
