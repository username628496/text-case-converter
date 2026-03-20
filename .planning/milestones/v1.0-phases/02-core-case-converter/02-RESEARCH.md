# Phase 2: Core Case Converter - Research

**Researched:** 2026-03-20
**Domain:** Next.js 16 App Router, next-intl v4, Tailwind v4, shadcn/ui, React 19, JSON-LD SEO
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Case Conversion Semantics**
- Sentence case: Lowercase entire input first, then capitalise the first letter after each sentence-ending punctuation mark (`.`, `!`, `?`). Multi-sentence input (e.g. "HELLO WORLD. HOW ARE YOU?") → "Hello world. How are you?"
- Alternating case: Every character alternates — first char lowercase, each subsequent flips. "Hello" → "hElLo". Matches the tab badge label `aA`.
- Title Case: AP/Chicago style — skip common short words (`a`, `an`, `the`, `of`, `in`, `and`, `or`, `but`, `for`, `nor`) unless they are the first word in the string. Every other word gets a capital.
- Inverse case: Flip each letter's case (A→a, a→A). Numbers, symbols, and spaces are left unchanged. "Hello World 123" → "hELLO wORLD 123"
- lower case / UPPER CASE: Standard — no edge case handling needed beyond built-in JS `toLowerCase()` / `toUpperCase()`.
- Capitalized Case: Every word's first letter capitalised, rest lowercased (simpler than Title Case — no skip list).

**FAQ & HowTo Content**
- FAQ count: 4–6 items. Topics: what is case conversion, how to use the tool, brief per-mode descriptions (can group modes), why case matters for writing/SEO.
- HowTo schema steps: 3–4 sequential steps: 1) Type or paste text, 2) Select a case mode tab, 3) Text converts instantly, 4) Click Copy.
- i18n: Full EN + VI translation for all FAQ content. VI copy uses proper Unicode diacritics (ASCII approximations are wrong, per UI-SPEC).

**Related Tools Section**
- Render links to future pages (`/reverse-text/` and `/slug-generator/`) from day one — 404 until Phase 3 is fine.
- Count: Show exactly what `relatedSlugs` defines (2 tools for case-converter).

**Architecture Patterns (locked)**
- React Compiler enabled (`reactCompiler: true`) — do NOT add manual `useMemo`/`useCallback` in Client Components.
- Tailwind v4 via `@tailwindcss/postcss` — use v4 syntax.
- No shadcn CLI init, no `components.json` to create (shadcn already initialized, 17 components installed).
- Server Components by default; `'use client'` only where needed.
- `setRequestLocale(locale)` called at the top of all async page/layout components.
- `params` is a `Promise<{ locale: string }>` — must be `await`ed before use.

### Claude's Discretion
- Exact FAQ question/answer copy (within the 4–6 item constraint and topic areas above)
- Vietnamese translation of FAQ and HowTo content (accuracy within proper diacritics requirement)
- Nav dropdown open/close mechanism on mobile (CSS hover or minimal client-side toggle)
- og:image static file content (only the path `/og/text-case-converter.png` is required — actual image can be placeholder 1200×630 PNG)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-01 | 7 case modes (Sentence, lower, UPPER, Capitalized, Alternating, Title, Inverse) via tab switching | `CASE_MODES` constant + `transformText()` pure function; tab buttons with `role="tab"` |
| CORE-02 | Conversion happens instantly on mode-select or keystroke — no submit button | `transformText(inputText, activeMode)` called inline as derived value, not in effect |
| CORE-03 | Copy to clipboard with "Copied!" confirmation (~1.5s) | `navigator.clipboard.writeText()` + Sonner `toast()` (already installed: sonner 2.0.7) |
| CORE-04 | Live character and word count updating in real-time | Derived values from `output` string — no extra state needed |
| CORE-05 | Clear textarea with one click | `setInputText('')` in `handleClear` |
| CORE-06 | Related tools navigation links below each tool | `RelatedTools` component reading `relatedSlugs` from `tools.ts` registry |
| CORE-07 | FAQ and how-to content below the tool | `FAQSection` component using shadcn `Accordion`; content in `messages/*.json` |
| CORE-08 | Dark mode via OS preference (Tailwind CSS v4 `@media prefers-color-scheme`) | CRITICAL CONFLICT — see Architecture Patterns section |
| SEO-01 | `generateMetadata()` per locale: title, description, canonical URL, og:image | `alternates.languages` in Metadata object + `metadataBase` |
| SEO-02 | JSON-LD structured data: SoftwareApplication + HowTo schema | Inline `<script type="application/ld+json">` in Server Component page |
| I18N-04 | Bidirectional hreflang EN ↔ VI | `alternates.languages` field in `generateMetadata()` |
</phase_requirements>

