import type { CSSProperties } from "react"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/shell/app-sidebar"
import { AppTopbar } from "@/components/shell/app-topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getSession } from "@/lib/auth/session"

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  // The proxy already bounces requests with no session cookie; this is the
  // second gate for a cookie that no longer resolves to a user.
  const user = await getSession()
  if (!user) redirect("/login")

  return (
    // Starts collapsed to the icon rail, as in the reference design. The rail is
    // ~64px there; the shadcn default is 48px.
    <SidebarProvider
      defaultOpen={false}
      style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}
    >
      <AppSidebar user={user} />
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
