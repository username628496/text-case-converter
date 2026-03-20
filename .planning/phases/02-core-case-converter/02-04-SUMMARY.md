---
phase: 02-core-case-converter
plan: "04"
subsystem: ui
tags: [next.js, next-intl, seo, json-ld, hreflang, server-components]

# Dependency graph
requires:
  - phase: 02-core-case-converter/02-01
    provides: case-transforms, tools registry, translation messages (faq, seo, howto, tools namespaces)
  - phase: 02-core-case-converter/02-02
    provides: site layout, ThemeProvider, SiteNav
  - phase: 02-core-case-converter/02-03
    provides: ToolPage, FAQSection, ToolCards, RelatedTools, JsonLd components
provides:
  - Complete homepage at / (EN) and /vi/ (VI) with all components assembled
  - generateMetadata with locale-specific title/description, canonical URL, hreflang alternates, og:image
  - JSON-LD @graph with SoftwareApplication + HowTo schemas
  - Static generation of both EN and VI locales at build time
affects:
  - 03-remaining-tools (page.tsx assembly pattern is the template for all tool pages)
  - seo (canonical, hreflang, JSON-LD established here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - generateMetadata Server Component export with await params (Next.js 16 pattern)
    - next-intl tFaq.raw('items') for accessing JSON arrays from translation messages
    - toolNames lookup map built in Server Component, passed as props to ToolCards/RelatedTools
    - JSON-LD @graph pattern with SoftwareApplication + HowTo schemas

key-files:
  created: []
  modified:
    - src/app/[locale]/page.tsx

key-decisions:
  - "Used homepageTool (renamed from tool) as loop variable to avoid shadowing concerns with tTools namespace variable"
  - "tFaq.raw('items') used to access FAQ array from next-intl v4 — returns raw JSON array typed as Array<FAQItem>"
  - "toolNames keyed by tool.i18nKey (e.g. 'tools.caseConverter'), subKey extracted by stripping 'tools.' prefix"

patterns-established:
  - "Pattern: page.tsx is always a Server Component — no 'use client'. Client Components (ToolPage) imported as children."
  - "Pattern: generateMetadata awaits params before calling getTranslations for locale-specific metadata"
  - "Pattern: JSON-LD data built in page.tsx Server Component, passed as prop to <JsonLd /> component"
  - "Pattern: toolNames Record<string, {name, description}> built from tools registry + tTools translations in page.tsx"

requirements-completed: [SEO-01, SEO-02, I18N-04, CORE-06, CORE-07]

# Metrics
duration: 5min
completed: 2026-03-20
---

# Phase 02 Plan 04: Homepage Assembly Summary

**Complete homepage at / and /vi/ with generateMetadata hreflang, JSON-LD SoftwareApplication+HowTo, ToolPage, FAQSection, ToolCards, RelatedTools — build passes static generation for all 13 routes**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-20T03:34:00Z
- **Completed:** 2026-03-20T03:39:00Z
- **Tasks:** 1 (+ checkpoint awaiting human verify)
- **Files modified:** 1

## Accomplishments

- Replaced Phase 1 placeholder in `src/app/[locale]/page.tsx` with fully assembled Server Component
- Implemented `generateMetadata` with locale-specific SEO: title, description, canonical URL, hreflang alternates (EN+VI), og:image
- Wired all Phase 01-03 components: ToolPage (client), FAQSection, ToolCards, RelatedTools, JsonLd
- Built JSON-LD `@graph` array with SoftwareApplication + HowTo schemas populated from `howto.*` translations
- Build succeeded: all 13 routes statically generated including `/en` and `/vi`

## Task Commits

1. **Task 1: Complete page.tsx with generateMetadata and page assembly** - `944db7c` (feat)

**Plan metadata:** TBD (docs commit after checkpoint)

## Files Created/Modified

- `src/app/[locale]/page.tsx` - Complete homepage: generateMetadata with hreflang/canonical/og, ToolPage + ToolCards + FAQSection + RelatedTools + JsonLd, JSON-LD @graph with SoftwareApplication + HowTo

## Decisions Made

- Renamed loop variable from `t` to `tool` when iterating over `tools` registry to avoid potential shadowing of translation variables
- Used `tFaq.raw('items')` for FAQ array access (next-intl v4 API for non-string values)
- `toolNames` map keyed by `tool.i18nKey` (full key e.g. `'tools.caseConverter'`) for consistency with how ToolCards/RelatedTools lookup names

## Deviations from Plan

None - plan executed exactly as written. Minor rename of loop variable `t` → `tool` for clarity (not a deviation from intent).

## Issues Encountered

None. Build passed on first attempt. All 13 routes generated including both locales.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Complete homepage assembled and passing build — ready for human verification
- All Phase 2 core components wired together and functional
- SEO infrastructure (generateMetadata + JSON-LD) established as template for Phase 3 tool pages
- Awaiting checkpoint: human must verify visual correctness at http://localhost:3000/

## Self-Check: PASSED

- FOUND: src/app/[locale]/page.tsx
- FOUND: .planning/phases/02-core-case-converter/02-04-SUMMARY.md
- FOUND: commit 944db7c (feat(02-04): complete homepage page.tsx with generateMetadata and page assembly)

---
*Phase: 02-core-case-converter*
*Completed: 2026-03-20*
