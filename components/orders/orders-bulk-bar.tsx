"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CheckCheckIcon, PrinterIcon, TrashIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useI18n } from "@/components/i18n/locale-provider"

export function OrdersBulkBar({
  count,
  onClear,
}: {
  count: number
  onClear: () => void
}) {
  const reduced = useReducedMotion()
  const { dict } = useI18n()

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
            {count} {dict.pages.orders.selected}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.add({
                title: dict.pages.orders.markPaid,
                description: dict.common.mockAction,
              })
            }
          >
            <CheckCheckIcon data-icon="inline-start" />
            {dict.pages.orders.markPaid}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.add({
                title: dict.common.print,
                description: dict.common.mockAction,
              })
            }
          >
            <PrinterIcon data-icon="inline-start" />
            {dict.common.print}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.add({
                title: dict.common.cancel,
                description: dict.common.mockAction,
              })
            }
          >
            <TrashIcon data-icon="inline-start" />
            {dict.common.cancel}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={dict.common.clearAll}
            onClick={onClear}
          >
            <XIcon />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
