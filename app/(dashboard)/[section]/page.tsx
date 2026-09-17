import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ConstructionIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FadeIn } from "@/components/motion/fade-in"
import { PageHeader } from "@/components/shell/page-header"
import { labelForSegment } from "@/components/shell/nav-items"

/**
 * The sidebar advertises more sections than this template implements. Rather
 * than 404 on a nav click, each one lands on a labelled scaffold. Delete this
 * route as you build the real pages out.
 */
const SCAFFOLD_SECTIONS = [
  "analytics",
  "inventory",
  "customers",
  "payments",
  "messages",
  "notifications",
  "settings",
  "support",
] as const

export async function generateStaticParams() {
  return SCAFFOLD_SECTIONS.map((section) => ({ section }))
}

export async function generateMetadata({
  params,
}: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params
  return { title: labelForSegment(section) }
}

export default async function SectionScaffoldPage({
  params,
}: PageProps<"/[section]">) {
  const { section } = await params

  if (!SCAFFOLD_SECTIONS.includes(section as (typeof SCAFFOLD_SECTIONS)[number])) {
    notFound()
  }

  const label = labelForSegment(section)

  return (
    <>
      <FadeIn>
        <PageHeader title={label} />
      </FadeIn>
      <FadeIn>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ConstructionIcon />
            </EmptyMedia>
            <EmptyTitle>{label} is a scaffold</EmptyTitle>
            <EmptyDescription>
              This route exists so the sidebar never dead-ends. Build it out, or
              drop{" "}
              <code className="font-mono text-xs">app/(dashboard)/[section]</code>{" "}
              and remove the item from{" "}
              <code className="font-mono text-xs">
                components/shell/nav-items.ts
              </code>
              .
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              render={<Link href="/orders" />}
              nativeButton={false}
            >
              Go to Orders
            </Button>
          </EmptyContent>
        </Empty>
      </FadeIn>
    </>
  )
}
