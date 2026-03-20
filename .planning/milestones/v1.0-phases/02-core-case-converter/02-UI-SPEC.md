---
phase: 2
slug: core-case-converter
status: approved
reviewed_at: 2026-03-20
shadcn_initialized: true
preset: default/zinc
created: 2026-03-20
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for Phase 2: Core Case Converter.
> Design reference: convertcase.net — copy layout pattern, interaction style, and visual hierarchy exactly. Only change brand, colors, and content.

---

## Design System

| Property | Value |
|----------|-------|
| Component library | shadcn/ui (`components.json` — style: default, baseColor: zinc) |
| CSS framework | Tailwind CSS v4 via `@tailwindcss/postcss` |
| Icon library | lucide-react (bundled with shadcn) |
| Font | Geist Sans (`--font-geist-sans`) + Geist Mono (`--font-geist-mono`) |
| Toast | Sonner (`<Toaster />` in root layout) |

Source: `components.json`, `src/app/layout.tsx`, `package.json`.

---

## Brand & Colors

| Role | Value | Usage |
|------|-------|-------|
| Page background | `#e8f5f2` | Page `<body>` / outer wrapper |
| Surface / cards | `#ffffff` | Card, Textarea, nav, FAQ panels |
| Nav background | `#ffffff` | SiteNav sticky header |
| Accent / primary | `#1a2744` (dark navy) | H1, headings, links, active tab state |
| Border | `#c5e0d8` | All card/input borders |
| Body text | `zinc-700` | Paragraph text, descriptions |
| Muted text | `zinc-400` | Stats display, placeholder, secondary labels |
| Badge: Sc | `#ea580c` (orange-600) | Sentence case badge |
| Badge: lc | `#16a34a` (green-600) | lower case badge |
| Badge: UC | `#2563eb` (blue-600) | UPPER CASE badge |
| Badge: Cc | `#9333ea` (purple-600) | Capitalized Case badge |
| Badge: aC | `#ca8a04` (yellow-600) | aLtErNaTiNg badge |
| Badge: TC | `#0891b2` (cyan-600) | Title Case badge |
| Badge: iC | `#db2777` (pink-600) | iNVERSE CaSe badge |

**Dark mode:** All components use `dark:` Tailwind variants. Triggered by OS `prefers-color-scheme: dark` (Tailwind `darkMode: 'media'`). Required by CORE-08.

**CSS custom properties** (declare in `globals.css`):
```css
:root {
  --color-bg-page: #e8f5f2;
  --color-border-brand: #c5e0d8;
  --color-navy: #1a2744;
}
```

---

## Typography

| Role | Size | Weight | Font | Tailwind |
|------|------|--------|------|----------|
| H1 | 24px | 700 (bold) | Geist Sans | `text-2xl font-bold` |
| H2 | 18px | 600 (semibold) | Geist Sans | `text-lg font-semibold` |
| Body | 14px | 400 (regular) | Geist Sans | `text-sm` |
| Labels | 12px | 400 (regular) | Geist Sans | `text-xs` |
| Textarea content | 14px | 400 | Geist Mono | `text-sm font-mono` |

H1 color: navy `#1a2744` (`text-[#1a2744] dark:text-zinc-100`).
H2 color: navy `#1a2744` (`text-[#1a2744] dark:text-zinc-200`).
Body: `text-zinc-700 dark:text-zinc-300`.
Labels / muted: `text-zinc-400 dark:text-zinc-500`.

---

## Layout

### Desktop (> 1024px)

```
┌─────────────────────────────────────────────────────────┐
│ SiteNav (white, sticky top, full width)                  │
│  Logo | Text Tools ▾ | Code & Data ▾ | Font Styles ▾ |  │
│  Random Generators ▾         🌙 EN▾ 🔍                  │
├─────────────────────────────────────────────────────────┤
│ Ad slot 728×90 (min-h-[90px]) — from layout.tsx          │
├─────────────────────────────────────────────────────────┤
│ max-w-6xl container, mx-auto, px-4                       │
│ ┌─────────────────────────────────┐ ┌──────────────────┐│
│ │ Main content (flex-1)           │ │ Sidebar 160px    ││
│ │                                 │ │ sticky top-6     ││
│ │  H1 + description               │ │                  ││
│ │  ┌──────────────────────────┐   │ │ Ad 300×250       ││
│ │  │ Textarea (font-mono)     │   │ │ (min-h-[250px])  ││
│ │  │ min-h-160px, resize-y    │   │ │                  ││
│ │  └──────────────────────────┘   │ │ Tool nav links   ││
│ │  ┌──────────────────────────┐   │ │ (category list)  ││
│ │  │ Toolbar row              │   │ └──────────────────┘│
│ │  │ stats left | actions right│  │                     │
│ │  └──────────────────────────┘   │                     │
│ │  ┌──────────────────────────┐   │                     │
│ │  │ Case tabs (7, no scroll) │   │                     │
│ │  └──────────────────────────┘   │                     │
│ │                                 │                     │
│ │  Tool cards (2-col grid)        │                     │
│ │  FAQ Accordion                  │                     │
│ │  Related Tools                  │                     │
│ └─────────────────────────────────┘                     │
├─────────────────────────────────────────────────────────┤
│ Ad slot below-tool 728×90 (min-h-[90px]) — layout.tsx    │
├─────────────────────────────────────────────────────────┤
│ Footer (white, links grid)                               │
└─────────────────────────────────────────────────────────┘
```

