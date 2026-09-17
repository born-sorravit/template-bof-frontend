import type { Metadata } from "next"
import { SettingsIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/motion/fade-in"
import { CardHead } from "@/components/dashboard/card-head"
import { SettingsForm } from "@/components/settings/settings-form"
import { PageHeader } from "@/components/shell/page-header"

export const metadata: Metadata = { title: "Settings" }

export default function SettingsPage() {
  return (
    <>
      <FadeIn>
        <PageHeader
          title="Settings"
          description="Workspace, regional and notification preferences."
        />
      </FadeIn>

      <FadeIn>
        <Card className="max-w-2xl">
          <CardHead
            icon={SettingsIcon}
            title="Workspace settings"
            description="Saving shows a toast; nothing is persisted yet."
          />
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </FadeIn>
    </>
  )
}