---

## Summary

Phase 2 builds on a solid Phase 1 foundation: Next.js 16.2.0 with App Router, next-intl v4.8.3, Tailwind v4, React 19 with React Compiler, and 17 shadcn/ui components already installed. The work is primarily writing new components and filling in translation keys — no infrastructure changes are needed.

The core converter is a pure function transformation pattern: `inputText` is stored in state, `transformText(inputText, activeMode)` is called inline to derive output for display, and all counts (chars, words, lines) are further derived from output. This single-textarea design (input and output are the same `<textarea>`) is already specified in the UI-SPEC and is the standard pattern for this type of tool.

SEO infrastructure in Next.js 16 uses the `generateMetadata()` export on `page.tsx` (Server Component only) with `alternates.languages` for hreflang and `metadataBase` for canonical URL resolution. JSON-LD is rendered as an inline `<script type="application/ld+json">` tag directly in the page Server Component — not via `next/script`.

**Critical finding:** There is a dark mode implementation conflict between what exists in `globals.css` (class-based `.dark`) and what CORE-08 requires (OS `prefers-color-scheme`). The planner must resolve this — see Architecture Patterns below.

**Primary recommendation:** Plan Wave 1 as: (1) pure case-transform functions + CSS custom properties + translations, (2) ToolPage Client Component + SiteNav, (3) page assembly + generateMetadata + JSON-LD. Wave 2 optional cleanup.

---

## Standard Stack

### Core (all already installed — NO npm installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.0 | App Router, generateMetadata, Server Components | Installed version — breaking changes from v14 |
| next-intl | 4.8.3 | i18n — `getTranslations()` (server), `useTranslations()` (client) | v4 API confirmed in existing codebase |
| react | 19.2.4 | UI with React Compiler optimizations | Installed; Compiler handles memoization |
| tailwindcss | ^4 | Styling with v4 syntax (`@theme inline`, `@custom-variant`) | Already configured |
| shadcn/ui | installed | 17 components in `src/components/ui/` | Never edit files there directly |
| sonner | 2.0.7 | Toast notifications for "Copied!" confirmation | Installed, use `toast()` from `sonner` |
| lucide-react | 0.577.0 | Icons (Copy, Trash, Download) | Bundled with shadcn setup |
| next-themes | 0.4.6 | Optional: ThemeProvider for user-toggled dark mode | Installed but NOT yet wired into layout |

### Already Installed shadcn Components

All components needed for Phase 2 are already present in `src/components/ui/`:
`accordion`, `badge`, `button`, `card`, `dropdown-menu`, `label`, `navigation-menu`, `scroll-area`, `sheet`, `skeleton`, `sonner`, `textarea`, `tooltip`

**Installation:** Nothing to install. All dependencies are present.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # MODIFY: replace header with SiteNav; add ThemeProvider if dark mode fix
│   │   └── page.tsx            # REPLACE: add generateMetadata + render ToolPage + FAQ + JSON-LD
│   └── globals.css             # MODIFY: add --color-bg-page, --color-border-brand, --color-navy
├── components/
│   ├── ui/                     # NEVER TOUCH — shadcn primitives
│   ├── site-nav.tsx            # NEW: NavigationMenu (desktop) + Sheet (mobile)
│   ├── tool-page.tsx           # NEW: 'use client' — textarea + toolbar + case tabs
│   ├── faq-section.tsx         # NEW: Server Component — Accordion FAQ
│   ├── tool-cards.tsx          # NEW: Server Component — tool discovery grid
│   └── json-ld.tsx             # NEW: Server Component — <script type="application/ld+json">
└── lib/
    ├── case-transforms.ts      # NEW: 7 pure transform functions + CASE_MODES constant
    └── tools.ts                # EXISTS — tool registry, relatedSlugs