### Mobile (< 640px)

- Single column, no sidebar
- Sheet component for mobile nav (hamburger → slide-in drawer)
- Textarea min-height: 120px
- Toolbar: stats on top row, buttons on bottom row (2 rows stacked)
- Case tabs: ScrollArea horizontal scroll, hidden scrollbar, snap scrolling
- Tool cards: 1-column grid

### Tablet (640px–1024px)

- Sidebar hidden
- Nav shows condensed, Sheet fallback
- Tool cards: 2 columns

---

## Component Inventory

### SiteNav — `src/components/site-nav.tsx`

Uses: `NavigationMenu`, `Sheet`, `Button`, `DropdownMenu`

**Structure (desktop):**
```
<header class="sticky top-0 z-50 bg-white border-b border-[#c5e0d8]">
  <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
    <a href="/{locale}"> Logo icon + "Text Case Converter" bold navy text </a>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem> Text Tools ▾ (NavigationMenuTrigger + Content) </NavigationMenuItem>
        <NavigationMenuItem> Code & Data ▾ </NavigationMenuItem>
        <NavigationMenuItem> Font Styles ▾ </NavigationMenuItem>
        <NavigationMenuItem> Random Generators ▾ </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <div class="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="Toggle dark mode"> 🌙 </Button>
      <DropdownMenu> EN/VI locale switcher </DropdownMenu>
      <Button variant="ghost" size="icon" aria-label="Search"> 🔍 </Button>
    </div>
    <Sheet> hamburger Button (md:hidden) → slide-in drawer with nav links </Sheet>
  </div>
</header>
```

