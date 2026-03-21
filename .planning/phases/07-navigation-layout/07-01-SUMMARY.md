---
phase: 07-navigation-layout
plan: 01
subsystem: ui
tags: [react, next.js, server-component, layout, composition]

requires:
  - phase: 06-component-fixes-content
    provides: "Working tool pages with FAQSection, RelatedTools, HowItWorksSection, ToolCards components"

provides:
  - "ToolPageLayout Server Component enforcing tool-area -> belowTool (optional) -> faqSection -> relatedTools -> jsonLd section order"
  - "Homepage and sub-tool pages refactored to use ToolPageLayout as return wrapper"

affects:
  - "07-navigation-layout future plans"
  - "Any new tool pages added to the app"

tech-stack:
  added: []
  patterns:
    - "Composition via named prop slots (toolArea, belowTool, faqSection, relatedTools, jsonLd) rather than render props or children"
    - "space-y-8 for section spacing instead of margins to avoid margin collapse"

key-files:
  created:
    - src/components/tool-page-layout.tsx
  modified:
    - src/app/[locale]/page.tsx
    - src/app/[locale]/[tool]/page.tsx

key-decisions:
  - "ToolPageLayout uses named prop slots (not children) to enforce strict section ordering across all 5 tool pages"
  - "space-y-8 chosen over mt-* margins to eliminate margin collapse issues identified in RESEARCH.md"
  - "belowTool prop is optional — homepage passes HowItWorksSection+ToolCards fragment; sub-tool pages omit it"
  - "Server Component (no use client) — only renders children, no interactivity, React Compiler handles memoization"

patterns-established:
  - "Shared layout wrapper: all tool pages must wrap their return in ToolPageLayout"
  - "Section order contract: toolArea -> belowTool (optional) -> faqSection -> relatedTools -> jsonLd"

requirements-completed: [LAYOUT-01]

duration: 2min
completed: 2026-03-21
---

# Phase 07 Plan 01: Navigation Layout Summary

**ToolPageLayout Server Component with named prop slots enforces identical section ordering and space-y-8 spacing across all 5 tool pages (homepage + 4 sub-tools)**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-21T10:19:46Z
- **Completed:** 2026-03-21T10:21:06Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `src/components/tool-page-layout.tsx` as a Server Component with named prop slots (toolArea, belowTool, faqSection, relatedTools, jsonLd)
- Applied ToolPageLayout to homepage — belowTool carries HowItWorksSection + ToolCards fragment
- Applied ToolPageLayout to all 4 sub-tool pages — no belowTool prop (sub-tools don't have those sections)
- npm run build passes: all 10 locale pages (5 EN + 5 VI) generate without error

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ToolPageLayout component** - `1c8c4d4` (feat)
2. **Task 2: Apply ToolPageLayout to homepage and sub-tool pages** - `44a9ad2` (feat)

## Files Created/Modified

- `src/components/tool-page-layout.tsx` - Shared layout wrapper enforcing section ordering via named props; space-y-8 outer container; Server Component
- `src/app/[locale]/page.tsx` - Homepage return refactored from plain div to ToolPageLayout with toolArea/belowTool/faqSection/relatedTools/jsonLd
- `src/app/[locale]/[tool]/page.tsx` - Sub-tool return refactored to ToolPageLayout with toolArea/faqSection/relatedTools/jsonLd (no belowTool)

## Decisions Made

- Named prop slots chosen over children composition to make section ordering explicit and statically verifiable
- `space-y-8` on the outer div rather than margin utilities — avoids first-child/last-child margin collapse edge cases
- `belowTool` is optional (`?`) so the same component serves both homepage and sub-tool page shapes without conditional renders in the wrapper

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ToolPageLayout is in place as the single layout contract for all tool pages
- Ready for 07-02 and 07-03 plans that may add navigation or other shared layout elements
- Any new tool pages added in future must use ToolPageLayout to maintain section ordering

---
*Phase: 07-navigation-layout*
*Completed: 2026-03-21*