messages/
    ├── en.json                 # EXPAND: add tool, faq, related, seo namespaces
    └── vi.json                 # EXPAND: proper Unicode diacritics (no ASCII approximations)
public/
    └── og/
        └── text-case-converter.png  # NEW: placeholder 1200×630 PNG
```

### Pattern 1: Pure Case Transforms

**What:** All 7 case conversions are pure functions in `src/lib/case-transforms.ts`. No DOM interaction, no side effects.
**When to use:** Called inline in `ToolPage` render — `const output = transformText(inputText, activeMode)`.

```typescript
// Source: CONTEXT.md locked decisions
export type CaseMode = 'sentence' | 'lower' | 'upper' | 'capital' | 'alternating' | 'title' | 'inverse'

export function toSentenceCase(text: string): string {
  // Lowercase all, then capitalize first char after . ! ?
  return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())
}

export function toAlternatingCase(text: string): string {
  // First char lowercase, each subsequent flips
  return text.split('').map((c, i) =>
    i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
  ).join('')
}

export const TITLE_SKIP_WORDS = new Set(['a','an','the','of','in','and','or','but','for','nor'])

export function toTitleCase(text: string): string {
  return text.toLowerCase().split(' ').map((word, i) => {
    if (i === 0 || !TITLE_SKIP_WORDS.has(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return word
  }).join(' ')
}

export function toInverseCase(text: string): string {
  return text.split('').map(c =>
    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
  ).join('')
}

export function transformText(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'sentence': return toSentenceCase(text)
    case 'lower': return text.toLowerCase()
    case 'upper': return text.toUpperCase()
    case 'capital': return toCapitalizedCase(text)
    case 'alternating': return toAlternatingCase(text)
    case 'title': return toTitleCase(text)
    case 'inverse': return toInverseCase(text)
  }
}
```

### Pattern 2: Single-Textarea Design (Input = Output)

**What:** One `<textarea>` shows the transformed result. User types into it; value is always `transformText(inputText, activeMode)`.

**The tricky part:** `onChange` must reverse-transform back to the original or store the raw value separately. The correct approach (per UI-SPEC) is to store `inputText` as the raw input and display `transformText(inputText, activeMode)`. When the user types in the transformed textarea, you call `setInputText(e.target.value)`.

```typescript
// Source: UI-SPEC Component Inventory — ToolPage
const [inputText, setInputText] = useState('')
const [activeMode, setActiveMode] = useState<CaseMode>('sentence')

const output = transformText(inputText, activeMode)
const charCount = output.length
const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0
const lineCount = output ? output.split('\n').length : 0
```

**Important:** When the user types in the textarea, they type into the transformed output. `onChange` should call `setInputText(e.target.value)` — meaning the new raw input becomes whatever they typed. This matches the convertcase.net pattern.

### Pattern 3: generateMetadata for hreflang (SEO-01 + I18N-04)

**What:** Server Component export in `page.tsx`. Uses `alternates.languages` for hreflang links.
**Source:** Verified against `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`

```typescript
// Source: Next.js 16 official docs — generate-metadata.md lines 823-857
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'

const BASE_URL = 'https://textcaseconverter.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })

  const isEn = locale === 'en'
  const canonical = isEn ? `${BASE_URL}/` : `${BASE_URL}/vi/`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/`,
        vi: `${BASE_URL}/vi/`,
      },
    },
    openGraph: {
      images: [`${BASE_URL}/og/text-case-converter.png`],
    },
  }
}
```

**Output HTML verified from docs:**
```html
<link rel="canonical" href="https://textcaseconverter.com/" />
<link rel="alternate" hreflang="en" href="https://textcaseconverter.com/" />
<link rel="alternate" hreflang="vi" href="https://textcaseconverter.com/vi/" />
```

### Pattern 4: JSON-LD in Server Component (SEO-02)

**What:** Inline `<script>` tag in the page Server Component. NOT via `next/script`.
**Source:** Verified against `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`

```typescript
// Source: Next.js 16 official docs — json-ld.md
// XSS safety: replace < with \u003c
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

**Schema shape for SoftwareApplication + HowTo:**
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Text Case Converter',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'HowTo',
      name: t('howto.name'),
      step: [
        { '@type': 'HowToStep', text: t('howto.step1') },
        { '@type': 'HowToStep', text: t('howto.step2') },
        { '@type': 'HowToStep', text: t('howto.step3') },
        { '@type': 'HowToStep', text: t('howto.step4') },
      ],
    },
  ],
}
```

### Pattern 5: next-intl v4 Server vs Client Split

**What:** `getTranslations()` for Server Components/async functions; `useTranslations()` for Client Components (`'use client'`).
**Source:** Verified in existing `src/app/[locale]/layout.tsx` and CONTEXT.md canonical refs.

```typescript
// Server Component (page.tsx, faq-section.tsx, json-ld.tsx)
import { getTranslations } from 'next-intl/server'
const t = await getTranslations({ locale, namespace: 'tool' })

// Client Component (tool-page.tsx — must receive translations as props)
// ToolPage is 'use client' — cannot call getTranslations
// Option A: Pass translations as props from parent Server Component
// Option B: Use useTranslations() hook (requires NextIntlClientProvider in layout — already present)
import { useTranslations } from 'next-intl'
const t = useTranslations('tool')
```

`NextIntlClientProvider` is already in `src/app/[locale]/layout.tsx` — `useTranslations()` will work in Client Components.

### Pattern 6: Tailwind v4 Custom Properties

**What:** CSS custom properties declared in `:root {}` block in `globals.css` using OKLCH or hex.
**Source:** Verified in existing `globals.css` structure.

```css
/* Add to existing :root block in src/app/globals.css */
:root {
  --color-bg-page: #e8f5f2;
  --color-border-brand: #c5e0d8;
  --color-navy: #1a2744;
}
```

Use as `bg-[var(--color-bg-page)]` or `border-[var(--color-border-brand)]` in Tailwind v4.

### Anti-Patterns to Avoid

- **Manual memoization:** Do NOT add `useMemo`/`useCallback` in `ToolPage`. React Compiler handles this — manual optimization conflicts with it.
- **`next/script` for JSON-LD:** JSON-LD is structured data, not executable script. Use native `<script>` tag directly.
- **Editing `src/components/ui/`:** These are shadcn primitives. Create wrapper components in `src/components/` instead.
- **`useState` for derived values:** `charCount`, `wordCount`, `lineCount`, and `output` are all derived from `inputText` + `activeMode`. No separate state needed.
- **Deprecated metadata fields:** `viewport` and `themeColor` in the metadata object are deprecated since Next.js 14. Use `generateViewport()` export instead if needed.
- **ASCII approximations in vi.json:** The UI-SPEC is explicit — "Chuyen doi" is wrong. Must use proper Unicode diacritics ("Chuyển đổi").

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom `isCopied` state + conditional render | `toast()` from `sonner` | Sonner already installed; handles timing, accessibility, stacking |
| Accordion FAQ | Custom expand/collapse state | shadcn `Accordion` | Already installed; handles aria-expanded, keyboard nav |
| Slide-in mobile nav | Custom drawer/overlay | shadcn `Sheet` | Already installed; handles focus trap, ESC key, backdrop |
| Tab role management | Manual aria attributes | Native `role="tab"` + `aria-selected` on `<button>` | shadcn `Tabs` component exists but UI-SPEC calls for custom tab buttons for visual flexibility |
| Horizontal tab scroll | Custom JS scroll | shadcn `ScrollArea` | Already installed; handles hidden scrollbar, snap |
| Navigation menu | Custom dropdown | shadcn `NavigationMenu` | Already installed; handles keyboard navigation, ARIA |
| Dark mode class toggle | Custom JS | `next-themes` `ThemeProvider` | Already installed; handles SSR flash prevention, localStorage |
| Copy to clipboard | Custom `document.execCommand` | `navigator.clipboard.writeText()` | Modern API; handles async/permissions |

**Key insight:** The Phase 1 team pre-installed all needed shadcn components. The risk is building custom versions of things that already exist in `src/components/ui/`.

---

## Common Pitfalls

### Pitfall 1: Dark Mode — Class vs Media Query Conflict (CRITICAL)

**What goes wrong:** `globals.css` line 5 defines `@custom-variant dark (&:is(.dark *))` — this makes `dark:` Tailwind variants respond to the `.dark` CSS class on a parent element, NOT to `@media (prefers-color-scheme: dark)`. CORE-08 requires OS preference to trigger dark mode.

**Why it happens:** shadcn's default setup uses class-based dark mode (for user-toggleable themes via `next-themes`). The UI-SPEC's dark mode toggle button in SiteNav also implies user control, not purely OS-driven.

**How to resolve:** Two valid approaches:
1. **Media query approach (matches CORE-08 literally):** Change `@custom-variant dark` to `@media (prefers-color-scheme: dark)` — removes user toggle capability.
2. **ThemeProvider approach (matches UI-SPEC toggle button):** Wire `next-themes` `ThemeProvider` into `layout.tsx` with `attribute="class" defaultTheme="system" enableSystem` — this adds `.dark` class when OS is dark, satisfying CORE-08 while also allowing manual toggle.

**Recommendation:** Option 2 (ThemeProvider with `enableSystem: true`) satisfies CORE-08 (OS preference activates dark mode by default) AND enables the UI-SPEC's manual toggle button. `next-themes` is already installed.

**Warning signs:** If `dark:` classes have no effect in development, the `.dark` class is not being applied to `<html>` or `<body>`.

### Pitfall 2: params Must Be Awaited

**What goes wrong:** `params` in Next.js 16 App Router is a Promise, not a plain object.

**How to avoid:**
```typescript
// CORRECT — Next.js 16
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
```

### Pitfall 3: generateMetadata Cannot Be in a 'use client' Component

**What goes wrong:** `generateMetadata` is Server Component only. If you add `'use client'` to `page.tsx`, the metadata export is silently ignored.

**How to avoid:** Keep `page.tsx` as a Server Component. Import `ToolPage` (Client Component) as a child.

### Pitfall 4: Sonner Toaster Not in Layout

**What goes wrong:** `toast()` calls from `ToolPage` have no effect unless `<Toaster />` is mounted somewhere above in the tree.

**How to avoid:** Add `<Toaster />` from `sonner` (or `src/components/ui/sonner.tsx`) to `src/app/[locale]/layout.tsx`. Verify it's not already present.

```typescript
// Check: is <Toaster /> already in layout.tsx?
// Current layout.tsx read: it is NOT present — add it in Phase 2
```

### Pitfall 5: Textarea Input/Output Loop

**What goes wrong:** Binding `<textarea value={output} onChange={e => setInputText(e.target.value)}>` causes the user to type transformed text into the input. When they switch modes, the text re-transforms from the transformed text (double transform).

**How to resolve:** This is working as intended per UI-SPEC. When user types "HELLO" with UPPER CASE active, `inputText` stores "HELLO", `output = "HELLO"`. Switching to lower gives `output = "hello"`. This is correct. The "original" is not stored separately.

### Pitfall 6: vi.json ASCII Approximations from Phase 1

**What goes wrong:** Existing `vi.json` uses ASCII approximations ("Chuyen doi" instead of "Chuyển đổi"). The UI-SPEC CRITICAL note says these harm SEO.

**How to avoid:** All new vi.json keys added in Phase 2 MUST use proper Unicode diacritics. Existing Phase 1 ASCII approximation keys (`common.siteName`, `home.heading`, etc.) should be updated to proper Vietnamese as part of Phase 2 work.

### Pitfall 7: Alternating Case Logic

**What goes wrong:** Alternating case that skips non-letter characters resets the alternating rhythm mid-word. e.g. "hello world" — should the space reset the counter? Per the locked decision: "every character alternates" — space counts as a character, so `"hello world"` → `"hElLo wOrLd"`.

---

## Code Examples

### Complete ToolPage State Pattern

```typescript
// Source: UI-SPEC Component Inventory — ToolPage
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { transformText, CASE_MODES, type CaseMode } from '@/lib/case-transforms'
import { toast } from 'sonner'

export function ToolPage() {
  const t = useTranslations('tool')
  const [inputText, setInputText] = useState('')
  const [activeMode, setActiveMode] = useState<CaseMode>('sentence')

  const output = transformText(inputText, activeMode)
  const charCount = output.length
  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0
  const lineCount = output ? output.split('\n').length : 0

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast(t('copyToast'))
  }

  const handleClear = () => setInputText('')

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ... render
}
```

### generateMetadata with hreflang

```typescript
// Source: verified against node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

const BASE_URL = 'https://textcaseconverter.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  const canonical = locale === 'en' ? `${BASE_URL}/` : `${BASE_URL}/vi/`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/`,
        vi: `${BASE_URL}/vi/`,
      },
    },
    openGraph: {
      images: [`${BASE_URL}/og/text-case-converter.png`],
    },
  }
}
```

### Sentence Case Edge Cases

```typescript
// Source: CONTEXT.md locked decision
export function toSentenceCase(text: string): string {
  if (!text) return text
  // Lowercase all, then capitalize after start + sentence-ending punctuation
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())
}
// "HELLO WORLD. HOW ARE YOU?" → "Hello world. How are you?"
// "hello" → "Hello"
// "  hello" → "  Hello" (leading whitespace preserved)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` for next-intl | `src/proxy.ts` (createMiddleware export) | Next.js 16 | proxy.ts must live in `src/` |
| `useMemo`/`useCallback` everywhere | React Compiler handles automatically | React 19 + Compiler | Do NOT add manual memo |
| `next/script` for JSON-LD | Native `<script>` tag in Server Component | Recommended in Next.js 16 docs | Simpler, correct |
| `params.locale` (sync) | `await params` (async Promise) | Next.js 16 | Must await params in page/layout |
| `themeColor` in metadata | `generateViewport()` export | Next.js 14+ | Old field deprecated |
| Tailwind config file `tailwind.config.ts` | Tailwind v4 CSS-first configuration in `globals.css` | Tailwind v4 | No config file — all in CSS |
| shadcn `npx shadcn-ui init` | `npx shadcn init` / `shadcn` package | shadcn 4.x | Package already in dependencies |

