import Link from "next/link"
import { PackageXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default async function OrderNotFound() {
  const { dict } = await getDictionary()
  const t = dict.pages.orders.detail

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageXIcon />
        </EmptyMedia>
        <EmptyTitle>{t.notFound}</EmptyTitle>
        <EmptyDescription>{t.notFoundBody}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link href="/orders" />} nativeButton={false}>
          {t.back}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
