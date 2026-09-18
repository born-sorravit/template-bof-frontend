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
import { useI18n } from "@/components/i18n/locale-provider"
import { signOut } from "@/lib/auth/actions"
import { ROLE_LABELS, type DemoUser } from "@/lib/auth/users"

export function NavUser({ user }: { user: DemoUser }) {
  const { isMobile } = useSidebar()
  const { locale, dict } = useI18n()
  const role = ROLE_LABELS[user.role][locale]

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
            aria-label={user.name}
            render={<SidebarMenuButton size="lg" />}
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-0.5 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                {role}
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
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <UserIcon />
                {dict.common.account}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <SettingsIcon />
                {dict.common.preferences}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* A real Server Action: clears the session cookie and
                  redirects, so it exercises the same path a real app would. */}
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  void signOut()
                }}
              >
                <LogOutIcon />
                {dict.common.signOut}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
