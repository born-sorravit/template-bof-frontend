"use client"

import * as React from "react"
import { StoreIcon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { useI18n } from "@/components/i18n/locale-provider"
import { signIn, type SignInState } from "@/lib/auth/actions"
import { DEMO_PASSWORD, DEMO_USERS, ROLE_LABELS } from "@/lib/auth/users"

const INITIAL: SignInState = { error: null }

export function LoginForm({ next }: { next: string }) {
  const { locale, dict } = useI18n()
  // React 19: the action's returned state drives the error message, and
  // `isPending` comes from the same hook -- no extra loading state.
  const [state, formAction, isPending] = React.useActionState(signIn, INITIAL)
  const [email, setEmail] = React.useState("")

  return (
    <Card className="w-full max-w-(--auth-max)">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <StoreIcon />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle>{dict.login.title}</CardTitle>
            <CardDescription>{dict.login.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <FieldGroup>
            <Field data-invalid={state.error ? true : undefined}>
              <FieldLabel htmlFor="email">{dict.login.email}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={state.error ? true : undefined}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={DEMO_USERS[0].email}
              />
            </Field>
            <Field data-invalid={state.error ? true : undefined}>
              <FieldLabel htmlFor="password">{dict.login.password}</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={state.error ? true : undefined}
                defaultValue={DEMO_PASSWORD}
              />
            </Field>
          </FieldGroup>

          {state.error ? (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {isPending ? dict.login.submitting : dict.login.submit}
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {dict.login.demoAccounts}
          </span>
          <ItemGroup>
            {DEMO_USERS.map((user) => (
              <Item
                key={user.id}
                size="sm"
                // Fills the email so the form can be submitted in one click.
                render={<button type="button" />}
                onClick={() => setEmail(user.email)}
              >
                <ItemContent>
                  <ItemTitle>{user.name}</ItemTitle>
                  <ItemDescription>
                    {user.email} · {ROLE_LABELS[user.role][locale]}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
          <span className="text-xs text-muted-foreground">
            {dict.login.copyHint} {dict.login.passwordFor}:{" "}
            <code className="font-mono">{DEMO_PASSWORD}</code>
          </span>
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">
          {dict.common.language}
        </span>
        <LanguageSwitcher variant="labelled" />
      </CardFooter>
    </Card>
  )
}
