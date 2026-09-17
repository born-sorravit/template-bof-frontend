# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start (requires a prior build)
npm run lint    # bare `eslint`, relying on flat-config discovery in eslint.config.mjs
```

No test framework is configured — no runner, no test files, no `test` script. Type checking happens
through `next build` and the TS language server (`tsconfig.json` sets `"noEmit": true`); there is no
standalone `typecheck` script.

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 + shadcn/ui, in a flat layout — `app/`, `components/`,
and `lib/` all sit at the repo root, and `@/*` maps to the repo root, not to `src/`.

### Next.js 16 specifics

Per `AGENTS.md`, read the relevant guide under `node_modules/next/dist/docs/` before writing
Next.js code — this version's APIs differ from older ones.

`AGENTS.md` is only partly machine-owned: `next dev` (via
`node_modules/next/dist/server/lib/generate-agent-files.js`) manages just the text between
`<!-- BEGIN:nextjs-agent-rules -->` and `<!-- END:nextjs-agent-rules -->`. Anything outside those
markers survives, and this file — `CLAUDE.md` — is left alone entirely as long as `AGENTS.md` holds
that block, so it is safe to edit freely.

Route components use Next 16's route-type helpers instead of hand-written prop types.
`LayoutProps<'/route'>` and `PageProps<'/route'>` are **globally available — no import required** —
with `params`, `searchParams`, and named slots inferred from the directory structure.
`app/layout.tsx` already uses `LayoutProps<"/">`. `tsconfig.json` includes `.next/types` and
`.next/dev/types` so these resolve. `params` and `searchParams` are Promises — `await` them.

### Tailwind v4 — there is no `tailwind.config.*`

All theme configuration lives in `app/globals.css`:

- `@import "tailwindcss"`, `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"`
- `@custom-variant dark (&:is(.dark *))` — dark mode is class-based, driven by a `.dark` ancestor
- `@theme inline { ... }` maps Tailwind utility names onto the CSS variables
- `:root` / `.dark` blocks hold the actual oklch values (zinc base color) and `--radius`

To add or change a design token, edit both the `@theme inline` mapping and the `:root` / `.dark`
values. `components.json` intentionally sets `"tailwind.config": ""`.

Fonts are wired in `app/layout.tsx`: Inter drives `--font-sans` (and therefore `--font-heading`),
Geist Mono drives `--font-mono`.

### shadcn/ui here is built on Base UI, not Radix

`components.json` uses the `base-nova` style, so generated components import from `@base-ui/react/*`
(see `components/ui/button.tsx`). Consequences:

- Use Base UI's **`render` prop** for custom triggers — **`asChild` does not exist** here.
- Variants are `class-variance-authority` `cva` definitions exported alongside the component
  (e.g. `buttonVariants`).
- Add components with `npx shadcn@latest add <name>` rather than hand-writing them; they land in
  `components/ui/`. Only `button.tsx` exists so far.

A project-local shadcn skill is installed at `.claude/skills/shadcn` (symlink →
`.agents/skills/shadcn`, pinned in `skills-lock.json`). It carries the enforced styling, forms, and
composition rules — consult it before writing UI, and prefer its rules over general shadcn habits.

### `cn`

`lib/utils.ts` is `export { cn } from "cn"` — `cn` is the standalone npm package (from the
shadcn-ui org, a compiled drop-in replacement for `clsx` + `tailwind-merge`), not the usual local
helper. It still resolves Tailwind class conflicts. Import it from `@/lib/utils` in app code;
shadcn-generated components import it directly from `"cn"`, which is equivalent.

## Template scaffolding

`app/page.tsx` is still create-next-app boilerplate and uses raw palette classes (`bg-zinc-50`,
`text-black`, manual `dark:` overrides) that conflict with the shadcn rule of using semantic tokens
(`bg-background`, `text-muted-foreground`). Replace it rather than extend it, and use semantic
tokens in new code.
