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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppBreadcrumb } from "@/components/shell/app-breadcrumb"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { useI18n } from "@/components/i18n/locale-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppTopbar() {
  const { state, isMobile } = useSidebar()
  const { dict } = useI18n()

  // The expanded sidebar carries its own collapse control in its header, so
  // showing this one too would put two identical toggles side by side.
  // `state` comes from SidebarProvider's defaultOpen (the cookie is written but
  // never read back), so this matches on the server and the first client paint.
  const showTrigger = isMobile || state === "collapsed"

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {showTrigger ? (
        <>
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 self-center!" />
        </>
      ) : null}
      <AppBreadcrumb />

      <div className="ml-auto flex items-center gap-1.5">
        <InputGroup className="hidden w-56 lg:flex">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder={dict.common.quickFind}
            aria-label={dict.common.quickFind} />
        </InputGroup>
        <Button variant="ghost" size="icon" aria-label={dict.common.notifications}>
          <BellIcon />
        </Button>
        <LanguageSwitcher />
        <ThemeToggle />
        <Avatar className="size-7">
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
