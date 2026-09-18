import type { Metadata } from "next"
import { SettingsIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/motion/fade-in"
import { CardHead } from "@/components/dashboard/card-head"
import { SettingsForm } from "@/components/settings/settings-form"
import { PageHeader } from "@/components/shell/page-header"
import { getDictionary } from "@/lib/i18n"

export const metadata: Metadata = { title: "Settings" }

export default async function SettingsPage() {
  const { dict } = await getDictionary()
  const t = dict.pages.settings

  return (
    <>
      <FadeIn>
        <PageHeader
          title={t.title}
          description={t.description}
        />
      </FadeIn>

      <FadeIn>
        <Card className="max-w-2xl">
          <CardHead
            icon={SettingsIcon}
            title={t.cardTitle}
            description={t.cardHint}
          />
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </FadeIn>
    </>
  )
}
