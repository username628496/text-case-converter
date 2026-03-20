# Phase 6: Component Fixes + Content - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Resolve structural component bugs (toolbar duplicate button, tab overflow, locale label) and add homepage content ("How it works" section with 7 mode cards, FAQ visual redesign). All work is homepage-and-sub-tool scoped — no new tool pages, no layout/nav changes (those are Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Toolbar Fix (COMP-01)
- Remove the filled navy `<Button onClick={handleCopy}>` from `tool-page.tsx` toolbar — the icon-only Copy/Download/Clear buttons remain
- Same fix applies to all 4 sub-tool pages — verify each for any similar filled button pattern

### Tab Overflow (COMP-02)
- Existing `ScrollArea` + `ScrollBar` + `whitespace-nowrap` infrastructure already in place
- Fix is to ensure the outer container doesn't force all tabs visible at < 1400px — check for any `flex-nowrap` or min-width constraints causing the tabs to not scroll

### Locale Switcher (COMP-03)
- Change `'🇻🇳 VI'` to `'🇻🇳 Tiếng Việt'` — flag + full name with correct diacritics
- Keep `'🇺🇸 EN'` unchanged — only the VI label is being fixed per COMP-03

### "How it works" Section (CONT-01/02/03)
- Placement: below the tool Card on the homepage, above ToolCards
- Layout: 2-column grid of 7 mode cards; 7th card sits half-width, left-aligned (no span treatment)
- Card surface: mint tint background (approximately #f0faf8) — softly branded, distinct from white surface cards
- Section heading: plain `<h2>` (no icon) — visually differentiated from the FAQ heading which gets HelpCircle
- Each card shows: colored badge (same colors as the mode tabs), mode name, 2-sentence SEO-optimized description, and a monospace before→after example
- **Content authorship:** Claude writes all descriptions, examples, and VI translations
- **Tone:** SEO-optimized — weave in searchable phrases like "convert text to uppercase online"
- **Before→after input:** Use mixed-case chaos text (e.g., "tHe QuIcK bRoWn FoX") — visually contrasting, shows transformation power
- **Vietnamese:** Full natural VI translation — idiomatic Vietnamese, not word-for-word, with proper diacritics

### FAQ Redesign (CONT-04)
- Open items get: 3px solid #1a2744 navy left border, question (trigger) text turns navy
- Answer text stays zinc-500 on open items — preserves question/answer visual hierarchy
- Closed items: no special treatment — plain, no border, no background
- Section heading: add `<HelpCircle>` Lucide icon before the heading text
- Trigger text: remove `hover:underline` (shadcn AccordionTrigger default — override via className)
- Left border applies to the entire AccordionItem, not just the trigger

### Claude's Discretion
- Exact mint tint value for mode cards (approximately #f0faf8 — adjust to match palette)
- Exact SEO phrasing for mode descriptions (following functional-but-searchable pattern)
- Vietnamese content for all 7 modes — write idiomatic VI, not translated EN
- HelpCircle icon size and spacing in FAQ heading
- Whether to apply `border-l-[3px]` via Tailwind arbitrary value or inline style on open AccordionItem

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Component Requirements
- `.planning/REQUIREMENTS.md` §COMP — COMP-01, COMP-02, COMP-03 (toolbar, tabs, locale label)
- `.planning/REQUIREMENTS.md` §CONT — CONT-01, CONT-02, CONT-03, CONT-04 (How it works, FAQ)

### Current Implementation
- `src/components/tool-page.tsx` — Toolbar with duplicate filled button (COMP-01), ScrollArea tab row (COMP-02)
- `src/components/tools/base64-tool.tsx` — Sub-tool to audit for filled button pattern
- `src/components/tools/reverse-text-tool.tsx` — Sub-tool to audit
- `src/components/tools/slug-generator-tool.tsx` — Sub-tool to audit
- `src/components/tools/password-generator-tool.tsx` — Sub-tool to audit
- `src/components/site-nav.tsx` — Locale switcher showing `'🇻🇳 VI'` (COMP-03 fix site)
- `src/components/faq-section.tsx` — Current minimal FAQ (to be redesigned per CONT-04)
- `src/app/[locale]/page.tsx` — Homepage composition (where "How it works" section is inserted)

### i18n
- `messages/en.json` — Add 7 mode descriptions + before/after examples (CONT-03)
- `messages/vi.json` — Add full natural VI translations for all 7 modes (CONT-03)

### Design Tokens (from Phase 5)
- `src/app/globals.css` — `--color-navy: #1a2744`, `--color-border-brand`, mint palette tokens

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/accordion.tsx` — AccordionItem/Trigger/Content (shadcn) — add className overrides for border/color on open state
- `src/components/ui/badge.tsx` — Colored badge with 4px radius — same component used in mode tabs, reuse in "How it works" cards
- `src/components/ui/card.tsx` — 6px radius card — use for mode cards with mint tint override
- `src/components/ui/scroll-area.tsx` — ScrollArea + ScrollBar already in tool-page.tsx tabs row
- `CASE_MODES` array in `src/lib/case-transforms.ts` — 7 modes with IDs, labels, abbr, and colors — drive "How it works" card rendering

### Established Patterns
- Mode badge colors come from `CASE_MODES[n].color` — same source for "How it works" cards ensures color consistency
- `whitespace-nowrap` on tab buttons already set — COMP-02 fix is likely a container constraint issue
- Accordion open state: shadcn sets `data-state="open"` on AccordionItem — target with `data-[state=open]:` Tailwind variant for left border + text color
- Icon imports from `lucide-react` — HelpCircle available

### Integration Points
- `src/app/[locale]/page.tsx` — New `<HowItWorksSection>` component inserted between `<ToolPage />` and `<ToolCards />`
- `src/components/faq-section.tsx` — Modified in place (heading icon, trigger color, open-item border)
- `messages/en.json` + `messages/vi.json` — New `howItWorks` namespace with 7 mode entries
- `src/components/site-nav.tsx` — Single string change for locale label

</code_context>

<specifics>
## Specific Ideas

- "How it works" mode cards reuse `CASE_MODES` array as the data source — keeps badge colors in sync with the tab UI automatically
- Before→after examples use "tHe QuIcK bRoWn FoX" style input — visually jarring contrast to show transformation power
- FAQ redesign uses `data-[state=open]:` Tailwind variant on AccordionItem for stateful border/color (no JS needed)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-component-fixes-content*
*Context gathered: 2026-03-20*
