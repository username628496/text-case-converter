---
phase: 02-core-case-converter
verified: 2026-03-20T11:00:00Z
status: human_needed
score: 16/16 automated must-haves verified
re_verification: false
human_verification:
  - test: "Interactive case conversion in browser"
    expected: "Typing 'HELLO WORLD. HOW ARE YOU?' and clicking each of 7 tabs produces the correct transformed output instantly. Sentence case: 'Hello world. How are you?', lower case: 'hello world. how are you?', UPPER CASE: 'HELLO WORLD. HOW ARE YOU?', Capitalized: 'Hello World. How Are You?', aLtErNaTiNg: 'hElLo wOrLd. hOw aRe yOu?', Title Case: 'Hello World. How Are You?', iNVERSE: 'hello WORLD. HOW ARE you?'"
    why_human: "Automated tests cover transforms in isolation; browser rendering of the React state machine (inputText -> output display in textarea value) must be verified visually"
  - test: "Sonner toast on copy"
    expected: "Clicking the Copy button fires a Sonner toast reading 'Copied to clipboard!' (or Vietnamese equivalent on /vi/)"
    why_human: "Toast visibility and positioning are runtime behaviours that cannot be verified from source alone"
  - test: "Dark mode toggle via SiteNav button"
    expected: "Clicking the moon/sun button in the header switches colors across the entire page (background, text, card borders, tabs) to the dark theme and back"
    why_human: "ThemeProvider integration and CSS custom property dark overrides require a browser to confirm visual correctness"
  - test: "Vietnamese locale at /vi/ with proper diacritics"
    expected: "Opening http://localhost:3000/vi/ shows all UI strings in Vietnamese with correct diacritics (e.g. 'Chuyển Đổi Chữ Hoa Chữ Thường', 'Nhập hoặc dán văn bản...'). No ASCII approximations ('Chuyen Doi') visible anywhere."
    why_human: "Unicode rendering correctness must be confirmed visually; source inspection alone does not catch font fallback or garbled rendering"
  - test: "SEO metadata in page source"
    expected: "View-source on / shows: <title>Text Case Converter — Free Online Tool</title>, <meta name='description'...>, <link rel='canonical' href='https://textcaseconverter.com/'>, two hreflang alternates (en and vi), and a <script type='application/ld+json'> containing both SoftwareApplication and HowTo nodes"
    why_human: "Next.js injects metadata at build/request time; only a browser or curl can confirm the rendered HTML output"
---

# Phase 02: Core Case Converter Verification Report

**Phase Goal:** Build the complete, working Text Case Converter tool — interactive UI wired to pure transform functions, SEO metadata, i18n for EN+VI, dark mode, and structured data.
**Verified:** 2026-03-20T11:00:00Z
**Status:** human_needed — all 16 automated must-haves pass; 5 runtime behaviours need browser confirmation
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | transformText() returns correct output for all 7 case modes | VERIFIED | 33 Vitest tests pass; all 7 branches confirmed |
| 2 | Character, word, and line count logic works on derived output | VERIFIED | `tool-page.tsx` lines 22-23: count computed on `output`, not `inputText` |
| 3 | dark: Tailwind variants respond to next-themes .dark class | VERIFIED | `globals.css` line 5: `@custom-variant dark (&:is(.dark *))` unchanged; ThemeProvider uses `attribute="class"` |
| 4 | CSS custom properties --color-bg-page, --color-border-brand, --color-navy are available | VERIFIED | `globals.css` lines 84-86 (:root) and 121-123 (.dark) |
| 5 | All en.json and vi.json translation keys for tool UI, FAQ, SEO, howto, nav, related exist | VERIFIED | Both files have all 10 namespaces; en.faq.items.length=5; vi.faq.items.length=5; no ASCII approximations in vi.json |
| 6 | Sonner Toaster is mounted in the layout tree | VERIFIED | `[locale]/layout.tsx` line 83: `<Toaster />` inside NextIntlClientProvider |
| 7 | User can type/paste text and see it converted instantly via 7 case mode tabs | VERIFIED (code) | `tool-page.tsx`: `output = transformText(inputText, activeMode)` on each render; `value={output}` on Textarea |
| 8 | User can copy converted text with Sonner toast confirmation | VERIFIED (code) | `handleCopy` calls `navigator.clipboard.writeText(output)` then `toast(t('copyToast'))` |
| 9 | User can clear the textarea with one click | VERIFIED | `handleClear = () => setInputText('')` wired to Trash2 button |
| 10 | User sees live character, word, and line counts | VERIFIED | `charCount`, `wordCount`, `lineCount` rendered in `aria-live="polite"` span |
| 11 | User can download converted text as .txt file | VERIFIED | `handleDownload` creates Blob, triggers anchor click with `converted-text.txt` |
| 12 | FAQ section renders 5 accordion items from translations | VERIFIED | `FAQSection` receives `items` from `tFaq.raw('items')`; maps over them with shadcn Accordion |
| 13 | Related Tools section renders links from tool registry relatedSlugs | VERIFIED | `RelatedTools` receives `relatedSlugs={homepageTool.relatedSlugs}` in page.tsx |
| 14 | Homepage at each locale has unique title, meta description, canonical URL, og:image, hreflang | VERIFIED | `generateMetadata` in page.tsx: title/description from `seo` namespace, `alternates.canonical`, `alternates.languages` with en+vi, `openGraph.images` with og/text-case-converter.png |
| 15 | JSON-LD contains SoftwareApplication + HowTo schema in @graph array | VERIFIED | page.tsx lines 68-91: `@graph` array with both types, HowToStep x4 from `howto.*` translations |
| 16 | Build generates all 13 routes statically | VERIFIED | `npm run build` exits 0; 13 routes confirmed including /en and /vi |

