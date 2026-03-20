---
phase: 05-visual-foundation
plan: 01
subsystem: ui
tags: [next/font, google-fonts, css-variables, tailwind, inter, jetbrains-mono, mint-palette]

# Dependency graph
requires: []
provides:
  - Inter + JetBrains Mono fonts loaded with vietnamese subsets
  - Mint green color palette CSS variables (--background, --card, --popover, --sidebar)
  - CSS variable mappings --font-sans and --font-mono pointing to new fonts
affects:
  - 05-visual-foundation (all subsequent plans inherit these tokens)
  - All components using bg-background, font-sans, font-mono, card surface colors

# Tech tracking
tech-stack:
  added: [inter (next/font/google), jetbrains-mono (next/font/google)]
  patterns: [CSS variable token architecture, mint color palette as design foundation]

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/globals.css

key-decisions:
  - "Use Inter (not Geist) as the sans-serif font with vietnamese subset for full language support"
  - "Use JetBrains Mono (not Geist Mono) as the monospace font with vietnamese subset"
  - "Body background (#e8f5f2 light / #0f1a17 dark) set via --background token; card surfaces kept white in light mode (oklch(1 0 0)) and mint-dark (#162520) in dark mode"

patterns-established:
  - "Font variables: --font-inter and --font-jetbrains-mono on <html>, mapped to --font-sans and --font-mono in @theme inline"
  - "Mint palette: page body uses --background, card/popover/sidebar surfaces use --card"

requirements-completed: [TYPO-01, SURF-01, SURF-02, SURF-03]

# Metrics
duration: 5min
completed: 2026-03-20
---

# Phase 5 Plan 1: Visual Foundation — Font and Color Tokens Summary

**Inter + JetBrains Mono with vietnamese subsets replace Geist fonts; mint green (#e8f5f2 / #0f1a17) body palette and white (#fff) / #162520 card surfaces established via CSS variable tokens**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-20T14:13:00Z
- **Completed:** 2026-03-20T14:18:11Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Replaced Geist/Geist_Mono with Inter/JetBrains_Mono including vietnamese character subset support
- Updated `@theme inline` font mappings to point to new CSS variables (--font-inter, --font-jetbrains-mono)
- Set `:root --background` to mint green `#e8f5f2` — page body is now mint in light mode
- Set `.dark --background` to `#0f1a17`, `.dark --card/--popover/--sidebar` to `#162520`
- Preserved all other CSS tokens unchanged; build passes cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Swap Geist fonts to Inter + JetBrains Mono in root layout** - `cb81f1f` (feat)
2. **Task 2: Update globals.css color variables and font mappings for mint palette** - `284e81f` (feat)

## Files Created/Modified
- `src/app/layout.tsx` - Inter + JetBrains_Mono font imports with --font-inter and --font-jetbrains-mono CSS variables; vietnamese subsets added; zero Geist references
- `src/app/globals.css` - @theme inline font mappings updated; :root --background set to #e8f5f2; .dark background/card/popover/sidebar set to mint-dark hex values

## Decisions Made
- Inter with vietnamese subset chosen for both English and Vietnamese language support (matches the SEO dual-language strategy)
- JetBrains Mono with vietnamese subset for monospace display in converter outputs
- `:root --card` kept as `oklch(1 0 0)` (white) for SURF-03 compliance — card surfaces are white in light mode
- `--color-bg-page`, `--color-border-brand`, `--color-navy` in `:root` preserved unchanged

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Font and color token foundation is complete; all subsequent plans in phase 05 can rely on these tokens
- Plan 05-02 (layout chrome, header, nav) and 05-03 (base64 tool visual update) will inherit these variables automatically via Tailwind CSS variable mapping

---
*Phase: 05-visual-foundation*
*Completed: 2026-03-20*
