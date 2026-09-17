import {
  BarChart3Icon,
  BellIcon,
  CreditCardIcon,
  HomeIcon,
  LifeBuoyIcon,
  type LucideIcon,
  MessageSquareIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  /** Rendered as a SidebarMenuBadge when present. */
  badge?: string
}

export type NavGroup = {
  /** Used as the SidebarGroupLabel; hidden when the rail is collapsed. */
  label: string
  items: NavItem[]
}

/** Single source of truth for the sidebar and the breadcrumb labels. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Home page", href: "/dashboard", icon: HomeIcon },
      { title: "Analytics", href: "/analytics", icon: BarChart3Icon },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { title: "Products", href: "/products", icon: TagIcon },
      { title: "Inventory", href: "/inventory", icon: PackageIcon },
    ],
  },
  {
    label: "Commerce",
    items: [
      { title: "Orders", href: "/orders", icon: ShoppingBagIcon, badge: "88" },
      { title: "Customers", href: "/customers", icon: UsersIcon },
      { title: "Payments", href: "/payments", icon: CreditCardIcon },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Messages", href: "/messages", icon: MessageSquareIcon, badge: "3" },
      { title: "Notifications", href: "/notifications", icon: BellIcon },
      { title: "Settings", href: "/settings", icon: SettingsIcon },
      { title: "Support", href: "/support", icon: LifeBuoyIcon },
    ],
  },
]

const LABEL_BY_SEGMENT: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
  analytics: "Analytics",
  inventory: "Inventory",
  customers: "Customers",
  payments: "Payments",
  messages: "Messages",
  notifications: "Notifications",
  settings: "Settings",
  support: "Support",
}

export function labelForSegment(segment: string): string {
  const known = LABEL_BY_SEGMENT[segment]
  if (known) return known

  // Identifiers like "998-5878" must survive verbatim -- prettifying would
  // render the order id as "998 5878".
  if (/\d/.test(segment)) return segment

  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

/** The routes that actually exist in this template. */
export const IMPLEMENTED_ROUTES = new Set([
  "/dashboard",
  "/products",
  "/orders",
])