**Automated Score:** 16/16 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/case-transforms.ts` | 7 pure transform functions + CASE_MODES + CaseMode | VERIFIED | 57 lines; all 7 exports present |
| `src/lib/case-transforms.test.ts` | Unit tests, min 50 lines | VERIFIED | 177 lines, 33 tests, all pass |
| `vitest.config.ts` | Vitest config with @ alias | VERIFIED | defineConfig + path.resolve alias |
| `public/og/text-case-converter.png` | 1200x630 PNG | VERIFIED | 1200x630 PNG, 3.6 KB |
| `src/components/tool-page.tsx` | Interactive converter, min 80 lines | VERIFIED | 154 lines; 'use client', all required patterns |
| `src/components/faq-section.tsx` | Accordion FAQ, min 30 lines | VERIFIED | 36 lines; no 'use client' |
| `src/components/tool-cards.tsx` | ToolCards + RelatedTools, min 40 lines | VERIFIED | 105 lines; exports both functions |
| `src/components/json-ld.tsx` | JSON-LD script component, min 8 lines | VERIFIED | 10 lines; XSS-safe with \\u003c replacement |
| `src/components/site-nav.tsx` | Full SiteNav, min 80 lines | VERIFIED | 189 lines; 'use client', all required patterns |
| `src/app/[locale]/page.tsx` | Complete homepage, min 60 lines, generateMetadata + default exports | VERIFIED | 115 lines; both exports present |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `case-transforms.test.ts` | `case-transforms.ts` | `import { transformText, CASE_MODES }` | WIRED | Line 2: exact import |
| `tool-page.tsx` | `case-transforms.ts` | `import { transformText, CASE_MODES, type CaseMode }` | WIRED | Line 5: exact import; used at lines 20, 44, 127 |
| `tool-page.tsx` | `sonner` | `toast()` for copy confirmation | WIRED | Line 6: `import { toast } from 'sonner'`; used in `handleCopy` line 27 |
| `tool-cards.tsx` | `src/lib/tools` | `import { tools }` | WIRED | Line 3: used at lines 21, 66 |
| `faq-section.tsx` | `ui/accordion` | `import { Accordion }` | WIRED | Line 1: full accordion import |
| `[locale]/page.tsx` | `tool-page.tsx` | `import { ToolPage }` | WIRED | Line 4; rendered at line 96 |
| `[locale]/page.tsx` | `faq-section.tsx` | `import { FAQSection }` | WIRED | Line 5; rendered at lines 100-103 |
| `[locale]/page.tsx` | `json-ld.tsx` | `import { JsonLd }` | WIRED | Line 7; rendered at line 112 |
| `generateMetadata` | `next-intl/server` | `getTranslations` for locale-specific metadata | WIRED | Line 17: `await getTranslations({ locale, namespace: 'seo' })` |
| `site-nav.tsx` | `[locale]/layout.tsx` | `import SiteNav and render in header` | WIRED | `layout.tsx` line 6 import; line 41 render with full props |
| `site-nav.tsx` | `next-themes` | `useTheme()` for dark mode toggle | WIRED | Line 4: `import { useTheme } from 'next-themes'`; `resolvedTheme` used in render |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| CORE-01 | 02-01, 02-03 | 7 case modes via tab switching in single textarea | SATISFIED | `tool-page.tsx`: CASE_MODES.map to tabs, `setActiveMode` on click |
| CORE-02 | 02-01, 02-03 | Instant conversion on mode-select or keystroke | SATISFIED | `output = transformText(inputText, activeMode)` — no submit handler |
| CORE-03 | 02-03 | Copy to clipboard with visual confirmation | SATISFIED | `handleCopy` + `toast(t('copyToast'))`; note: REQUIREMENTS.md says "~1.5s state" but Sonner toast is used instead of isCopied state — functionally equivalent |
| CORE-04 | 02-01, 02-03 | Live character and word count | SATISFIED | `charCount`, `wordCount`, `lineCount` in `aria-live` span |
| CORE-05 | 02-03 | Clear textarea with single click | SATISFIED | `handleClear = () => setInputText('')` |
| CORE-06 | 02-03, 02-04 | Related tools navigation below each tool | SATISFIED | `RelatedTools` component rendered in page.tsx |
| CORE-07 | 02-03, 02-04 | FAQ and how-to content below tool | SATISFIED | `FAQSection` rendered with 5 translated items |
| CORE-08 | 02-01, 02-02 | Dark mode via OS preference | SATISFIED | ThemeProvider `defaultTheme="system" enableSystem`; SiteNav manual toggle |
| SEO-01 | 02-04 | generateMetadata with title, description, canonical, og:image per locale | SATISFIED | page.tsx `generateMetadata` confirmed |
| SEO-02 | 02-04 | JSON-LD SoftwareApplication + HowTo | SATISFIED | `@graph` array in page.tsx |
| I18N-04 | 02-04 | Bidirectional hreflang EN+VI | SATISFIED | `alternates.languages: { en: BASE_URL+'/', vi: BASE_URL+'/vi/' }` |

**All 11 requirement IDs from plan frontmatter: SATISFIED**

No orphaned requirements: REQUIREMENTS.md traceability table maps exactly CORE-01 through CORE-08, SEO-01, SEO-02, I18N-04 to Phase 2.

---

### Anti-Patterns Found

| File | Lines | Pattern | Severity | Impact |
|------|-------|---------|----------|--------|
| `src/components/site-nav.tsx` | 162, 168, 174, 180 | "Coming soon" text in mobile Sheet drawer nav sections | Info | Expected — Phase 2 plan explicitly specifies empty category placeholders; sub-tools are Phase 3. Not a regression. |

No blockers found. No TODO/FIXME/HACK comments. No empty implementations. No stub API routes. No `return null` or `return {}` components.

---

### Human Verification Required

All automated code checks pass. The following require a running browser to confirm:

#### 1. Interactive Case Conversion

**Test:** Run `npm run dev`, open http://localhost:3000/, type "HELLO WORLD. HOW ARE YOU?" in the textarea, click through all 7 tabs.
**Expected:**
- Sentence: "Hello world. How are you?"
- lower: "hello world. how are you?"
- UPPER: "HELLO WORLD. HOW ARE YOU?"
- Capitalized: "Hello World. How Are You?"
- aLtErNaTiNg: "hElLo wOrLd. hOw aRe yOu?"
- Title: "Hello World. How Are You?"
- iNVERSE: "hello WORLD. HOW ARE you?" (depends on exact input case)
**Why human:** Browser renders React state; textarea `value={output}` display must be confirmed visually.

#### 2. Sonner Toast on Copy

**Test:** Type any text, click the Copy button (or the primary navy "Copy" button).
**Expected:** A Sonner toast notification appears with the text "Copied to clipboard!" (English) or "Đã sao chép vào clipboard!" (Vietnamese).
**Why human:** Toast is a runtime popup that only renders in the browser DOM.

#### 3. Dark Mode Toggle

**Test:** Click the moon/sun icon in the SiteNav header.
**Expected:** Page colors switch between light (mint-green teal scheme with #e8f5f2 background) and dark (zinc-950 background) themes. The CSS custom properties --color-bg-page, --color-border-brand, --color-navy should have their dark overrides applied.
**Why human:** CSS custom property dark overrides and ThemeProvider class toggling require a browser.

#### 4. Vietnamese Locale Diacritics

**Test:** Open http://localhost:3000/vi/.
**Expected:** All UI text displays proper Vietnamese Unicode diacritics. The H1 should read "Chuyển Đổi Chữ Hoa Chữ Thường". Placeholder text, FAQ items, and mode labels should all show correct Vietnamese without ASCII fallbacks.
**Why human:** Font rendering and Unicode display must be visually confirmed.

#### 5. SEO Metadata in Rendered HTML

**Test:** View source at http://localhost:3000/ (or use `curl http://localhost:3000/`).
**Expected:**
- `<title>Text Case Converter — Free Online Tool</title>`
- `<meta name="description" content="Free online text case converter...">`
- `<link rel="canonical" href="https://textcaseconverter.com/">`
- Two `<link rel="alternate" hreflang="en">` and `hreflang="vi">` tags
- `<script type="application/ld+json">` containing both `SoftwareApplication` and `HowTo` nodes in an `@graph` array
**Why human:** Next.js injects these at render time; only the served HTML confirms correct injection.

---

## Gaps Summary

No gaps found. All 16 automated must-haves verified. Phase goal artifacts are complete and wired.

The only outstanding items are the 5 human browser verification tasks listed above, which cannot be confirmed from static source analysis alone.

---

_Verified: 2026-03-20T11:00:00Z_
_Verifier: Claude (gsd-verifier)_
