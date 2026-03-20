---
phase: 03-sub-tools-seo-infrastructure
plan: 02
subsystem: ui
tags: [next-intl, react, typescript, seo, json-ld, tailwind]

# Dependency graph
requires:
  - phase: 03-01
    provides: transform function libraries (reverseText, base64Encode/Decode, generateSlug, generatePassword) and translation keys for all 4 sub-tools

provides:
  - 4 interactive 'use client' components in src/components/tools/
  - buildToolMetadata and buildToolJsonLd shared SEO utilities in src/lib/tool-seo.ts
  - Fully rewritten [tool]/page.tsx with TOOL_COMPONENTS dispatch, generateMetadata, JSON-LD, FAQ, RelatedTools
  - RelatedTools 404 bug fixed (case-converter links now resolve to / not /case-converter/)
  - i18nNamespace field added to Tool interface; relatedSlugs populated for all 5 tools

affects: [03-03, 03-04, any future tool pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TOOL_COMPONENTS dispatch map in page.tsx keyed by slug for dynamic component selection
    - buildToolMetadata/buildToolJsonLd shared utilities called from page.tsx (not inlined)
    - t.raw('howto') used to safely access optional step4 without throwing on missing key
    - isHomepage check in RelatedTools for correct href resolution

key-files:
  created:
    - src/components/tools/reverse-text-tool.tsx
    - src/components/tools/base64-tool.tsx
    - src/components/tools/slug-generator-tool.tsx
    - src/components/tools/password-generator-tool.tsx
    - src/lib/tool-seo.ts
  modified:
    - src/app/[locale]/[tool]/page.tsx
    - src/lib/tools.ts
    - src/components/tool-cards.tsx

key-decisions:
  - "t.raw('howto') used instead of try/catch t('howto.step4') — next-intl v4 throws MISSING_MESSAGE during SSG even inside try/catch; raw() avoids the throw"
  - "isHomepage check added to RelatedTools (same logic already in ToolCards) — case-converter slug in relatedSlugs must resolve to / not /case-converter/"
  - "i18nNamespace added to Tool interface to drive getTranslations namespace selection in buildToolMetadata and buildToolJsonLd"

patterns-established:
  - "t.raw(namespace) pattern: use raw() to safely access optional/array translation keys without MISSING_MESSAGE errors during SSG"
  - "TOOL_COMPONENTS map pattern: dispatch client components by slug key in server page.tsx, notFound() if slug not in map"
  - "Shared tool page utilities: buildToolMetadata + buildToolJsonLd in tool-seo.ts keep page.tsx clean and DRY"

requirements-completed: [TOOL-01, TOOL-02, TOOL-03, TOOL-04, TOOL-05]

# Metrics
duration: 3min
completed: 2026-03-20
---

# Phase 03 Plan 02: Sub-Tool Components and Dynamic Tool Pages Summary

**4 interactive tool components with full SEO treatment on static pages: reverse text, Base64 encode/decode (with tabs and inline error), slug generator, and password generator (auto-generate on mount, length slider, 4 char-type toggles)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-20T05:13:11Z
- **Completed:** 2026-03-20T05:16:55Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- All 4 sub-tool interactive components created under src/components/tools/ with correct transform function imports, translation hooks, and UI patterns matching the homepage case converter
- Shared buildToolMetadata and buildToolJsonLd utilities created in src/lib/tool-seo.ts; [tool]/page.tsx fully rewritten with TOOL_COMPONENTS dispatch
- RelatedTools 404 bug fixed — case-converter relatedSlugs now resolve to / (EN) or /vi/ (VI) instead of /case-converter/
- next build generates all 8 tool pages (4 tools x 2 locales) as SSG with unique metadata, JSON-LD SoftwareApplication + HowTo, FAQ, and RelatedTools

## Task Commits

1. **Task 1: Create all 4 sub-tool interactive components** - `85d0ebd` (feat)
2. **Task 2: Fix RelatedTools href bug, create shared SEO utilities, rewrite [tool]/page.tsx** - `52c0ce5` (feat)

## Files Created/Modified
- `src/components/tools/reverse-text-tool.tsx` - ReverseTextTool: input textarea + read-only reversed output, char/word count, copy, clear
- `src/components/tools/base64-tool.tsx` - Base64Tool: encode/decode tabs, two textareas, inline error on invalid Base64
- `src/components/tools/slug-generator-tool.tsx` - SlugGeneratorTool: text input, read-only slug output, char count, copy, clear
- `src/components/tools/password-generator-tool.tsx` - PasswordGeneratorTool: auto-generate on mount, length range slider, 4 toggle checkboxes, regenerate button
- `src/lib/tool-seo.ts` - buildToolMetadata and buildToolJsonLd shared utilities used by [tool]/page.tsx
- `src/app/[locale]/[tool]/page.tsx` - Full rewrite: TOOL_COMPONENTS dispatch, generateMetadata calling buildToolMetadata, JSON-LD, FAQ, RelatedTools
- `src/lib/tools.ts` - Added i18nNamespace to Tool interface; populated relatedSlugs for base64 and password-generator
- `src/components/tool-cards.tsx` - Fixed RelatedTools href to use isHomepage check for case-converter

## Decisions Made
- Used `t.raw('howto')` to read optional step4 translation key rather than try/catch `t('howto.step4')` — next-intl v4 throws MISSING_MESSAGE errors during SSG even when inside try/catch blocks
- Added `i18nNamespace` field to the Tool interface to decouple namespace selection from i18nKey format and make the SEO utilities simpler

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed optional step4 throwing MISSING_MESSAGE during SSG**
- **Found during:** Task 2 (build verification)
- **Issue:** The plan's try/catch around `t('howto.step4')` does not prevent next-intl v4 from throwing MISSING_MESSAGE during static page generation. Build failed with errors for reverseText and slugGenerator (both have 3 HowTo steps, not 4).
- **Fix:** Replaced try/catch with `t.raw('howto')` to get the raw howto object, then conditionally include step4 only if the key exists in the raw object.
- **Files modified:** src/lib/tool-seo.ts
- **Verification:** `npx next build` completes with 15/15 pages, no MISSING_MESSAGE errors
- **Committed in:** 52c0ce5 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Essential fix — the plan's proposed try/catch approach does not work with next-intl v4's SSG error behavior. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 4 sub-tool pages fully functional at their EN and VI URLs
- SEO utilities (buildToolMetadata, buildToolJsonLd) established as reusable pattern for any future tool pages
- RelatedTools navigation is now correct across all pages — no dead links
- Ready for Phase 03-03 (sitemap and robots.txt) and 03-04 (final verification)

## Self-Check: PASSED
- src/components/tools/reverse-text-tool.tsx: found
- src/components/tools/base64-tool.tsx: found
- src/components/tools/slug-generator-tool.tsx: found
- src/components/tools/password-generator-tool.tsx: found
- src/lib/tool-seo.ts: found
- Commits 85d0ebd and 52c0ce5: both present in git log
- next build: 15/15 pages generated without errors

---
*Phase: 03-sub-tools-seo-infrastructure*
*Completed: 2026-03-20*
