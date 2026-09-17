import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/shell/app-sidebar"
import { AppTopbar } from "@/components/shell/app-topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    // Starts collapsed to the icon rail, as in the reference design. The rail is
    // ~64px there; the shadcn default is 48px.
    <SidebarProvider
      defaultOpen={false}
      style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}
    >
      <AppSidebar />
      {/* `min-w-0` is load-bearing: SidebarInset is a flex child, and without it
          the wide orders table sets the page's width instead of scrolling
          inside its own container. */}
      <SidebarInset className="min-w-0">
        <AppTopbar />
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
