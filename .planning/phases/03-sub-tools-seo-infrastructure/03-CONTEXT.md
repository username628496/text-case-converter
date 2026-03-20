# Phase 3: Sub-Tools + SEO Infrastructure - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Four priority sub-tools (Reverse Text, Base64 Encode/Decode, Slug Generator, Password Generator) live at their own EN + VI URLs with full SEO treatment (generateMetadata, JSON-LD, hreflang). The sitemap is auto-generated via native `app/sitemap.ts` with hreflang alternates. `app/robots.ts` is created. Related-tools navigation is wired across all tool pages. The current `[tool]/page.tsx` placeholder is replaced with real implementations.

</domain>

<decisions>
## Implementation Decisions

### Component Architecture

- **Per-tool components**: Each tool gets its own interactive component (e.g. `ReverseTextTool`, `Base64Tool`, `SlugGeneratorTool`, `PasswordGeneratorTool`) under `src/components/tools/`
- **Dynamic dispatch in `[tool]/page.tsx`**: A `TOOL_COMPONENTS` map keyed by slug selects the right component at the page level — no conditional rendering inside a shared component
- **Reverse Text**: Own slim component — same visual structure as the case converter (textarea, copy, clear, char count) but no mode tabs. Does not reuse the existing `ToolPage` component since that has case-converter-specific logic baked in
- **Shared metadata helpers**: `buildToolMetadata(slug, locale)` and `buildToolJsonLd(slug, locale)` utility functions created and called from each tool's `page.tsx` — avoids duplicating the Phase 2 pattern across 4 pages

### Password Generator

- **Trigger**: Auto-generates a password on page load; user clicks a **Regenerate** button to get a new one
- **Controls**: Length slider/input (range 8–64, default 16) + four toggles: uppercase letters (A–Z), lowercase letters (a–z), numbers (0–9), symbols
- **Output**: One password at a time — no batch mode
- **Copy button**: Same copy-to-clipboard pattern as other tools (visual "Copied!" confirmation)
- **Stats**: Character count only (word count is not meaningful for passwords)
- Note: Password Generator diverges from the "transform input text" pattern — it has no input textarea, only controls + generated output

### Base64 Encode/Decode

- **Mode switching**: Two tabs (Encode / Decode) above the input — same tab UI pattern as the case converter
- **Layout**: Two textareas — input on top, output below (read-only). User types/pastes in the top; result appears in the bottom
- **Invalid input handling**: When in Decode mode and the input is not valid Base64, show an inline error message below the output textarea (e.g. "Invalid Base64 input") — output area goes blank
- **Stats**: Character count only — word count is not meaningful for Base64 strings

### Slug Generator

- **Vietnamese diacritics**: Transliterate to ASCII equivalents — e.g. `Tiếng Việt` → `tieng-viet`. This is the most useful behavior for the Vietnamese-speaking primary audience
- **Separator**: Hyphen only — no option for underscore. Hyphens are the SEO standard; no toggle in v1
- **Special characters**: Strip all non-alphanumeric characters (except hyphens) — e.g. `Peter's Guide` → `peters-guide`. Apostrophes, dots, @, # etc. removed entirely
- **Behavior**: Lowercase entire output; collapse multiple consecutive hyphens into one; trim leading/trailing hyphens
- **Stats**: Output character count only

### Sitemap & Robots

- **`app/sitemap.ts`**: Native Next.js 16 sitemap generation (no `next-sitemap` package — already decided as out-of-scope). Must include all tool pages (EN + VI) with `alternates.languages` hreflang entries per URL
- **`app/robots.ts`**: Standard crawl directives; references the sitemap URL

### Claude's Discretion

