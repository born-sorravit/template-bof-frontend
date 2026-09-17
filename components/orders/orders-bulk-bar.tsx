"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CheckCheckIcon, PrinterIcon, TrashIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function OrdersBulkBar({
  count,
  onClear,
}: {
  count: number
  onClear: () => void
}) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.div
          className="sticky bottom-4 z-10 mx-auto flex w-fit max-w-full flex-wrap items-center gap-2 rounded-2xl border bg-popover p-2 shadow-lg"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="px-2 text-sm font-medium">
            {count} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.add({ title: `${count} orders marked paid` })}
          >
            <CheckCheckIcon data-icon="inline-start" />
            Mark paid
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.add({ title: "Packing slips sent to printer" })}
          >
            <PrinterIcon data-icon="inline-start" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.add({
                title: `${count} orders cancelled`,
                description: "This is a mock action — no data changed.",
              })
            }
          >
            <TrashIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Clear selection"
            onClick={onClear}
          >
            <XIcon />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
