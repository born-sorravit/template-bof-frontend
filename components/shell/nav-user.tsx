"use client"

import Link from "next/link"
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { toast } from "@/components/ui/toast"

const USER = {
  name: "Amara Nwosu",
  role: "Operations lead",
  email: "amara@northwind.example",
  initials: "AN",
}

export function NavUser() {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem>
        <DropdownMenu>
          {/* SidebarMenuButton is already a real <button>, so no nativeButton.
              Its `tooltip` prop is deliberately absent: when the button is used
              as a `render` target the outer trigger wins and the tooltip
              wrapper is discarded, so it would be a no-op. `aria-label` covers
              the collapsed rail, where the name is visually hidden. */}
          <DropdownMenuTrigger
            aria-label={USER.name}
            render={<SidebarMenuButton size="lg" />}
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {USER.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-0.5 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-medium">{USER.name}</span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                {USER.role}
              </span>
            </div>
            <ChevronsUpDownIcon
              data-icon="inline-end"
              className="ml-auto group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            className="w-56"
          >
            {/* DropdownMenuLabel is a menu *group part* in Base UI, so it has
                to sit inside a DropdownMenuGroup -- outside one it throws
                "MenuGroupContext is missing" at runtime, not at build time. */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{USER.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {USER.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <UserIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <SettingsIcon />
                Preferences
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  toast.add({
                    title: "Signed out",
                    description: "Mock only — no session to end.",
                  })
                }
              >
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