- Exact character/symbol set for the password generator's "symbols" toggle
- Vietnamese transliteration lookup table / library choice (can use a lightweight utility or hand-roll a map for common Vietnamese characters)
- Exact error message copy for invalid Base64 input (EN + VI)
- FAQ question/answer copy for each sub-tool (within the 4–6 item, topic-covering constraint from Phase 2)
- Placement of the Regenerate button in the Password Generator UI

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Next.js 16 — Sitemap and Metadata
- `node_modules/next/dist/docs/01-app/` — App Router docs for the installed version (Next.js 16.2.0). Verify `sitemap.ts` and `robots.ts` API signatures, `alternates.languages` format, and `generateStaticParams` before writing. Do NOT use web docs — breaking changes from 14/15.

### next-intl v4
- Verify `getTranslations()` usage in Server Components against `node_modules/next-intl/` — v4 API. `useTranslations()` for Client Components; `getTranslations()` for async/Server contexts.

### Project Requirements
- `.planning/REQUIREMENTS.md` §Sub-Tools — TOOL-01, TOOL-02, TOOL-03, TOOL-04, TOOL-05 (sub-tool UX requirements)
- `.planning/REQUIREMENTS.md` §SEO — SEO-03 (sitemap), SEO-04 (robots)

### Established Patterns (Phase 2 templates)
- `src/app/[locale]/page.tsx` — `generateMetadata()` with `await params` pattern; JSON-LD via `<JsonLd>` component; hreflang via `alternates.languages` — use this as the template for all 4 sub-tool pages
- `src/components/tool-page.tsx` — Reference for UI structure (textarea, toolbar, copy/clear, char count, mode tabs) but do NOT reuse directly — each sub-tool gets its own component
- `src/components/faq-section.tsx` — Reuse for FAQ on all sub-tool pages
- `src/components/tool-cards.tsx` — Reuse `RelatedTools` for related-tools navigation on all sub-tool pages
- `src/components/json-ld.tsx` — Reuse `<JsonLd>` component

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/faq-section.tsx` — FAQ section component, reuse on all sub-tool pages
- `src/components/tool-cards.tsx` — `RelatedTools` component, reuse on all sub-tool pages
- `src/components/json-ld.tsx` — JSON-LD script injector, reuse on all sub-tool pages
- `src/lib/tools.ts` — `getToolBySlug()`, `getToolSlugs()`, `relatedSlugs` field — drives routing, related tools, and generateStaticParams
- `src/app/[locale]/[tool]/page.tsx` — Current placeholder; this file gets replaced with the dynamic dispatch pattern

### Established Patterns
- **React Compiler enabled** — do NOT add manual `useMemo`/`useCallback` in Client Components
- **Tailwind v4** via `@tailwindcss/postcss` — use v4 syntax; custom CSS properties in `globals.css`
- **No shadcn, no icon library** — plain Tailwind utility classes only (existing `tool-page.tsx` uses shadcn `Card`, `Button`, `Badge` etc. — note this may contradict the "no shadcn" rule; verify before writing new components)
- **Server Components by default** — `'use client'` only on interactive tool components
- **`setRequestLocale(locale)`** at top of all async page/layout components

### Integration Points
- `src/app/[locale]/[tool]/page.tsx` — Replace placeholder with dynamic TOOL_COMPONENTS dispatch + generateMetadata + JSON-LD + FAQ + RelatedTools
- `src/app/sitemap.ts` — New file at `src/app/sitemap.ts` (not inside `[locale]`)
- `src/app/robots.ts` — New file at `src/app/robots.ts`
- `messages/en.json` + `messages/vi.json` — Add translation keys for each sub-tool: name, description, placeholder, FAQ items, HowTo steps, SEO title/description — one namespace per tool

</code_context>

<specifics>
## Specific Ideas

- Base64 two-textarea layout was explicitly confirmed: input on top, output below (read-only) — not the same single-textarea-transforms-in-place pattern as the case converter
- Slug Generator transliteration example confirmed: `Cà phê Việt Nam` → `ca-phe-viet-nam`
- Password Generator auto-generates on load — page should never show an empty output state

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-sub-tools-seo-infrastructure*
*Context gathered: 2026-03-20*