**Deprecated/outdated:**
- `viewport` in metadata object: deprecated since Next.js 14 — use `generateViewport()`
- `themeColor` in metadata: deprecated since Next.js 14
- `params.locale` (sync access): will throw in Next.js 16 — always `await params`

---

## Open Questions

1. **Dark mode approach decision**
   - What we know: `globals.css` uses class-based dark; CORE-08 requires OS preference; UI-SPEC shows manual toggle button in SiteNav
   - What's unclear: Should the planner use ThemeProvider (satisfies both) or switch to pure media query (simpler, no toggle)?
   - Recommendation: Use `next-themes` `ThemeProvider` with `defaultTheme="system" enableSystem` — satisfies CORE-08 AND UI-SPEC toggle. Add `<ThemeProvider>` wrapper to `layout.tsx`.

2. **og:image placeholder content**
   - What we know: Path `/og/text-case-converter.png` must exist at 1200×630; actual content is Claude's discretion
   - What's unclear: Does the plan include generating an actual styled image or just a blank placeholder?
   - Recommendation: Use a minimal solid-color PNG with text rendered via Canvas or just a plain colored rectangle — a blank placeholder is explicitly acceptable per CONTEXT.md.

3. **Sonar `<Toaster />` placement**
   - What we know: `<Toaster />` is NOT in `layout.tsx` currently (verified by reading the file)
   - What's unclear: Which plan should add it?
   - Recommendation: Add `<Toaster />` to `layout.tsx` in the same plan that builds `ToolPage` (so copy works immediately).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest or Jest — NOT yet installed/configured |
