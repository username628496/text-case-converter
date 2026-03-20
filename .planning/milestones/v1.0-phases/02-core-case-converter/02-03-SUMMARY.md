---
phase: 02-core-case-converter
plan: 03
subsystem: ui
tags: [react, next-intl, shadcn, tailwind, sonner, lucide-react, typescript]

# Dependency graph
requires:
  - phase: 02-core-case-converter/02-01
    provides: case-transforms.ts (CASE_MODES, transformText, CaseMode), CSS custom properties, translations
  - phase: 02-core-case-converter/02-02
    provides: shadcn primitives already installed, SiteNav context
provides:
  - ToolPage client component with 7 case mode tabs, toolbar, live counts, keyboard nav
  - FAQSection server component with shadcn Accordion
  - ToolCards server component 2-col card grid from tool registry
  - RelatedTools server component chip-style links from relatedSlugs
  - JsonLd server component with XSS-safe inline script
affects: [02-04-page-assembly, 03-seo-metadata]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Single-textarea input=output design: value={transformText(inputText, activeMode)}, onChange stores raw input
    - All interactive state in ToolPage client component, sub-components are Server Components
    - Server Components receive pre-translated strings as props from page.tsx (avoids next-intl client boundary)
    - React Compiler pattern: no useMemo/useCallback in client components
    - Sonner toast for copy confirmation (no isCopied state)

key-files:
  created:
    - src/components/tool-page.tsx
    - src/components/faq-section.tsx
    - src/components/tool-cards.tsx
    - src/components/json-ld.tsx
  modified: []

key-decisions:
  - "ToolPage uses useTranslations() hook (client) since NextIntlClientProvider is already in layout.tsx"
  - "FAQSection/ToolCards/RelatedTools accept pre-resolved strings as props from Server Component page — clean boundary"
  - "JsonLd uses .replace(/</g, '\\\\u003c') per Next.js 16 docs for XSS safety"
  - "Badge style prop for dynamic colors (mode.color from CASE_MODES) overrides shadcn bg-primary default"

patterns-established:
  - "Server/Client boundary: page.tsx (server) extracts translations and passes to client ToolPage via useTranslations hook; passes strings as props to server sub-components"
  - "Tool display metadata (TOOL_DISPLAY map) kept in component co-located with rendering logic"
  - "ScrollArea with explicit ScrollBar orientation=horizontal for tab scroll on mobile"

requirements-completed: [CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07]

# Metrics
duration: 1min
completed: 2026-03-20
---

# Phase 02 Plan 03: UI Components Summary

**Single-textarea ToolPage client component with 7 accessible case mode tabs, plus FAQSection, ToolCards, RelatedTools, and JsonLd server components ready for page assembly**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-20T03:29:05Z
- **Completed:** 2026-03-20T03:30:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- ToolPage interactive client component with full accessibility (role=tablist/tab, aria-selected, aria-live, sr-only Label, 44px touch targets, ArrowLeft/ArrowRight keyboard navigation)
- Copy/download/clear toolbar with Sonner toast confirmation and no isCopied state
- FAQSection, ToolCards, RelatedTools, JsonLd as Server Components with no 'use client'
- TypeScript compilation passes with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: ToolPage interactive client component** - `071f940` (feat)
2. **Task 2: FAQ, ToolCards, RelatedTools, and JsonLd components** - `05d2e0c` (feat)

## Files Created/Modified
- `src/components/tool-page.tsx` - 'use client' interactive converter: textarea, 7 mode tabs, toolbar (copy/download/clear), live stats, keyboard nav
- `src/components/faq-section.tsx` - Server Component: shadcn Accordion with aria-labelledby, receives heading+items as props
- `src/components/tool-cards.tsx` - Server Component: ToolCards (2-col card grid) + RelatedTools (chip links), both exported
- `src/components/json-ld.tsx` - Server Component: inline `<script type="application/ld+json">` with XSS-safe < escaping

## Decisions Made
- ToolPage uses `useTranslations('tool')` hook directly (NextIntlClientProvider is in layout.tsx so this works)
- FAQSection/ToolCards/RelatedTools receive fully-resolved strings as props — cleaner than calling getTranslations inside these components (page.tsx is server and can pass them down)
- Badge `style` prop for dynamic mode colors since shadcn Badge uses className-only color variants by default
- JsonLd escapes `<` to `\u003c` per Next.js 16 json-ld.md docs recommendation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All four component files exist and export correctly
- No 'use client' on FAQSection, ToolCards, RelatedTools, JsonLd
- ToolPage has 'use client' with all interactive features
- Ready for Plan 04: page assembly (page.tsx, generateMetadata, JSON-LD schema, route handlers)
- TypeScript clean: `npx tsc --noEmit` passes

---
*Phase: 02-core-case-converter*
*Completed: 2026-03-20*
