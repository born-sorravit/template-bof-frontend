import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"
import { getDictionary } from "@/lib/i18n"

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary()
  return { title: dict.login.title }
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams
  const raw = params.next
  const candidate = Array.isArray(raw) ? raw[0] : raw

  // Only in-app paths; never an absolute or protocol-relative URL.
  const next =
    candidate && candidate.startsWith("/") && !candidate.startsWith("//")
      ? candidate
      : "/dashboard"

  return <LoginForm next={next} />
}
