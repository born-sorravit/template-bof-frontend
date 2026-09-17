export type LegalState = "published" | "draft" | "review" | "archived"

export type LegalDocument = {
  id: string
  title: string
  version: string
  state: LegalState
  /** ISO date. */
  effectiveFrom: string
  /** Share of customers who accepted this version, 0-100. */
  acceptance: number
  owner: string
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  { id: "tos", title: "Terms of service", version: "v4.2", state: "published", effectiveFrom: "2026-04-01", acceptance: 98.4, owner: "Legal" },
  { id: "privacy", title: "Privacy policy", version: "v3.1", state: "published", effectiveFrom: "2026-04-01", acceptance: 98.1, owner: "Legal" },
  { id: "returns", title: "Returns and refunds", version: "v2.0", state: "published", effectiveFrom: "2026-01-15", acceptance: 95.7, owner: "Operations" },
  { id: "shipping", title: "Shipping terms", version: "v1.6", state: "review", effectiveFrom: "2026-10-01", acceptance: 0, owner: "Operations" },
  { id: "cookies", title: "Cookie notice", version: "v2.3", state: "published", effectiveFrom: "2025-11-20", acceptance: 91.2, owner: "Legal" },
  { id: "dpa", title: "Data processing addendum", version: "v1.2", state: "draft", effectiveFrom: "2026-11-01", acceptance: 0, owner: "Legal" },
  { id: "aup", title: "Acceptable use policy", version: "v1.0", state: "archived", effectiveFrom: "2024-06-01", acceptance: 88.0, owner: "Security" },
]

export const LEGAL_STATE_META: Record<
  LegalState,
  { label: string; variant: "success" | "neutral" | "warning" | "info" }
> = {
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "neutral" },
  review: { label: "In review", variant: "warning" },
  archived: { label: "Archived", variant: "info" },
}
