"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { StoreIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NAV_GROUPS } from "@/components/shell/nav-items"
import { useI18n } from "@/components/i18n/locale-provider"
import { NavUser } from "@/components/shell/nav-user"
import type { DemoUser } from "@/lib/auth/users"

export function AppSidebar({ user }: { user: DemoUser }) {
  const pathname = usePathname()
  const { dict } = useI18n()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center gap-0 border-b border-sidebar-border">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <SidebarMenu className="w-auto flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                variant="nav"
                tooltip={`${dict.brand.name} ${dict.brand.tagline}`}
                render={<Link href="/dashboard" />}
                className="gap-2.5"
              >
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg"
                >
                  <StoreIcon />
                </span>
                <span className="truncate text-base font-semibold text-sidebar-brand group-data-[collapsible=icon]:hidden">
                  {dict.brand.name}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Collapse control lives in the rail header, as in the reference.
              The topbar keeps its own trigger for re-opening and for mobile. */}
          <SidebarTrigger className="hidden shrink-0 group-data-[collapsible=icon]:hidden md:flex" />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {NAV_GROUPS.map((group, index) => (
          <SidebarGroup key={group.groupKey ?? `group-${index}`}>
            {group.groupKey ? (
              <SidebarGroupLabel>
                {dict.nav.groups[group.groupKey]}
              </SidebarGroupLabel>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)

                  // Coming-soon rows stay in place so the shape of the product
                  // is visible, but they do not navigate.
                  if (item.comingSoon) {
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          variant="nav"
                          aria-disabled
                          tooltip={`${dict.nav[item.key]} — ${dict.common.soon}`}
                        >
                          <item.icon />
                          <span>{dict.nav[item.key]}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>
                          <Badge variant="secondary">{dict.common.soon}</Badge>
                        </SidebarMenuBadge>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        variant="nav"
                        isActive={isActive}
                        tooltip={dict.nav[item.key]}
                        render={<Link href={item.href} />}
                      >
                        <item.icon />
                        <span>{dict.nav[item.key]}</span>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
