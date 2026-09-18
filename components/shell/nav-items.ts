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
  HistoryIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TagIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react"

import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export type NavKey = Exclude<keyof Dictionary["nav"], "groups">
export type GroupKey = keyof Dictionary["nav"]["groups"]

export type NavItem = {
  /** Key into `dict.nav`; the label itself lives in the dictionaries. */
  key: NavKey
  href: string
  icon: LucideIcon
  /** Rendered as a count badge on the right. */
  badge?: string
  /** Dimmed, non-navigating, tagged "Soon". */
  comingSoon?: boolean
}

export type NavGroup = {
  /** Key into `dict.nav.groups`. Omit for the unlabelled top group. */
  groupKey?: GroupKey
  items: NavItem[]
}

/** Single source of truth for the sidebar and the breadcrumb labels. */
export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ key: "overview", href: "/dashboard", icon: LayoutDashboardIcon }],
  },
  {
    groupKey: "commerce",
    items: [
      { key: "orders", href: "/orders", icon: ShoppingBagIcon, badge: "88" },
      { key: "products", href: "/products", icon: TagIcon },
      { key: "inventory", href: "/inventory", icon: PackageIcon },
      { key: "payments", href: "/payments", icon: CreditCardIcon },
    ],
  },
  {
    groupKey: "usersAccess",
    items: [
      { key: "customers", href: "/customers", icon: UsersIcon },
      { key: "admins", href: "/admins", icon: UserCogIcon, comingSoon: true },
      { key: "consent", href: "/consent", icon: FileTextIcon, comingSoon: true },
      { key: "legal", href: "/legal", icon: ScrollTextIcon },
      { key: "roles", href: "/roles", icon: ShieldCheckIcon, comingSoon: true },
      { key: "auditLog", href: "/audit-log", icon: HistoryIcon, comingSoon: true },
    ],
  },
  {
    groupKey: "insights",
    items: [
      { key: "analytics", href: "/analytics", icon: BarChart3Icon },
      { key: "notifications", href: "/notifications", icon: BellIcon, comingSoon: true },
    ],
  },
  {
    groupKey: "workspace",
    items: [
      { key: "messages", href: "/messages", icon: MessageSquareIcon, badge: "3" },
      { key: "settings", href: "/settings", icon: SettingsIcon },
      { key: "support", href: "/support", icon: LifeBuoyIcon },
    ],
  },
]

/** URL segment -> dictionary key, for the breadcrumb. */
const SEGMENT_KEYS: Record<string, NavKey> = {
  dashboard: "overview",
  orders: "orders",
  products: "products",
  analytics: "analytics",
  inventory: "inventory",
  customers: "customers",
  payments: "payments",
  messages: "messages",
  notifications: "notifications",
  settings: "settings",
  support: "support",
  legal: "legal",
  admins: "admins",
  consent: "consent",
  roles: "roles",
  "audit-log": "auditLog",
}

export function labelForSegment(
  segment: string,
  nav: Dictionary["nav"]
): string {
  const key = SEGMENT_KEYS[segment]
  if (key) return nav[key]

  // Identifiers like "998-5878" must survive verbatim -- prettifying would
  // render the order id as "998 5878".
  if (/\d/.test(segment)) return segment

  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
