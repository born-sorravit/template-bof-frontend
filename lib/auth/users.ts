export type Role = "owner" | "operations" | "support"

export type DemoUser = {
  id: string
  email: string
  name: string
  initials: string
  role: Role
}

/**
 * Stand-in for a user table. Everyone shares one password so the login screen
 * can be used without a credential store — see `DEMO_PASSWORD`.
 */
export const DEMO_PASSWORD = "northwind"

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u-amara",
    email: "amara@northwind.example",
    name: "Amara Nwosu",
    initials: "AN",
    role: "operations",
  },
  {
    id: "u-samuel",
    email: "samuel@northwind.example",
    name: "Samuel Adeyemi",
    initials: "SA",
    role: "support",
  },
  {
    id: "u-grace",
    email: "grace@northwind.example",
    name: "Grace Umeh",
    initials: "GU",
    role: "owner",
  },
]

export const ROLE_LABELS: Record<Role, { en: string; th: string }> = {
  owner: { en: "Owner", th: "เจ้าของระบบ" },
  operations: { en: "Operations lead", th: "หัวหน้าปฏิบัติการ" },
  support: { en: "Support agent", th: "เจ้าหน้าที่ซัพพอร์ต" },
}

export function findUser(email: string): DemoUser | null {
  const needle = email.trim().toLowerCase()
  return DEMO_USERS.find((u) => u.email.toLowerCase() === needle) ?? null
}