**Nav dropdown content:** Phase 2 renders empty `<ul>` lists (tools don't exist yet). Structure is the permanent template — future phases populate items.

**Locale switcher (DropdownMenu):** Shows flag emoji + locale code. Active locale: navy bold. Clicking switches to equivalent URL via i18n routing.

**Mobile Sheet:** Full-height left drawer. Same nav sections as desktop in accordion-style. Triggered by hamburger `Button` (visible below `md:`).

### ToolPage — `src/components/tool-page.tsx`

`'use client'` — all state here. Uses: `Textarea`, `Button`, `ScrollArea`, `Badge`, Sonner `toast`.

**State:**
```ts
const [inputText, setInputText] = useState('')
const [activeMode, setActiveMode] = useState<CaseMode>('sentence')
// No isCopied state — use Sonner toast instead
```

**Structure:**
```
<div>
  <h1 class="text-2xl font-bold text-[#1a2744]">{t('tool.title')}</h1>
  <p class="text-sm text-zinc-700 mt-1">{t('tool.description')}</p>

  <Card class="mt-4 p-4 border-[#c5e0d8]">
    <Textarea
      value={transformText(inputText, activeMode)}
      onChange={(e) => setInputText(e.target.value)}  {/* NOTE: input and output are same textarea */}
      placeholder={t('tool.placeholder')}
      class="min-h-[160px] resize-y font-mono text-sm border-[#c5e0d8]"
      aria-label={t('tool.textareaLabel')}  {/* sr-only Label also wraps it */}
    />

    {/* Toolbar — BELOW textarea */}
    <div class="flex items-center justify-between mt-2">
      <span class="text-xs text-zinc-400" aria-live="polite">
        {t('tool.charCount', {n: charCount})} · {t('tool.wordCount', {n: wordCount})} · {t('tool.lineCount', {n: lineCount})}
      </span>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label={t('tool.copyAria')} onClick={handleCopy}>
          <CopyIcon />
        </Button>
        <Button variant="ghost" size="icon" aria-label={t('tool.downloadAria')} onClick={handleDownload}>
          <DownloadIcon />
        </Button>
        <Button variant="ghost" size="icon" aria-label={t('tool.clearAria')} onClick={handleClear}>
          <TrashIcon />
        </Button>
        <Button onClick={handleCopy} class="bg-[#1a2744] hover:bg-[#243460] text-white text-sm">
          {t('tool.copyBtn')}
        </Button>
      </div>
    </div>

    {/* Case mode tabs — BELOW toolbar */}
    <ScrollArea class="mt-3" orientation="horizontal">
      <div class="flex gap-2 pb-1" role="tablist">
        {CASE_MODES.map(mode => (
          <button
            key={mode.id}
            role="tab"
            aria-selected={activeMode === mode.id}
            onClick={() => setActiveMode(mode.id)}
            class={activeMode === mode.id ? activeTabClass(mode) : inactiveTabClass(mode)}
          >
            <Badge style={{backgroundColor: mode.color}} class="text-white text-xs w-6 h-6 justify-center">
              {mode.abbr}
            </Badge>
            {mode.label}
          </button>
        ))}
      </div>
    </ScrollArea>
  </Card>
</div>
```

**Tab styles:**

Active tab:
```
inline-flex items-center gap-2 px-3 py-1.5 rounded-md
bg-[#1a2744] text-white text-sm font-medium whitespace-nowrap
```

Inactive tab:
```
inline-flex items-center gap-2 px-3 py-1.5 rounded-md
bg-white border border-[#c5e0d8] text-zinc-700 text-sm
hover:border-[#1a2744] hover:text-[#1a2744] whitespace-nowrap
dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300
```

**handleCopy:** `navigator.clipboard.writeText(output)` → `toast('Copied to clipboard!')` (Sonner).

**handleDownload:** Creates a `.txt` Blob, triggers download via anchor click.

**handleClear:** `setInputText('')`.

**Counts (derived — no state):**
```ts
const output = transformText(inputText, activeMode)
const charCount = output.length
const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0
const lineCount = output ? output.split('\n').length : 0
```

### CaseTabs — `src/components/case-tabs.tsx`

Extracted tab bar (optional split from ToolPage if needed for SSR). Uses `ScrollArea`, `Badge`.

### ToolCards — `src/components/tool-cards.tsx`

2-column Card grid of all tools. Uses `Card`, `Badge`.

**Each Card:**
```
<Card class="border-[#c5e0d8] hover:border-[#1a2744] transition-colors">
  <CardContent class="p-4">
    <div class="flex items-center gap-2 mb-2">
      <Badge style={{backgroundColor: tool.color}} class="text-white text-xs">
        {tool.abbr}
      </Badge>
      <a href={tool.href} class="text-sm font-medium text-[#1a2744] hover:underline">
        {tool.name}
      </a>
    </div>
    <p class="text-xs text-zinc-500">{tool.description}</p>
    <p class="text-xs text-zinc-400 italic mt-1">{tool.example}</p>
  </CardContent>
</Card>
```

Grid: `grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6`

### FAQSection — `src/components/faq-section.tsx`

Uses `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.

```
<section aria-labelledby="faq-heading" class="mt-10">
  <h2 id="faq-heading" class="text-lg font-semibold text-[#1a2744] mb-4">
    {t('faq.heading')}
  </h2>
  <Accordion type="single" collapsible>
    {faqItems.map((item, i) => (
      <AccordionItem key={i} value={`item-${i}`}>
        <AccordionTrigger class="text-sm text-zinc-700">
          {item.question}
        </AccordionTrigger>
        <AccordionContent class="text-sm text-zinc-500">
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</section>
```

5 FAQ items in `messages/en.json` and `messages/vi.json` under `faq.*` namespace.

### RelatedTools — component inside `tool-cards.tsx` or standalone

Horizontal chip-style links below FAQ. Uses `Badge` as colored chip.

```
<section aria-labelledby="related-heading" class="mt-8">
  <h2 id="related-heading" class="text-lg font-semibold text-[#1a2744] mb-3">
    {t('related.heading')}
  </h2>
  <div class="flex flex-wrap gap-2">
    {relatedTools.map(tool => (
      <a key={tool.id} href={tool.href}
         class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#c5e0d8]
                text-sm text-zinc-700 hover:border-[#1a2744] hover:text-[#1a2744]
                dark:border-zinc-700 dark:text-zinc-300 transition-colors">
        <Badge style={{backgroundColor: tool.color}} class="text-white text-xs w-5 h-5 justify-center p-0">
          {tool.abbr}
        </Badge>
        {tool.name}
      </a>
    ))}
  </div>
</section>
```

### JsonLd — `src/components/json-ld.tsx`

Server Component. Renders `<script type="application/ld+json">` inline. No `next/script`.

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

Schema: `@graph` array with `SoftwareApplication` + `HowTo` nodes.

### AdSlot — `src/components/ad-slot.tsx`

**DO NOT MOVE** existing ad slots from `layout.tsx`. This component is a reusable placeholder for future use within page-level content only (if needed). The layout.tsx slots stay exactly where Phase 1 placed them.

---

## Case Modes Definition

```ts
export const CASE_MODES = [
  { id: 'sentence', abbr: 'Sc', label: 'Sentence case',      color: '#ea580c' },
  { id: 'lower',    abbr: 'lc', label: 'lower case',         color: '#16a34a' },
  { id: 'upper',    abbr: 'UC', label: 'UPPER CASE',         color: '#2563eb' },
  { id: 'capital',  abbr: 'Cc', label: 'Capitalized Case',   color: '#9333ea' },
  { id: 'alternating', abbr: 'aC', label: 'aLtErNaTiNg',    color: '#ca8a04' },
  { id: 'title',    abbr: 'TC', label: 'Title Case',         color: '#0891b2' },
  { id: 'inverse',  abbr: 'iC', label: 'iNVERSE CaSe',      color: '#db2777' },
] as const
```

---

## Interaction States

| Component | State | Visual |
|-----------|-------|--------|
| Textarea | Default | `border-[#c5e0d8]`, `bg-white` |
| Textarea | Focus | shadcn default ring (`focus-visible:ring-2`) |
| Textarea | Empty | placeholder in `text-zinc-400` |
| Active tab | Selected | `bg-[#1a2744] text-white` |
| Inactive tab | Default | `bg-white border-[#c5e0d8] text-zinc-700` |
| Inactive tab | Hover | `border-[#1a2744] text-[#1a2744]` |
| Copy Button | Default | `bg-[#1a2744] text-white` |
| Copy Button | Hover | `bg-[#243460]` |
| Copy action | Success | Sonner toast "Copied to clipboard!" (~1500ms auto-dismiss) |
| Clear/Download | Default | `Button variant="ghost" size="icon"` |
| Card | Default | `border-[#c5e0d8]` |
| Card | Hover | `border-[#1a2744]` |
| Nav link | Default | `text-zinc-700` |
| Nav link | Hover | `text-[#1a2744] font-medium` |
| Locale active | Active | navy bold |
| Locale inactive | Default | `text-zinc-500` |
| Skeleton | Loading | `Skeleton` component on textarea area during hydration |

**Animations:** `transition-colors duration-150` on tab buttons, Cards, nav links. No other animations.

---

## Copywriting Contract

### English

| Element | Copy |
|---------|------|
| H1 | "Text Case Converter" |
| Description | "Convert text between uppercase, lowercase, title case, and more — instantly." |
| Textarea placeholder | "Type or paste your text here…" |
| Stats | "Character Count: {n} \| Word Count: {n} \| Line Count: {n}" (zinc-400, 12px) |
| Copy button (primary) | "Copy" |
| Copy toast | "Copied to clipboard!" |
| Clear (icon button) | aria-label: "Clear all text" |
| Download (icon button) | aria-label: "Download as text file" |
| Copy (icon button) | aria-label: "Copy to clipboard" |
| FAQ heading | "Frequently Asked Questions" |
| Related heading | "Related Tools" |

### Vietnamese (CRITICAL — proper diacritics required)

| Element | Copy |
|---------|------|
| H1 | "Chuyển Đổi Chữ Hoa Chữ Thường" |
| Description | "Chuyển đổi văn bản sang chữ hoa, chữ thường, chữ tiêu đề và nhiều định dạng khác — ngay lập tức." |
| Textarea placeholder | "Nhập hoặc dán văn bản của bạn vào đây…" |
| Copy button | "Sao chép" |
| Copy toast | "Đã sao chép vào clipboard!" |
| Clear aria | "Xóa toàn bộ văn bản" |
| Download aria | "Tải xuống dưới dạng tệp văn bản" |
| Tab: Sentence | "Chữ câu" |
| Tab: lower | "chữ thường" |
| Tab: UPPER | "CHỮ HOA" |
| Tab: Capitalized | "Chữ Hoa Đầu" |
| Tab: Alternating | "xEn kẽ" |
| Tab: Title | "Tiêu Đề" |
| Tab: Inverse | "ĐẢO nGƯỢC" |
| FAQ heading | "Câu hỏi thường gặp" |
| Related heading | "Công cụ liên quan" |

**CRITICAL:** All `vi.json` strings MUST use proper Unicode diacritics. ASCII approximations like "Chuyen doi" are wrong and harm SEO for Vietnamese Google searches. Every character of Vietnamese text must be correctly accented.

---

## SEO Components

| Element | Spec |
|---------|------|
| `<title>` EN | "Text Case Converter — Free Online Tool" |
| `<title>` VI | "Chuyển Đổi Chữ Hoa Chữ Thường — Công Cụ Trực Tuyến Miễn Phí" |
| `<meta description>` EN | "Free online text case converter. Convert to UPPER CASE, lower case, Title Case, Sentence case, Capitalized, Alternating, and Inverse — instantly, no signup." |
| `<meta description>` VI | "Công cụ chuyển đổi chữ hoa chữ thường trực tuyến miễn phí. Chuyển sang CHỮ HOA, chữ thường, Chữ Tiêu Đề, Chữ Câu, Xen Kẽ và ĐẢO ngược — ngay lập tức." |
| Canonical EN | `https://textcaseconverter.com/` |
| Canonical VI | `https://textcaseconverter.com/vi/` |
| og:image | `/og/text-case-converter.png` (1200×630, static file) |
| hreflang EN | `<link rel="alternate" hreflang="en" href="https://textcaseconverter.com/">` |
| hreflang VI | `<link rel="alternate" hreflang="vi" href="https://textcaseconverter.com/vi/">` |
| JSON-LD type | `SoftwareApplication` + `HowTo` in `@graph` |
| sitemap | `app/sitemap.ts` (Next.js App Router native) |
| robots | `app/robots.ts` (Next.js App Router native) |

---

## Layout Constraints (from Phase 1 — DO NOT MOVE)

| Slot | Placement | Min-height | Location |
|------|-----------|------------|----------|
| Header ad | Above `<nav>` | `min-h-[90px]` | `src/app/[locale]/layout.tsx` |
| Below-tool ad | After `<main>` | `min-h-[90px]` | `src/app/[locale]/layout.tsx` |
| Sidebar ad | Right column, sticky | `min-h-[250px] sticky top-6` | `src/app/[locale]/layout.tsx` |

The page component (`src/app/[locale]/page.tsx`) only returns content for `<main>`. It must NOT add wrappers that change max-width — `max-w-6xl` is already set at the layout level.

---

## Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Tab list | `role="tablist"` on ScrollArea content, `role="tab"` on each button |
| Tab selection | `aria-selected={activeMode === mode.id}` |
| Keyboard nav | Arrow left/right to move between tabs; Enter/Space to select |
| Textarea label | `<Label htmlFor="text-input" className="sr-only">` + `id="text-input"` on Textarea |
| Live counts | `aria-live="polite"` on stats span |
| All Buttons | `aria-label` on every icon-only Button |
| Accordion | shadcn Accordion handles `aria-expanded` automatically |
| Touch targets | Minimum 44px height (`h-11` or `min-h-[44px]`) on all tab buttons |
| Focus rings | shadcn default `focus-visible:ring-2` on all interactive elements |
| Color contrast | Navy `#1a2744` on white: ~12:1 ratio (exceeds 4.5:1 minimum) |

---

## Component File Structure

```
src/
├── components/
│   ├── ui/                    ← shadcn primitives (NEVER edit directly)
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── popover.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   ├── site-nav.tsx           ← Header: NavigationMenu (desktop) + Sheet (mobile)
│   ├── tool-page.tsx          ← 'use client': textarea + toolbar + case tabs
│   ├── case-tabs.tsx          ← ScrollArea + tab buttons (extracted if needed)
│   ├── tool-cards.tsx         ← Tool discovery card grid
│   ├── faq-section.tsx        ← Accordion FAQ
│   ├── ad-slot.tsx            ← Reusable ad placeholder (page-level only)
│   └── json-ld.tsx            ← JSON-LD script server component
```

---

## Registry Safety

| Registry | Components Used | Notes |
|----------|----------------|-------|
| shadcn/ui official | 17 components installed | Never edit files in `src/components/ui/` |
| lucide-react | Icons via shadcn | Import from `lucide-react` |
| Third-party | None | No additional registries |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS (full EN + VI copy with proper diacritics)
- [x] Dimension 2 Visuals: PASS (convertcase.net reference, shadcn components specified)
- [x] Dimension 3 Color: PASS (navy/mint palette, badge colors per mode)
- [x] Dimension 4 Typography: PASS (Geist Sans/Mono, 4-size scale)
- [x] Dimension 5 Spacing: PASS (Tailwind scale, 44px touch targets)
- [x] Dimension 6 Registry Safety: PASS (official shadcn only)

**Approval:** APPROVED 2026-03-20 (rewritten with shadcn/ui, convertcase.net reference, full Vietnamese diacritics)