| Config file | None — Wave 0 gap |
| Quick run command | `npx vitest run src/lib/case-transforms.test.ts` (after setup) |
| Full suite command | `npx vitest run` |

**Note:** The existing plan files reference `src/lib/case-transforms.test.ts` but no test runner is configured. The package.json has no test script. The plans will need to either: (a) use Node's built-in `assert` with a simple test runner, (b) install `vitest`, or (c) use Jest. Given React 19 and ESM, Vitest is the better fit.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CORE-01 | `transformText()` returns correct output for all 7 modes | unit | `npx vitest run src/lib/case-transforms.test.ts` | ❌ Wave 0 |
| CORE-02 | Instant conversion — no async, no submit | unit (pure fn) | same as CORE-01 | ❌ Wave 0 |
| CORE-03 | Copy to clipboard + toast | manual-only | Browser dev tools verify clipboard | N/A |
| CORE-04 | Character/word counts derived correctly | unit | included in case-transforms.test.ts | ❌ Wave 0 |
| CORE-05 | Clear empties input | manual-only | Visual inspection | N/A |
| CORE-06 | Related tools links render | manual-only | Visual inspection at `/` | N/A |
| CORE-07 | FAQ renders with accordion | manual-only | Visual inspection | N/A |
| CORE-08 | Dark mode via OS preference | manual-only | Browser devtools → Emulate prefers-color-scheme | N/A |
| SEO-01 | generateMetadata output per locale | unit (build output) | `next build && grep hreflang .next/` | N/A |
| SEO-02 | JSON-LD present in page HTML | unit (build output) | `next build && grep ld+json .next/` | N/A |
| I18N-04 | hreflang links in `<head>` | unit (build output) | Check alternates in generateMetadata | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run src/lib/case-transforms.test.ts` (covers CORE-01, CORE-02, CORE-04)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green + manual dark mode + manual copy verification

### Wave 0 Gaps
- [ ] `src/lib/case-transforms.test.ts` — unit tests for all 7 transforms (CORE-01, CORE-02, CORE-04)
- [ ] Test runner: install vitest — `npm install -D vitest` — and add `"test": "vitest run"` to package.json scripts
- [ ] `vitest.config.ts` or inline config in `package.json` — needed for TypeScript path aliases (`@/`)

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` — `generateMetadata` signature, `alternates.languages` for hreflang, `metadataBase`, deprecated fields
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md` — JSON-LD inline script pattern, XSS sanitization
- `src/app/[locale]/layout.tsx` — confirmed params-as-Promise pattern, NextIntlClientProvider present, no Toaster
- `src/app/globals.css` — confirmed `@custom-variant dark (&:is(.dark *))` class-based dark mode
- `src/lib/tools.ts` — confirmed `relatedSlugs: ['reverse-text', 'slug-generator']` for case-converter
- `messages/en.json` + `messages/vi.json` — confirmed existing namespace structure, ASCII approximations in vi.json
- `package.json` — confirmed all package versions, no test runner installed

### Secondary (MEDIUM confidence)
- `02-UI-SPEC.md` — approved design contract, component inventory, copywriting contract (project-internal)
- `02-CONTEXT.md` — locked implementation decisions (project-internal)

### Tertiary (LOW confidence)
- None needed — all critical findings verified from installed source files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed from package.json, versions exact
- Architecture: HIGH — verified from Next.js 16 docs in node_modules and existing codebase
- Pitfalls: HIGH — dark mode conflict confirmed by reading globals.css line 5; deprecated APIs confirmed in docs
- Transform logic: HIGH — locked in CONTEXT.md decisions

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable framework versions, no fast-moving dependencies)
