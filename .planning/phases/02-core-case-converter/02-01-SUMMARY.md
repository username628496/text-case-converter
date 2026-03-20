---
phase: 02-core-case-converter
plan: 01
subsystem: ui
tags: [vitest, case-transforms, i18n, tailwind, next-themes, sonner, dark-mode, og-image, typescript]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure
    provides: Next.js 16 App Router, next-intl v4 locale routing, Tailwind v4 globals.css, shadcn components

provides:
  - 7 pure case transform functions (toSentenceCase, toLowerCase, toUpperCase, toCapitalizedCase, toAlternatingCase, toTitleCase, toInverseCase)
  - CASE_MODES constant with 7 entries (id, abbr, label, color) consumed by ToolPage
  - CaseMode TypeScript type
  - Vitest configured and 33 unit tests passing
  - CSS custom properties --color-bg-page, --color-border-brand, --color-navy in :root and .dark
  - ThemeProvider with defaultTheme=system enableSystem wired into root layout
  - Sonner Toaster mounted in locale layout
  - Complete EN translation namespaces: tool, faq (5 items), related, seo, howto
  - Complete VI translation namespaces with proper Unicode diacritics (no ASCII approximations)
  - OG image placeholder at public/og/text-case-converter.png (1200x630)

affects: [02-02-ToolPage, 02-03-page-assembly, 02-04-SiteNav, all downstream tool pages]

# Tech tracking
tech-stack:
  added:
    - vitest ^4.1.0 (unit test runner for TypeScript pure functions)
  patterns:
    - Pure transform functions: all 7 modes as named exports + transformText() dispatcher
    - TDD: RED (tests fail) then GREEN (implementation passes), 33 tests
    - ThemeProvider wraps root layout body; next-themes adds .dark class to html on OS dark preference
    - Sonner Toaster in locale layout; toast() calls from ToolPage work without prop drilling
    - CSS custom properties in :root and .dark blocks, referenced via var(--color-bg-page) in Tailwind v4

key-files:
  created:
    - src/lib/case-transforms.ts
    - src/lib/case-transforms.test.ts
    - vitest.config.ts
    - public/og/text-case-converter.png
  modified:
    - package.json (added test script, vitest devDependency)
    - src/app/globals.css (added 3 custom properties in :root and .dark)
    - src/app/layout.tsx (ThemeProvider wrapper, suppressHydrationWarning)
    - src/app/[locale]/layout.tsx (Toaster import and render)
    - messages/en.json (added tool, faq, related, seo, howto namespaces)
    - messages/vi.json (full rewrite with Unicode diacritics + new namespaces)

key-decisions:
  - "ThemeProvider approach for dark mode: next-themes with attribute=class defaultTheme=system enableSystem satisfies CORE-08 (OS preference) AND enables future manual toggle button in SiteNav"
  - "Vietnamese diacritics: all vi.json rewritten from ASCII approximations to proper Unicode — existing common/tools/layout/home namespaces fixed in same commit"
  - "Vitest over Jest: ESM-native, no Babel transform needed for React 19 / TypeScript project"
  - "TITLE_SKIP_WORDS exported as named const — allows downstream consumers to reference the skip list if needed"

patterns-established:
  - "Pattern 1: transformText(text, mode) as the single dispatch function — ToolPage imports this, not individual functions"
  - "Pattern 2: CASE_MODES array drives both tab rendering and transform dispatch — id, abbr, label, color per entry"
  - "Pattern 3: ThemeProvider in root layout body (not html) — suppressHydrationWarning on html tag"

requirements-completed: [CORE-01, CORE-02, CORE-04, CORE-08]

# Metrics
duration: 4min
completed: 2026-03-20
---

# Phase 02 Plan 01: Foundation Layer Summary

**7 pure case transform functions with 33 Vitest tests, CSS color system, ThemeProvider dark mode, Sonner Toaster, and complete EN/VI translations with proper Unicode diacritics**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-20T10:22:13Z
- **Completed:** 2026-03-20T10:26:12Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Built and tested all 7 case transform functions — 33 unit tests pass, Vitest configured with TypeScript path aliases
- Wired next-themes ThemeProvider into root layout for system-preference dark mode (satisfies CORE-08 and future toggle button)
- Rewrote vi.json entirely from ASCII approximations to proper Vietnamese Unicode diacritics; added tool/faq/related/seo/howto namespaces to both EN and VI
- Created 1200x630 OG image placeholder and mounted Sonner Toaster in locale layout

## Task Commits

Each task was committed atomically:

1. **Task 1: Case transform engine with Vitest tests** - `5e8f3eb` (feat)
2. **Task 2: CSS color system, dark mode, translations, og:image, Toaster** - `bc7bcd3` (feat)

## Files Created/Modified
- `src/lib/case-transforms.ts` - 7 pure transform functions, CASE_MODES constant, CaseMode type
- `src/lib/case-transforms.test.ts` - 33 unit tests covering all 7 modes and routing
- `vitest.config.ts` - Vitest with TypeScript path alias for @/
- `package.json` - Added "test": "vitest run" script and vitest devDependency
- `src/app/globals.css` - Added --color-bg-page, --color-border-brand, --color-navy in :root and .dark
- `src/app/layout.tsx` - ThemeProvider wrapper with suppressHydrationWarning on html
- `src/app/[locale]/layout.tsx` - Toaster import and render inside NextIntlClientProvider
- `messages/en.json` - Added tool, faq (5 items), related, seo, howto namespaces
- `messages/vi.json` - Full rewrite: fixed ASCII approximations + added all new namespaces with Unicode diacritics
- `public/og/text-case-converter.png` - 1200x630 solid-color placeholder PNG

## Decisions Made
- ThemeProvider approach (not media query change) for dark mode: `next-themes` with `attribute="class" defaultTheme="system" enableSystem` — satisfies CORE-08 via OS preference and preserves future manual toggle capability for SiteNav dark mode button
- Vitest v4 (not Jest) — ESM-native, no Babel transform needed, faster for this TypeScript project
- vi.json full rewrite in one commit — fixing ASCII approximations and adding new namespaces together avoids a partial-fix state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all steps completed cleanly. Build passes, all 33 tests pass.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `transformText()`, `CASE_MODES`, and `CaseMode` type ready for ToolPage Client Component import
- CSS custom properties available for teal color system
- ThemeProvider active — `dark:` Tailwind variants will respond to OS preference
- Toaster mounted — `toast()` calls from ToolPage will display immediately
- All EN/VI translation keys for tool UI, FAQ, SEO, HowTo confirmed valid via `npm run build`

---
*Phase: 02-core-case-converter*
*Completed: 2026-03-20*
