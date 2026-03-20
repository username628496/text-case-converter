# Phase 1: Foundation Infrastructure - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

A working, building scaffold with correct locale routing, tool registry, and AdSense-ready layout — no visible product yet but the complete foundation for everything built in later phases. Success means locale routing works, the layout structure is in place with AdSense placeholder slots, all pages statically generate, and a Vercel deployment pipeline is wired up.

</domain>

<decisions>
## Implementation Decisions

### App Directory Structure
- Use `app/[locale]/` tree — all localized pages live under `src/app/[locale]/`
- Root layout (`src/app/layout.tsx`) is the HTML shell only (no locale-specific logic)
- Locale-aware root layout lives at `src/app/[locale]/layout.tsx`
- `generateStaticParams` exported from `[locale]/layout.tsx` returning `[{locale: 'en'}, {locale: 'vi'}]` — child pages inherit it
- Tool pages live at `src/app/[locale]/[tool]/page.tsx`
- `proxy.ts` at project root handles next-intl v4 locale routing (NOT `middleware.ts`)
- English uses clean URLs with no prefix (`/`, `/reverse-text/`); Vietnamese uses `/vi/` prefix (`/vi/`, `/vi/reverse-text/`)

### Translation Files
- Messages live at project root: `messages/en.json` and `messages/vi.json`
- Standard next-intl convention, not inside `src/`

### Tool Registry Schema
- Location: `src/lib/tools.ts`
- Each entry carries: `slug` (URL segment), `i18nKey` (translation key), `category` (grouping), `relatedSlugs` (for related-tools widget in Phase 3)
- Homepage case converter is included in the registry with `slug: 'case-converter'` and `isHomepage: true` flag — registry is the single source of truth for all tools
- Phase 1 only needs to define the registry shape and seed it with the 5 v1 tools (case-converter, reverse-text, base64-encode-decode, slug-generator, password-generator)

### Layout Anatomy
- Three-column-ish layout: header strip at top, then main content (left) + sidebar (right), then below-tool slot inside main
- AdSense placeholder slots with reserved `min-height` values:
  - Header slot: 90px (full width, above content)
  - Sidebar slot: 250px (right column, sticks to top)
  - Below-tool slot: 90px (inside main content, below the tool area)
- Sidebar collapses on mobile (hidden or stacked below main)
- Full header with site name (linking to `/`) + EN/VI language switcher — both present in Phase 1
- Language switcher toggles between `/` ↔ `/vi/` (and between equivalent tool pages in Phase 2+)

### Vercel / GitHub Setup
- Not yet connected — Vercel project needs to be created and linked to GitHub repo
- Setup method: manual via Vercel dashboard (import repo at vercel.com)
- No env vars required for Phase 1
- Push to `main` branch triggers deployment — verify the preview URL resolves correctly as Phase 1 success criterion

### Claude's Discretion
- Exact AdSense placeholder div attributes (class names, aria labels, data attributes, HTML comments)
- Exact sidebar width in CSS
- Language switcher visual style
- Any `vercel.json` if needed for headers/redirects beyond what next-intl handles

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Next.js 16 (installed version)
- `node_modules/next/dist/docs/01-app/` — App Router documentation for the installed version (NOT docs from the web — this codebase uses Next.js 16.2.0 which has breaking changes from 14/15)

### next-intl
- Verify exact proxy.ts export signature against `node_modules/next-intl/` before writing — v4 API differs from training data

### Project requirements
- `.planning/REQUIREMENTS.md` §Infrastructure — INFRA-01, INFRA-02, INFRA-03, I18N-01, I18N-02, I18N-03 are the v1 requirements for this phase

No external spec or ADR documents exist yet — requirements are fully captured above and in REQUIREMENTS.md.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/globals.css` — Tailwind v4 global styles, keep and extend
- `src/app/layout.tsx` — will be replaced with the html-shell-only version
- `src/app/page.tsx` — will be replaced with a placeholder or redirect

### Established Patterns
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`) — do NOT add manual `useMemo`/`useCallback` in Client Components
- Tailwind v4 via `@tailwindcss/postcss` — use v4 syntax (not v3 config file pattern)
- TypeScript strict mode (`tsconfig.json` default from scaffold)
- `next` 16.2.0 — NOT 14 as referenced in older planning docs; proxy.ts (not middleware.ts) is required

### Integration Points
- `next.config.ts` — may need `withNextIntl` wrapper once next-intl is installed
- `proxy.ts` — new file at project root, replaces middleware.ts for next-intl v4
- `src/app/[locale]/layout.tsx` — wraps all localized pages with `NextIntlClientProvider`

</code_context>

<specifics>
## Specific Ideas

No specific UX references for this phase — it's infrastructure. No visible product until Phase 2.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-infrastructure*
*Context gathered: 2026-03-19*
