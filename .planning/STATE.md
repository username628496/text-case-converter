---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
stopped_at: Completed 02-core-case-converter/02-04-PLAN.md (awaiting checkpoint human-verify)
last_updated: "2026-03-20T03:35:13.094Z"
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 6
  completed_plans: 6
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-19)

**Core value:** Fast, accurate text tools on SEO-optimized pages that rank for both English and Vietnamese search queries
**Current focus:** Phase 02 — core-case-converter

## Current Position

Phase: 02 (core-case-converter) — EXECUTING
Plan: 2 of 4

## Performance Metrics

**Velocity:**

- Total plans completed: 1
- Average duration: 2 min
- Total execution time: 0.03 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-infrastructure | 1 | 2 min | 2 min |

**Recent Trend:**

- Last 5 plans: 01-01 (2 min)
- Trend: -

*Updated after each plan completion*
| Phase 01 P02 | 5 | 1 tasks | 4 files |
| Phase 01-foundation-infrastructure P02 | 1 day | 2 tasks | 6 files |
| Phase 02-core-case-converter P01 | 4 min | 2 tasks | 10 files |
| Phase 02-core-case-converter P02 | 2 min | 2 tasks | 4 files |
| Phase 02-core-case-converter P03 | 1 min | 2 tasks | 4 files |
| Phase 02-core-case-converter P04 | 5min | 1 tasks | 1 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Use Next.js 16.2.0 — installed version is 16.2.0, NOT 14 as referenced in planning docs; proxy.ts (not middleware.ts) required for locale routing
- [Init]: No `output: 'export'` — incompatible with next-intl proxy routing on Vercel; Vercel handles SSG natively
- [Init]: Native app/sitemap.ts over next-sitemap package — superseded by built-in hreflang alternates.languages support
- [Init]: React Compiler enabled — do not add manual useMemo/useCallback in Client Components
- [01-01]: next-intl/middleware import confirmed valid for v4.8.3; ESM package requires Next.js build context — bare node -e test fails by design
- [01-01]: Default export used in proxy.ts (createMiddleware return value); named export not needed
- [01-01]: Vietnamese translations use ASCII approximations without diacritics as Phase 1 placeholders
- [Phase 01]: src/app/page.tsx deleted — with as-needed localePrefix, proxy rewrites / to [locale=en]; root page.tsx caused route conflicts
- [Phase 01]: lang attribute set to en in root layout as Phase 1 default; hreflang (Phase 3) is primary SEO locale signal
- [Phase 01-foundation-infrastructure]: proxy.ts must live in src/ for Next.js 16 — project root placement silently ignored; moved during Vercel debugging
- [Phase 01-foundation-infrastructure]: localeDetection: false set in routing.ts — as-needed prefix conflicts with Accept-Language auto-redirect on real browsers
- [Phase 02-core-case-converter]: ThemeProvider approach for dark mode: next-themes with defaultTheme=system enableSystem satisfies CORE-08 and enables future manual toggle
- [Phase 02-core-case-converter]: vi.json full rewrite: fixed ASCII approximations to proper Vietnamese Unicode diacritics in one commit
- [Phase 02-core-case-converter]: Vitest v4 (not Jest): ESM-native, no Babel needed for React 19/TypeScript
- [Phase 02-core-case-converter]: Header ad slot kept above SiteNav (not inside it) — preserves layout structure from Plan 01
- [Phase 02-core-case-converter]: resolvedTheme used (not theme) for dark mode toggle to avoid 'system' string
- [Phase 02-core-case-converter]: ToolPage uses useTranslations() hook directly since NextIntlClientProvider is already in layout.tsx
- [Phase 02-core-case-converter]: JsonLd escapes < to \u003c per Next.js 16 json-ld.md docs for XSS safety
- [Phase 02-core-case-converter]: generateMetadata with await params pattern established as template for all future tool pages
- [Phase 02-core-case-converter]: tFaq.raw('items') used for next-intl v4 array access from JSON translation messages

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1 risk RESOLVED]: next-intl v4 proxy.ts signature verified — default export createMiddleware(routing) is correct for v4.8.3
- [Phase 1 risk]: Deploy preview build at end of Phase 1 to validate locale routing on Vercel before Phase 2 begins (local dev does not catch proxy misconfiguration)
- [Phase 3 risk]: Verify native app/sitemap.ts hreflang output format against Google requirements — confirm xhtml:link entries are correctly formed in generated XML with an actual build

## Session Continuity

Last session: 2026-03-20T03:35:13.091Z
Stopped at: Completed 02-core-case-converter/02-04-PLAN.md (awaiting checkpoint human-verify)
Resume file: None
