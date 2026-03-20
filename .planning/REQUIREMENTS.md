# Requirements: Text Case Converter

**Defined:** 2026-03-20
**Core Value:** Fast, accurate text tools on SEO-optimized pages that rank for both English and Vietnamese search queries

## v1.1 Requirements

Requirements for the UI Polish milestone. Each maps to roadmap phases.

### TYPO — Typography

- [ ] **TYPO-01**: Inter font from `next/font/google` (latin + vietnamese subsets) replaces Geist Sans; applied as `--font-inter` CSS variable to body; all Geist references removed from layout.tsx and globals.css
- [ ] **TYPO-02**: Body text increases to 15px (from text-sm/14px)
- [ ] **TYPO-03**: Textarea content uses 15px, font-mono
- [ ] **TYPO-04**: H1 headings use text-3xl (30px) font-bold (from text-2xl)
- [ ] **TYPO-05**: H2 section headings use text-xl (20px) (from text-lg)
- [ ] **TYPO-06**: Nav links use 14px (from 13px)
- [ ] **TYPO-07**: Tool card titles use 14px font-medium; descriptions use 13px
- [ ] **TYPO-08**: FAQ questions use 15px font-semibold; answers use 14px / line-height 1.7
- [ ] **TYPO-09**: Stats display (chars · words · lines) uses 13px

### SURF — Background & Colors

- [ ] **SURF-01**: Light mode page body background is #e8f5f2 (mint green)
- [ ] **SURF-02**: Dark mode page body background is #0f1a17
- [ ] **SURF-03**: Surface cards, textarea containers, nav, and footer use white (#fff) in light mode

### SHAPE — Border Radius

- [ ] **SHAPE-01**: Primary buttons (Copy, Regenerate) use 4px border radius
- [ ] **SHAPE-02**: Secondary/ghost buttons use 4px border radius
- [ ] **SHAPE-03**: Case mode tab pills use 4px border radius
- [ ] **SHAPE-04**: Badge abbreviations (Sc, lc, UC, Cc, aC, TC, iC) use 4px border radius (from rounded-full)
- [ ] **SHAPE-05**: Tool cards use 6px border radius (rounded-md)
- [ ] **SHAPE-06**: Textarea and input containers use 6px border radius
- [ ] **SHAPE-07**: FAQ AccordionItems use 0px border radius (square)
- [ ] **SHAPE-08**: Related tool chip links use 4px border radius
- [ ] **SHAPE-09**: Nav item hover backgrounds use 4px border radius

### COMP — Component Fixes

- [ ] **COMP-01**: Toolbar removes filled Copy/Sao chép primary button; retains icon-only copy, download, and clear buttons on homepage and all 4 sub-tool pages
- [ ] **COMP-02**: Case mode tabs scroll horizontally on screens < 1400px; all 7 tabs visible without scrolling on > 1280px; labels never truncate
- [ ] **COMP-03**: Locale switcher displays "Tiếng Việt" with correct diacritics

### CONT — Content

- [ ] **CONT-01**: "How it works" section added below the tool card on the homepage: 2-column grid of 7 mode cards
- [ ] **CONT-02**: Each mode card shows colored badge, mode name, 2-sentence description, and before→after example in monospace
- [ ] **CONT-03**: All 7 mode descriptions and examples exist in en.json and vi.json with proper Vietnamese diacritics
- [ ] **CONT-04**: FAQ redesigned: left border accent (3px solid #1a2744 navy) on open items, navy typography, visual hierarchy, HelpCircle icon in section heading, no hover:underline on trigger

### NAV — Navigation & Footer

- [ ] **NAV-01**: Footer component added to `[locale]/layout.tsx`: 3-column desktop layout with copyright, tagline, 4 placeholder links (Privacy Policy · Terms of Service · Sitemap · Contact), and bottom "Made with ❤ for Vietnamese and English users" strip
- [ ] **NAV-02**: Footer supports dark mode (dark:bg-zinc-950 dark:border-zinc-800) and is fully i18n translated in en.json and vi.json with proper Vietnamese diacritics
- [ ] **NAV-03**: Sidebar adds grouped tool navigation links (Text Tools, Code & Data, Random categories) below the ad slot, with locale-prefixed URLs and active page styling (navy + mint tint)
- [ ] **NAV-04**: Sidebar tool links are accessible in the mobile Sheet drawer

### LAYOUT — Consistency

- [ ] **LAYOUT-01**: All 5 tool pages share a ToolPageLayout pattern with identical container width, H1 size, description size, card border, spacing between sections, and section order (tool area → below-tool content → FAQ → related tools)

## Future Requirements

### Tools Expansion

- **TOOLS-01**: Remaining 30+ sub-tool pages (Text Tools, Code & Data, Font Styles, Random categories)
- **TOOLS-02**: AdSense slot activation (placeholders exist — wiring up is a future milestone)

## Out of Scope

| Feature | Reason |
|---------|--------|
| AdSense activation | v1.1 adds polish only; monetization activation is a separate milestone |
| New tool implementations | Tools expansion deferred; focus is UI consistency across existing 5 tools |
| User accounts / saved history | Stateless by design |
| PWA / offline mode | Deferred beyond v1.1 |
| Real-time collaboration | Single-user, client-side only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TYPO-01 | Phase 5 | Pending |
| TYPO-02 | Phase 5 | Pending |
| TYPO-03 | Phase 5 | Pending |
| TYPO-04 | Phase 5 | Pending |
| TYPO-05 | Phase 5 | Pending |
| TYPO-06 | Phase 5 | Pending |
| TYPO-07 | Phase 5 | Pending |
| TYPO-08 | Phase 5 | Pending |
| TYPO-09 | Phase 5 | Pending |
| SURF-01 | Phase 5 | Pending |
| SURF-02 | Phase 5 | Pending |
| SURF-03 | Phase 5 | Pending |
| SHAPE-01 | Phase 5 | Pending |
| SHAPE-02 | Phase 5 | Pending |
| SHAPE-03 | Phase 5 | Pending |
| SHAPE-04 | Phase 5 | Pending |
| SHAPE-05 | Phase 5 | Pending |
| SHAPE-06 | Phase 5 | Pending |
| SHAPE-07 | Phase 5 | Pending |
| SHAPE-08 | Phase 5 | Pending |
| SHAPE-09 | Phase 5 | Pending |
| COMP-01 | Phase 6 | Pending |
| COMP-02 | Phase 6 | Pending |
| COMP-03 | Phase 6 | Pending |
| CONT-01 | Phase 6 | Pending |
| CONT-02 | Phase 6 | Pending |
| CONT-03 | Phase 6 | Pending |
| CONT-04 | Phase 6 | Pending |
| NAV-01 | Phase 7 | Pending |
| NAV-02 | Phase 7 | Pending |
| NAV-03 | Phase 7 | Pending |
| NAV-04 | Phase 7 | Pending |
| LAYOUT-01 | Phase 7 | Pending |

**Coverage:**
- v1.1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after initial definition*
