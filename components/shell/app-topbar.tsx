"use client"

import { BellIcon, SearchIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppBreadcrumb } from "@/components/shell/app-breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4" />
      <AppBreadcrumb />

      <div className="ml-auto flex items-center gap-1.5">
        <InputGroup className="hidden w-56 lg:flex">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Quick find..." aria-label="Quick find" />
        </InputGroup>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <BellIcon />
        </Button>
        <ThemeToggle />
        <Avatar className="size-7">
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
