import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-9 w-72" />
      <div className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-2">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
