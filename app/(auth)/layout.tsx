import type { CSSProperties } from "react"

/** No app shell: the auth screens stand alone. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4"
      style={{ "--auth-max": "26rem" } as CSSProperties}
    >
      {children}
    </div>
  )
}
