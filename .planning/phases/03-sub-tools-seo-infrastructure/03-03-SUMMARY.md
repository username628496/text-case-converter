---
phase: 03-sub-tools-seo-infrastructure
plan: "03"
subsystem: seo
tags: [next.js, sitemap, robots, hreflang, i18n, seo]

requires:
  - phase: 03-01
    provides: tools array in src/lib/tools.ts with 5 tool entries and isHomepage flag

provides:
  - Native Next.js 16 sitemap.ts at app root generating 5 entries with EN/VI hreflang alternates
  - Native Next.js 16 robots.ts at app root allowing all crawlers and referencing sitemap URL

affects:
  - 03-04
  - search engine indexing of all tool pages

tech-stack:
  added: []
  patterns:
    - "Native Next.js MetadataRoute.Sitemap with alternates.languages for hreflang"
    - "Native Next.js MetadataRoute.Robots for robots.txt generation"

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified: []

key-decisions:
  - "sitemap.ts placed at app root (not inside [locale]) — Next.js 16 native routing serves /sitemap.xml directly"
  - "alternates.languages with en/vi keys confirmed correct per Next.js 16 sitemap docs — produces xhtml:link elements in output XML"
  - "Both sitemap.ts and robots.ts render as static (○) in build output — no dynamic data dependencies"

patterns-established:
  - "hreflang pattern: url field = EN URL as primary, alternates.languages.en = EN URL, alternates.languages.vi = VI URL"
  - "isHomepage flag drives URL shape: true -> BASE_URL/, false -> BASE_URL/slug/"

requirements-completed: [SEO-03, SEO-04]

duration: 1min
completed: 2026-03-20
---

# Phase 03 Plan 03: SEO Sitemap and Robots Infrastructure Summary

**Next.js 16 native sitemap.ts with hreflang EN/VI alternates for all 5 tools, plus robots.ts directing crawlers to sitemap URL**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-20T05:53:04Z
- **Completed:** 2026-03-20T05:54:44Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created `src/app/sitemap.ts` mapping all 5 tools (including homepage) to EN + VI URL pairs using `alternates.languages`
- Created `src/app/robots.ts` allowing all crawlers and pointing to the sitemap URL
- Verified build output confirms both `/sitemap.xml` and `/robots.txt` as static (○) routes

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sitemap.ts with hreflang alternates for all tools** - `4554cd5` (feat)
2. **Task 2: Create robots.ts with crawl directives** - `99d7480` (feat)

**Plan metadata:** (final docs commit — see below)

## Files Created/Modified

- `src/app/sitemap.ts` — Maps tools array to MetadataRoute.Sitemap entries with EN/VI hreflang alternates via `alternates.languages`
- `src/app/robots.ts` — Returns MetadataRoute.Robots allowing all crawlers, references `/sitemap.xml`

## Decisions Made

- Confirmed `alternates.languages` API via Next.js 16 docs in `node_modules/next/dist/docs/` — format unchanged from plan spec, produces correct `xhtml:link` elements
- Both files placed at `src/app/` root (not inside `src/app/[locale]/`) so Next.js serves them at top-level paths

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- SEO infrastructure complete: `/sitemap.xml` and `/robots.txt` both verified in build output
- Plan 03-04 (final wave) can proceed — sitemap and robots routes are live
- Phase 3 risk from STATE.md can be resolved: native app/sitemap.ts confirmed to generate `<xhtml:link rel="alternate" hreflang>` entries per Next.js 16 docs

---
*Phase: 03-sub-tools-seo-infrastructure*
*Completed: 2026-03-20*
