# Phase 5: Visual Foundation - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply Inter font (with Vietnamese subset), mint/dark color palette, and reduced border radii across the entire app. This phase establishes visual identity only — no structural component changes, no new sections or content.

</domain>

<decisions>
## Implementation Decisions

### Typography — Font Stack
- Replace Geist Sans with **Inter** (latin + vietnamese subsets) via `next/font/google`
- CSS variable: `--font-inter` assigned to `--font-sans` on `<html>` (replaces `--font-geist-sans`)
- Replace Geist Mono with **JetBrains Mono** (latin + vietnamese subsets) via `next/font/google`
- All Geist imports removed from `layout.tsx` and all Geist references removed from `globals.css`

### Typography — Sizes
- Body text: 15px (up from 14px)
- Textarea content: 15px, font-mono
- H1: text-3xl (30px), font-bold
- H2: text-xl (20px)
- Nav links: 14px
- Tool card titles: 14px font-medium; descriptions: 13px
- FAQ questions: 15px font-semibold; answers: 14px / line-height 1.7
- Stats display (chars · words · lines): 13px

### Background & Color — Light Mode
- Page body background: `#e8f5f2` (mint green)
- Surface cards, textarea containers, nav, and footer: `#ffffff`

### Background & Color — Dark Mode
- Page body background: `#0f1a17`
- Surface cards, nav, footer, and textarea: `#162520` (slightly lighter than page bg — maintains mint palette, creates visible card separation)

### Border Radii
- Primary buttons (Copy, Regenerate): 4px
- Secondary/ghost buttons: 4px
- Case mode tab pills: 4px
- Badge abbreviations (Sc, lc, UC, Cc, aC, TC, iC): 4px (from rounded-full)
- Tool cards: 6px (rounded-md)
- Textarea and input containers: 6px
- FAQ AccordionItems: 0px (square)
- Related tool chip links: 4px
- Nav item hover backgrounds: 4px

### Claude's Discretion
- CSS variable architecture for --radius (global var vs per-component overrides — components need 3 distinct radii: 0px, 4px, 6px)
- How to map #162520 to CSS variables (whether to update --card, --sidebar, or introduce new tokens)
- System font fallback stack for JetBrains Mono

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Typography & Visual Requirements
- `.planning/REQUIREMENTS.md` §TYPO — All 9 typography requirements (font, sizes, line-heights)
- `.planning/REQUIREMENTS.md` §SURF — Surface and background color requirements (SURF-01, SURF-02, SURF-03)
- `.planning/REQUIREMENTS.md` §SHAPE — All 9 border radius requirements (SHAPE-01 through SHAPE-09)

### Current Implementation
- `src/app/globals.css` — Current CSS variables (note: `--color-bg-page: #e8f5f2` already defined; `--radius: 0.625rem` needs adjustment)
- `src/app/layout.tsx` — Root layout with Geist font imports (to be replaced)
- `src/components/ui/button.tsx` — Button uses `rounded-md` (CVA-based, needs 4px override)
- `src/components/ui/tabs.tsx` — TabsTrigger uses `rounded-sm`, TabsList uses `rounded-md`
- `src/components/ui/badge.tsx` — Check for rounded-full usage
- `src/components/ui/card.tsx` — Check current radius

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/` — Full shadcn component library: button, tabs, badge, card, textarea, input, accordion. All use CSS variable `--radius` via Tailwind's radius scale. Radius changes need per-component class overrides (not just global --radius change) since 3 different values are required.
- `globals.css` — `--color-bg-page: #e8f5f2` and `--color-navy: #1a2744` already defined as custom properties. `--background` is currently white (oklch 1 0 0) and used everywhere via `bg-background`.

### Established Patterns
- Tailwind v4 with CSS variable theming — `@theme inline` maps CSS vars to Tailwind utilities
- Dark mode via `.dark` class (ThemeProvider sets class on html element)
- Shadcn components use CVA (class-variance-authority) — radius overrides should be applied via className prop at usage sites, or by updating the CVA default classes

### Integration Points
- `src/app/layout.tsx` — Root layout: font variable injection point; swap Geist → Inter + JetBrains Mono
- `src/app/globals.css` — `--background` or `--color-bg-page` controls body bg; `--card` controls surface color
- `src/app/[locale]/layout.tsx` — Locale layout: sets `bg-zinc-50` on ad slots (needs dark mode surface treatment check)
- Body currently uses `@apply bg-background text-foreground` — changing `--background` to mint would affect all bg-background uses

</code_context>

<specifics>
## Specific Ideas

No specific references or "I want it like X" moments — requirements fully specify the target visual state.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-visual-foundation*
*Context gathered: 2026-03-20*
