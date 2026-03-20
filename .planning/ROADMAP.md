# Roadmap: Text Case Converter

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-20)
- 🚧 **v1.1 UI Polish** — Phases 5-7 (in progress)
- 📋 **v2.0** — Phases 8+ (planned)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-03-20</summary>

- [x] Phase 1: Foundation Infrastructure (2/2 plans) — completed 2026-03-19
- [x] Phase 2: Core Case Converter (4/4 plans) — completed 2026-03-20
- [x] Phase 3: Sub-Tools + SEO Infrastructure (4/4 plans) — completed 2026-03-20
- [x] Phase 4: Launch Readiness (2/2 plans) — completed 2026-03-20

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v1.1 UI Polish (In Progress)

**Milestone Goal:** Polish visual design, fix structural component issues, and add missing UI sections (footer, sidebar nav, mode explanations) so the site is visually credible before Google Search Console submission and AdSense activation.

#### Phase 5: Visual Foundation

- [ ] **Phase 5: Visual Foundation** - Font swap, color surfaces, and border radius applied across the entire app

#### Phase 6: Component Fixes + Content

- [ ] **Phase 6: Component Fixes + Content** - Toolbar deduplication, tab overflow, locale label, "How it works" section, FAQ redesign

#### Phase 7: Navigation + Layout

- [ ] **Phase 7: Navigation + Layout** - Footer, sidebar tool nav, and ToolPageLayout consistency across all 5 tool pages

## Phase Details

### Phase 5: Visual Foundation
**Goal**: The site uses Inter font with Vietnamese support, a mint/dark color palette, and reduced border radii — establishing a coherent visual identity visible on every page
**Depends on**: Phase 4
**Requirements**: TYPO-01, TYPO-02, TYPO-03, TYPO-04, TYPO-05, TYPO-06, TYPO-07, TYPO-08, TYPO-09, SURF-01, SURF-02, SURF-03, SHAPE-01, SHAPE-02, SHAPE-03, SHAPE-04, SHAPE-05, SHAPE-06, SHAPE-07, SHAPE-08, SHAPE-09
**Success Criteria** (what must be TRUE):
  1. The page body shows a mint green (#e8f5f2) background in light mode and #0f1a17 in dark mode; surface cards and the textarea render on white in light mode
  2. All text is rendered in Inter (with Vietnamese subset active); no Geist font references remain in layout.tsx or globals.css
  3. Body copy, textarea content, and headings are visibly larger than v1.0 baseline — H1 at 30px, H2 at 20px, body at 15px
  4. Every button, tab pill, badge, card, input, and nav hover state uses a rectangular corner radius (4px or 6px); no rounded-full shapes appear on interactive elements
  5. The FAQ accordion items are square-cornered; related tool chip links and nav hover backgrounds are 4px radius
**Plans**: 3 plans

Plans:
- [ ] 05-01-PLAN.md — Font swap (Inter + JetBrains Mono) and mint/dark color palette CSS variables
- [ ] 05-02-PLAN.md — Typography size updates across all components (H1, H2, body, FAQ, stats)
- [ ] 05-03-PLAN.md — Border radius updates across all UI primitives and usage sites

### Phase 6: Component Fixes + Content
**Goal**: Structural component bugs are resolved and the homepage gains a complete "How it works" section and redesigned FAQ — making the tool self-explanatory in both EN and VI
**Depends on**: Phase 5
**Requirements**: COMP-01, COMP-02, COMP-03, CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. The toolbar shows only icon-only buttons (copy, download, clear); the filled "Copy / Sao chep" primary button is gone from the homepage and all 4 sub-tool pages
  2. On a viewport under 1400px wide, the 7 case mode tabs scroll horizontally without truncating labels; on screens wider than 1280px all tabs are visible without scrolling
  3. The locale switcher displays "Tieng Viet" with correct diacritics in both EN and VI locales
  4. A "How it works" section appears below the tool card on the homepage: a 2-column grid of 7 mode cards, each showing a colored badge, mode name, 2-sentence description, and a monospace before->after example
  5. FAQ items display a 3px navy left border accent on open items, navy typography, and a HelpCircle icon in the section heading; trigger text has no underline on hover
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: Navigation + Layout
**Goal**: Every page has a footer and sidebar tool navigation, and all 5 tool pages share an identical layout structure — giving the site a finished, consistent shape
**Depends on**: Phase 6
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, LAYOUT-01
**Success Criteria** (what must be TRUE):
  1. A footer appears on every page with a 3-column desktop layout containing copyright, tagline, 4 placeholder links (Privacy Policy, Terms of Service, Sitemap, Contact), and a bottom strip reading "Made with heart for Vietnamese and English users"
  2. The footer renders correctly in dark mode (dark background, dark border) and all footer copy is translated in both en.json and vi.json with correct Vietnamese diacritics
  3. The sidebar below the ad slot shows grouped tool navigation links (Text Tools, Code & Data, Random categories) with locale-prefixed URLs; the current page link is styled with navy + mint tint
  4. The sidebar tool links are accessible inside the mobile Sheet drawer
  5. All 5 tool pages share the same ToolPageLayout: identical container width, H1 size, description size, card border, section spacing, and section order (tool area -> below-tool content -> FAQ -> related tools)
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation Infrastructure | v1.0 | 2/2 | Complete | 2026-03-19 |
| 2. Core Case Converter | v1.0 | 4/4 | Complete | 2026-03-20 |
| 3. Sub-Tools + SEO Infrastructure | v1.0 | 4/4 | Complete | 2026-03-20 |
| 4. Launch Readiness | v1.0 | 2/2 | Complete | 2026-03-20 |
| 5. Visual Foundation | 1/3 | In Progress|  | - |
| 6. Component Fixes + Content | v1.1 | 0/? | Not started | - |
| 7. Navigation + Layout | v1.1 | 0/? | Not started | - |
