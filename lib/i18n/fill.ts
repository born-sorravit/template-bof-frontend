/**
 * Fills `{placeholders}`. Deliberately tiny — the alternative is an ICU message
 * library, which this template does not need.
 *
 * Lives in its own module with no server-only imports, so client components can
 * use it without pulling `next/headers` into the browser bundle.
 */
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`
  )
}
