---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: UI Polish
status: defining_requirements
stopped_at: "Milestone v1.1 started"
last_updated: "2026-03-20"
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-20)

**Core value:** Fast, accurate text tools on SEO-optimized pages that rank for both English and Vietnamese search queries
**Current focus:** Defining requirements for v1.1 UI Polish

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-03-20 — Milestone v1.1 started

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
| Phase 02-core-case-converter P04 | 15min | 2 tasks | 1 files |
| Phase 03-sub-tools-seo-infrastructure P01 | 10min | 2 tasks | 7 files |
| Phase 03-sub-tools-seo-infrastructure P03-03 | 1min | 2 tasks | 2 files |
| Phase 03-sub-tools-seo-infrastructure P02 | 3min | 2 tasks | 8 files |
| Phase 03 P04 | 2min | 1 tasks | 0 files |
| Phase 03-sub-tools-seo-infrastructure P04 | 5min | 2 tasks | 0 files |
| Phase 04-launch-readiness P01 | 7min | 2 tasks | 5 files |
| Phase 04 P02 | 5min | 2 tasks | 1 files |

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
- [Phase 02-core-case-converter]: generateMetadata with await params pattern established as template for all future tool pages (Next.js 16 params-as-Promise)
- [Phase 02-core-case-converter]: tFaq.raw('items') used for next-intl v4 array access from JSON translation messages
- [Phase 03]: apostrophe stripping in generateSlug: apostrophes removed silently, other non-alphanumeric chars become hyphens
- [Phase 03]: base64Decode returns union type for type-safe error discrimination in components
- [Phase 03]: generatePassword defaults to lowercase when all toggles disabled — ensures valid output always returned
- [Phase 03]: sitemap.ts at app root generates xhtml:link hreflang entries via alternates.languages; confirmed against Next.js 16 docs
- [Phase 03]: Both sitemap.ts and robots.ts render as static pages — no dynamic data dependencies
- [Phase 03-sub-tools-seo-infrastructure]: t.raw('howto') used instead of try/catch t('howto.step4') — next-intl v4 throws MISSING_MESSAGE during SSG even inside try/catch; raw() avoids the throw
- [Phase 03-sub-tools-seo-infrastructure]: i18nNamespace field added to Tool interface to drive getTranslations namespace selection in buildToolMetadata and buildToolJsonLd
- [Phase 03]: Build verification only — all prior plans delivered correct code with no integration issues
- [Phase 03-sub-tools-seo-infrastructure]: Build verification only — all prior plans delivered correct code with no integration issues
- [Phase 03-sub-tools-seo-infrastructure]: Human verification approved: all 4 tools, VI locale, sitemap, robots, and related-tools links confirmed working
- [Phase 04-launch-readiness]: Production deployment is stale (Phase 1 code) — Vercel was not auto-triggered after Phase 3; deploy required before launch
- [Phase 04-launch-readiness]: CWV PASS on Phase 1 production build (97%/99% perf); scores expected to hold after Phase 3 deploy due to identical SSG architecture
- [Phase 04-launch-readiness]: Hreflang and sitemap code verified correct in local build; production failures are deployment gap not code bugs
- [Phase 04]: Production deployment was stale (Phase 1 code on Vercel) — git push to main triggered fresh deploy; all 9 quality gates passed post-deploy without code changes

### Pending Todos

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260320-k1c | Update domain to convertcase.uk, fix VI language label | 2026-03-20 | d2b6ea6 | [260320-k1c-update-all-hardcoded-domain-references-f](.planning/quick/260320-k1c-update-all-hardcoded-domain-references-f/) |

### Blockers/Concerns

- [Phase 1 risk RESOLVED]: next-intl v4 proxy.ts signature verified — default export createMiddleware(routing) is correct for v4.8.3
- [Phase 1 risk]: Deploy preview build at end of Phase 1 to validate locale routing on Vercel before Phase 2 begins (local dev does not catch proxy misconfiguration)
- [Phase 3 risk]: Verify native app/sitemap.ts hreflang output format against Google requirements — confirm xhtml:link entries are correctly formed in generated XML with an actual build

## Session Continuity

Last session: 2026-03-20T07:25:37.651Z
Stopped at: Completed quick task 260320-k1c: Update domain to convertcase.uk, fix VI language label
Resume file: None
