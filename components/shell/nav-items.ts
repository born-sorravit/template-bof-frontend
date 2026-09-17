import {
  BarChart3Icon,
  BellIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  type LucideIcon,
  MessageSquareIcon,
  PackageIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TagIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  /** Rendered as a count badge on the right. */
  badge?: string
  /** Dimmed, non-navigating, tagged "Soon". */
  comingSoon?: boolean
}

export type NavGroup = {
  /** Uppercase section heading. Omit for the top-level group. */
  label?: string
  items: NavItem[]
}

/** Single source of truth for the sidebar and the breadcrumb labels. */
export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ title: "Overview", href: "/dashboard", icon: LayoutDashboardIcon }],
  },
  {
    label: "Commerce",
    items: [
      { title: "Orders", href: "/orders", icon: ShoppingBagIcon, badge: "88" },
      { title: "Products", href: "/products", icon: TagIcon },
      { title: "Inventory", href: "/inventory", icon: PackageIcon },
      { title: "Payments", href: "/payments", icon: CreditCardIcon },
    ],
  },
  {
    label: "Users & access",
    items: [
      { title: "Customers", href: "/customers", icon: UsersIcon },
      { title: "Admins", href: "/admins", icon: UserCogIcon, comingSoon: true },
      { title: "Consent", href: "/consent", icon: FileTextIcon, comingSoon: true },
      { title: "Legal documents", href: "/legal", icon: ScrollTextIcon },
      { title: "Admin roles", href: "/roles", icon: ShieldCheckIcon, comingSoon: true },
      { title: "Audit log", href: "/audit-log", icon: ScrollTextIcon, comingSoon: true },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", href: "/analytics", icon: BarChart3Icon },
      { title: "Notifications", href: "/notifications", icon: BellIcon, comingSoon: true },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Messages", href: "/messages", icon: MessageSquareIcon, badge: "3" },
      { title: "Settings", href: "/settings", icon: SettingsIcon },
      { title: "Support", href: "/support", icon: LifeBuoyIcon },
    ],
  },
]

const LABEL_BY_SEGMENT: Record<string, string> = {
  dashboard: "Overview",
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
  legal: "Legal documents",
  admins: "Admins",
  consent: "Consent",
  roles: "Admin roles",
  "audit-log": "Audit log",
}

export function labelForSegment(segment: string): string {
  const known = LABEL_BY_SEGMENT[segment]
  if (known) return known

  // Identifiers like "998-5878" must survive verbatim -- prettifying would
  // render the order id as "998 5878".
  if (/\d/.test(segment)) return segment

  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
