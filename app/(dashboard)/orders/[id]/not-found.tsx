import Link from "next/link"
import { PackageXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function OrderNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageXIcon />
        </EmptyMedia>
        <EmptyTitle>Order not found</EmptyTitle>
        <EmptyDescription>
          That order id does not exist in the mock dataset.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link href="/orders" />} nativeButton={false}>
          Back to orders
        </Button>
      </EmptyContent>
    </Empty>
  )
}
