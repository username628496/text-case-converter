---
phase: quick
plan: 260320-k1c
subsystem: seo
tags: [domain-migration, seo, sitemap, robots, hreflang, i18n]

requires: []
provides:
  - All SEO-critical URLs (canonical, hreflang, JSON-LD, sitemap, robots) pointing to convertcase.uk
  - Correct Vietnamese language label with Unicode diacritics in en.json
affects: [seo, sitemap, robots, tool-pages, homepage]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - src/lib/tool-seo.ts
    - src/app/sitemap.ts
    - src/app/robots.ts
    - src/app/[locale]/page.tsx
    - messages/en.json

key-decisions:
  - "Domain migrated from textcaseconverter.com to convertcase.uk across all SEO outputs"
  - "Vietnamese language switcher label corrected to Tiếng Việt with proper Unicode diacritics"

patterns-established: []

requirements-completed: []

duration: 3min
completed: 2026-03-20
---

# Quick Task 260320-k1c: Update All Hardcoded Domain References Summary

**Domain migration from textcaseconverter.com to convertcase.uk across all SEO outputs (canonical, hreflang, JSON-LD, sitemap, robots.txt) plus Vietnamese label diacritic fix**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-20
- **Completed:** 2026-03-20
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Replaced textcaseconverter.com with convertcase.uk in all 4 source files containing BASE_URL or domain literals
- Fixed Vietnamese language switcher label from "Tieng Viet" to "Tiếng Việt" in messages/en.json
- Confirmed next build exits 0 with no errors after all changes

## Task Commits

1. **Tasks 1 & 2: Replace all domain references, fix translation, build verification** - `d2b6ea6` (chore)

## Files Created/Modified

- `src/lib/tool-seo.ts` - BASE_URL updated to https://convertcase.uk (used by all tool page metadata and JSON-LD)
- `src/app/sitemap.ts` - BASE_URL updated to https://convertcase.uk
- `src/app/robots.ts` - Sitemap URL updated to https://convertcase.uk/sitemap.xml
- `src/app/[locale]/page.tsx` - BASE_URL updated to https://convertcase.uk
- `messages/en.json` - common.languageSwitcher.vi corrected to "Tiếng Việt"

## Decisions Made

None - followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Self-Check: PASSED

- d2b6ea6 verified in git log
- All 5 modified files confirmed updated
- grep confirms zero textcaseconverter.com references in src/ and messages/
- next build exits 0

---
*Phase: quick*
*Completed: 2026-03-20*
