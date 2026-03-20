---
phase: 06-component-fixes-content
plan: 02
subsystem: ui
tags: [next-intl, i18n, react, server-component, tailwind]

# Dependency graph
requires:
  - phase: 05-visual-foundation
    provides: "Mint palette tokens, CSS variables, radius system, font setup"
  - phase: 06-component-fixes-content
    provides: "CASE_MODES export from case-transforms.ts, Badge and Card UI components"
provides:
  - "HowItWorksSection Server Component with 7 mode cards in 2-column grid"
  - "howItWorks i18n namespace in EN and VI with descriptions and before/after examples"
  - "Homepage composition updated: HowItWorksSection between ToolPage and ToolCards"
affects:
  - seo
  - homepage

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server Component receiving i18n props from page (no 'use client')"
    - "tHowItWorks.raw('modes') for extracting i18n object map"
    - "Badge with inline style={{ backgroundColor: mode.color }} for dynamic colors"

key-files:
  created:
    - src/components/how-it-works-section.tsx
  modified:
    - messages/en.json
    - messages/vi.json
    - src/app/[locale]/page.tsx

key-decisions:
  - "HowItWorksSection is a Server Component (no 'use client') receiving translations as props"
  - "Badge colors driven by CASE_MODES[n].color for consistency with mode tabs"
  - "7th card sits at half-width left-aligned (no col-span treatment) — natural grid flow"
  - "Mint tint background #f0faf8 (light) / #1a2f28 (dark) from CONTEXT.md palette"
  - "Section placed between ToolPage and ToolCards per CONTEXT.md composition order"

patterns-established:
  - "Pattern: pass tHowItWorks.raw('modes') as Record<string, ModeContent> to avoid per-key translation calls"

requirements-completed: [CONT-01, CONT-02, CONT-03]

# Metrics
duration: 3min
completed: 2026-03-20
---

# Phase 6 Plan 02: How It Works Section Summary

**New HowItWorksSection component with 7 mode cards in 2-column grid, badge colors from CASE_MODES, monospace before/after examples, and full EN+VI translations with idiomatic Vietnamese diacritics**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-20T15:24:32Z
- **Completed:** 2026-03-20T15:28:10Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added `howItWorks` i18n namespace to EN and VI with 7 mode descriptions and before/after examples
- Created `HowItWorksSection` Server Component with 2-column grid, colored badges, descriptions, and monospace examples
- Wired into homepage between ToolPage and ToolCards; build passes cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Add i18n content for 7 mode descriptions and examples** - `2a9083c` (feat)
2. **Task 2: Create HowItWorksSection component and wire into homepage** - `01b078d` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `src/components/how-it-works-section.tsx` - New Server Component: 2-column grid of 7 mode cards with badges, descriptions, monospace before/after
- `messages/en.json` - Added `howItWorks` namespace with 7 mode entries (name, description, before, after)
- `messages/vi.json` - Added `howItWorks` namespace with idiomatic Vietnamese translations and proper diacritics
- `src/app/[locale]/page.tsx` - Import + use HowItWorksSection, tHowItWorks translator, howItWorksModes extraction

## Decisions Made

- HowItWorksSection is a Server Component (no 'use client') — translations are passed as props from the page, consistent with existing pattern
- Badge colors driven by `CASE_MODES[n].color` via inline `style={{ backgroundColor }}` for exact match with mode tabs
- 7th card (inverse) sits at half-width naturally — no col-span treatment needed per CONTEXT.md
- `tHowItWorks.raw('modes')` used to extract the entire modes object map, consistent with `tFaq.raw('items')` pattern already established

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage now has self-explanatory mode cards for new visitors
- SEO content for 7 modes present in both EN and VI
- Phase 06 execution complete

---
*Phase: 06-component-fixes-content*
*Completed: 2026-03-20*
