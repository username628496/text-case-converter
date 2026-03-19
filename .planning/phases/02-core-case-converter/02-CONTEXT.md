# Phase 2: Core Case Converter - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

A fully functional 7-mode case converter at `/` (EN) and `/vi/` (VI), with complete SEO metadata (generateMetadata, JSON-LD SoftwareApplication + HowTo, hreflang) that serves as the validated template for all subsequent tool pages. This phase builds the interactive ToolPage component, upgrades the site nav to the full dropdown structure, and adds FAQ + Related Tools sections below the tool.

</domain>

<decisions>
## Implementation Decisions

### Case Conversion Semantics

- **Sentence case**: Lowercase entire input first, then capitalise the first letter after each sentence-ending punctuation mark (`.`, `!`, `?`). Multi-sentence input (e.g. "HELLO WORLD. HOW ARE YOU?") → "Hello world. How are you?"
- **Alternating case**: Every character alternates — first char lowercase, each subsequent flips. "Hello" → "hElLo". Matches the tab badge label `aA`.
- **Title Case**: AP/Chicago style — skip common short words (`a`, `an`, `the`, `of`, `in`, `and`, `or`, `but`, `for`, `nor`) unless they are the first word in the string. Every other word gets a capital.
- **Inverse case**: Flip each letter's case (A→a, a→A). Numbers, symbols, and spaces are left unchanged. "Hello World 123" → "hELLO wORLD 123"
- **lower case / UPPER CASE**: Standard — no edge case handling needed beyond built-in JS `toLowerCase()` / `toUpperCase()`.
- **Capitalized Case**: Every word's first letter capitalised, rest lowercased (simpler than Title Case — no skip list).

### FAQ & HowTo Content

- **FAQ count**: 4–6 items. Topics: what is case conversion, how to use the tool, brief per-mode descriptions (can group modes), why case matters for writing/SEO.
- **HowTo schema steps**: 3–4 sequential steps describing how to use the tool: 1) Type or paste text into the textarea, 2) Select a case mode tab, 3) Text converts instantly, 4) Click Copy to copy to clipboard.
- **i18n**: Full EN + VI translation for all FAQ content in Phase 2. VI copy follows the ASCII approximation pattern established in Phase 1 (diacritics deferred).

### Related Tools Section

- **Render links to future pages** in Phase 2 — `/reverse-text/` and `/slug-generator/` will return 404 until Phase 3, but the widget renders from day one using `relatedSlugs` from the tool registry. No "coming soon" state needed.
- **Count**: Show exactly what `relatedSlugs` defines in the registry — for the homepage case-converter that's 2 tools (reverse-text, slug-generator).

### Claude's Discretion

- Exact FAQ question/answer copy (within the 4–6 item constraint and topic areas above)
- Vietnamese translation of FAQ and HowTo content (accuracy within Phase 1 approximation pattern)
- Nav dropdown open/close mechanism on mobile (CSS hover or minimal client-side toggle)
- og:image static file content (only the path `/og/text-case-converter.png` is required in metadata — actual image file can be a placeholder 1200×630 PNG)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### UI Design Contract (primary visual/interaction reference)
- `.planning/phases/02-core-case-converter/02-UI-SPEC.md` — Approved design contract: component inventory with exact Tailwind classes, color system, typography scale, spacing, interaction states, accessibility contract, SEO components table, copywriting contract. This is the source of truth for all visual decisions.

### Project Requirements
- `.planning/REQUIREMENTS.md` §Core Tool — CORE-01 through CORE-08 (case converter UX requirements)
- `.planning/REQUIREMENTS.md` §SEO — SEO-01, SEO-02 (metadata and JSON-LD requirements)
- `.planning/REQUIREMENTS.md` §Internationalization — I18N-04 (hreflang requirement)

### Next.js 16 (installed version — breaking changes from training data)
- `node_modules/next/dist/docs/01-app/` — App Router docs for the installed version (Next.js 16.2.0). Verify `generateMetadata()` signature, `generateStaticParams()`, and Server/Client Component boundaries before writing.

### next-intl v4
- Verify `getTranslations()` and `useTranslations()` usage against `node_modules/next-intl/` — v4 API differs from v3 training data. `useTranslations()` is for Client Components; `getTranslations()` is for Server Components/async contexts.

### Existing Foundation
- `src/app/[locale]/layout.tsx` — Layout with AdSense slots already in place. ToolPage renders inside `<main class="flex-1 min-w-0">` only. Do not add max-width or ad slots inside the page component.
- `src/lib/tools.ts` — Tool registry. `relatedSlugs` drives the Related Tools section. `isHomepage: true` identifies the case-converter as the homepage tool.
- `messages/en.json` — Existing translation namespaces: `common`, `tools`, `layout`, `home`. Phase 2 adds new keys under existing or new namespaces for the tool UI, FAQ, and related tools.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/[locale]/layout.tsx` — Three-column layout with AdSense placeholder slots already wired. Phase 2 only needs to replace the placeholder `page.tsx` content with the real ToolPage.
- `src/lib/tools.ts` — `getHomepageTool()` and tool registry ready to use. `relatedSlugs` field drives Related Tools component.
- `messages/en.json` / `messages/vi.json` — Translation infrastructure in place. Phase 2 adds new keys; no structural changes to the i18n setup.

### Established Patterns
- **React Compiler enabled** (`reactCompiler: true` in `next.config.ts`) — do NOT add manual `useMemo`/`useCallback` in Client Components. The compiler handles this automatically.
- **Tailwind v4** via `@tailwindcss/postcss` — use v4 syntax. Custom teal color properties must be added to `src/app/globals.css` as CSS custom properties (`--color-accent`, `--color-accent-dark`, `--color-bg-page`) per UI-SPEC.
- **No shadcn, no icon library** — plain Tailwind utility classes only. No `components.json` should be created.
- **Server Components by default**, `'use client'` only where needed (ToolPage is a Client Component; FAQ, Related Tools, JSON-LD Script are Server Components).
- **`setRequestLocale(locale)`** called at the top of all async page/layout components — required for next-intl static generation.

### Integration Points
- `src/app/[locale]/page.tsx` — Replace the Phase 1 placeholder with the real homepage. Import ToolPage (Client) + FAQ + Related Tools + JSON-LD Script (Server).
- `src/app/[locale]/layout.tsx` — The basic EN/VI toggle in the header will be replaced with the full SiteNav component from the UI-SPEC (category dropdowns + locale switcher).
- `messages/en.json` + `messages/vi.json` — Add new translation keys for: textarea placeholder, tab labels, toolbar labels (Copy/Copied/Clear), char/word count format, FAQ Q&A, Related Tools heading, HowTo steps, generateMetadata values (title, description).

</code_context>

<specifics>
## Specific Ideas

- Tab labels visually demonstrate the output format — "UPPER CASE" tab is in upper case, "lower case" is lowercase, "aLtErNaTiNg" shows the alternating pattern. This is already defined in the UI-SPEC copywriting contract.
- Competitor reference: convertcase.net — tabs below textarea, similar pill style. The UI-SPEC design was modeled on this pattern.
- Count separator: centered dot (·) not a pipe (|). `{n} characters · {n} words` format.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-core-case-converter*
*Context gathered: 2026-03-20*
