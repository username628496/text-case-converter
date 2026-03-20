---
phase: 06-component-fixes-content
plan: 01
subsystem: components
tags: [toolbar, locale, faq, ui-polish]
dependency_graph:
  requires: []
  provides: [clean-toolbar-ui, full-locale-label, faq-visual-redesign]
  affects: [tool-page, reverse-text-tool, base64-tool, slug-generator-tool, password-generator-tool, site-nav, faq-section]
tech_stack:
  added: []
  patterns: [data-state-open Tailwind variants, icon-only ghost buttons, lucide-react HelpCircle]
key_files:
  created: []
  modified:
    - src/components/tool-page.tsx
    - src/components/tools/reverse-text-tool.tsx
    - src/components/tools/base64-tool.tsx
    - src/components/tools/slug-generator-tool.tsx
    - src/components/tools/password-generator-tool.tsx
    - src/components/site-nav.tsx
    - src/components/faq-section.tsx
decisions:
  - "Removed filled navy Copy button from all 5 tool toolbars; icon-only ghost buttons remain"
  - "Locale switcher trigger now shows full 'Tieng Viet' with diacritics instead of 'VI'"
  - "FAQ uses data-[state=open] Tailwind variants for left border and text color without JS"
  - "AccordionTrigger uses no-underline hover:no-underline to override shadcn default hover:underline"
metrics:
  duration: "2 min"
  completed_date: "2026-03-20"
  tasks: 2
  files: 7
---

# Phase 06 Plan 01: Component Fixes and FAQ Redesign Summary

Remove duplicate filled navy Copy buttons from all 5 tool toolbars, update locale switcher to show full Vietnamese name with diacritics, and redesign FAQ with HelpCircle icon heading, open-state navy left border, and no hover underline.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Remove filled Copy button from toolbars and fix locale switcher | e0a633b | tool-page.tsx, reverse-text-tool.tsx, base64-tool.tsx, slug-generator-tool.tsx, password-generator-tool.tsx, site-nav.tsx |
| 2 | Redesign FAQ with HelpCircle icon, navy left border, no hover underline | f670613 | faq-section.tsx |

## What Was Built

**Toolbar cleanup (COMP-01):** Removed the filled navy `bg-[var(--color-navy)] text-white text-sm` Copy button from all 5 tool pages (homepage tool-page.tsx and 4 sub-tool pages). Each toolbar now shows only icon-only ghost buttons. The Encode/Decode tab style in base64-tool.tsx was left untouched, and the full-width Regenerate button in password-generator-tool.tsx was preserved as it is a distinct action.

**Locale switcher (COMP-03):** Updated the trigger button label in site-nav.tsx from `'🇻🇳 VI'` to `'🇻🇳 Tieng Viet'` (with correct diacritics) when locale is `vi`.

**FAQ redesign (CONT-04):** Rewrote faq-section.tsx to add:
- `HelpCircle` icon imported from lucide-react, displayed before the heading text
- `data-[state=open]:border-l-[3px] data-[state=open]:border-l-[#1a2744] data-[state=open]:pl-4` on AccordionItem for the navy left border accent on open items
- `data-[state=open]:text-[#1a2744]` on AccordionTrigger for navy question text when open
- `no-underline hover:no-underline` on AccordionTrigger to override shadcn's default `hover:underline`
- AccordionContent answer text stays `text-zinc-500`

## Verification

`npm run build` passed with no TypeScript or compilation errors. All 15 pages generated successfully.

## Deviations from Plan

None - plan executed exactly as written.

**Note on COMP-02 (tab scrolling):** The plan stated to verify the horizontal tab scroll infrastructure is correct and leave as-is if already working. The existing ScrollArea + ScrollBar + whitespace-nowrap flex container in tool-page.tsx was already correct per the plan's assessment - no changes were needed.

**Note on base64 acceptance criterion:** The plan stated `grep -c 'bg-\[var(--color-navy)\].*text-white.*text-sm' src/components/tools/base64-tool.tsx` should return 1. The grep pattern did not match because the active tab class string has `text-sm font-medium` before `bg-[var(--color-navy)] text-white` (not after). The Encode/Decode tab style is correctly preserved at line 56 of base64-tool.tsx.

## Self-Check: PASSED

All files present and all commits verified on disk.
