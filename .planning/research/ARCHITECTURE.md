# Architecture Research

**Domain:** Multilingual text utility webapp (Next.js App Router + next-intl, EN/VI, SSG)
**Researched:** 2026-03-19
**Confidence:** HIGH — verified against Next.js 16.2.0 bundled docs in node_modules and next-intl official docs

---

## Critical: This is Next.js 16, Not 14

The installed version is `next@16.2.0`. Key differences from Next.js 14 training data:
- `middleware.ts` is **deprecated** and renamed to `proxy.ts` (export `proxy` not `middleware`)
- `'use cache'` directive is available for cache components (new in 15+)
- `PageProps` and `LayoutProps` are globally available TypeScript helpers
- `params` is now a `Promise` that must be awaited

All architecture decisions below reflect the **actual installed version**.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      BUILD TIME (SSG)                            │
│                                                                  │
│  generateStaticParams() → 40 tools × 2 locales = 80 HTML files  │
│  generateMetadata()     → per-page title/description/og/hreflang │
│  getDictionary()        → server-only, zero client bundle cost   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ static HTML served from CDN
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST (Edge / CDN)                           │
│                                                                  │
│  proxy.ts (next-intl createMiddleware)                           │
│   - locale detection from Accept-Language / cookie               │
│   - /slug → EN page (localePrefix: 'as-needed')                  │
│   - /vi/slug → VI page                                           │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                              │
│                                                                  │
│  Static HTML hydrated → React takes over                         │
│  'use client' ToolUI  →  text transform runs in browser          │
│  useState(inputText)  →  zero network round-trips                │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `proxy.ts` | Locale detection, URL rewriting (EN no prefix, VI with `/vi/`) | `createMiddleware` from `next-intl/middleware` |
| `[locale]/layout.tsx` | Root HTML shell, `<html lang>`, nav, footer, AdSense slot divs, dark mode | Server Component, sets `setRequestLocale` |
| `[locale]/page.tsx` | Homepage with 7-mode case converter | Server Component shell + Client Component tool |
| `[locale]/[tool]/page.tsx` | Individual tool page | Server Component shell + shared Client Component |
| `ToolPage` (shared component) | Renders any tool via config object; textarea, tabs, output | `'use client'` component |
| `tool-registry.ts` | Central config: slug, transformFn, i18n keys, schema data | Pure TS module, no React |
| `getDictionary(locale)` | Loads JSON translations server-side | `server-only`, dynamic import |
| `generateMetadata()` | Per-page SEO: title, description, canonical, og:image, hreflang | Async Server Component function |
| JSON-LD script | Schema.org SoftwareApplication + HowTo inline in `<section>` | Native `<script>` tag in page Server Component |
| AdSense slot divs | Placeholder DOM nodes for future ad activation | Static divs with `data-ad-slot` attrs + HTML comments |

---

## Recommended Project Structure

```
text-case-converter/
├── proxy.ts                          # next-intl middleware (locale routing)
├── next.config.ts                    # output: 'export' for full SSG (or Vercel default)
├── next-sitemap.config.js            # sitemap generation config
├── src/
│   ├── i18n/
│   │   ├── routing.ts                # defineRouting({ locales, defaultLocale, localePrefix })
│   │   ├── request.ts                # getRequestConfig — loads dictionary per request
│   │   └── navigation.ts             # createNavigation exports (Link, redirect, useRouter)
│   ├── dictionaries/
│   │   ├── en.json                   # All EN strings (tool names, descriptions, UI)
│   │   └── vi.json                   # All VI strings
│   ├── lib/
│   │   ├── tool-registry.ts          # Master list of 40+ tools with config
│   │   ├── tools/                    # One file per tool transform function
│   │   │   ├── case-transforms.ts    # sentence, lower, upper, title, etc.
│   │   │   ├── reverse-text.ts
│   │   │   ├── base64.ts
│   │   │   ├── slug-generator.ts
│   │   │   ├── password-generator.ts
│   │   │   └── ...                   # 30+ more tools
│   │   └── seo/
│   │       └── jsonld.ts             # buildSoftwareApplicationSchema(), buildHowToSchema()
│   ├── components/
│   │   ├── tool/
│   │   │   ├── ToolPage.tsx          # 'use client' — shared textarea UI for all tools
│   │   │   ├── ToolTabs.tsx          # 'use client' — tab switcher (homepage only)
│   │   │   └── AdSlot.tsx            # Placeholder div component
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Nav + locale switcher
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx           # Ad slot placeholder
│   │   └── ui/                       # Generic atoms (Button, Textarea, etc.)
│   └── app/
│       ├── [locale]/
│       │   ├── layout.tsx            # Root layout: html lang, nav, generateStaticParams
│       │   ├── page.tsx              # Homepage: 7-mode case converter
│       │   └── [tool]/
│       │       └── page.tsx          # Dynamic tool page — single file for all 40+ tools
│       ├── sitemap.ts                # OR use next-sitemap post-build
│       ├── robots.ts
│       └── globals.css
```

### Structure Rationale

- **`src/i18n/`**: next-intl requires exactly these three files (`routing.ts`, `request.ts`, `navigation.ts`). Grouping them makes the i18n contract explicit.
- **`src/lib/tool-registry.ts`**: Central manifest drives route generation, sitemap, and page rendering. Changing one entry adds/removes a page from the entire site automatically.
- **`src/lib/tools/`**: Transform functions are pure TypeScript with no React. They are imported by the `'use client'` ToolPage and by any future test suite. Keeping them separate from UI is the key separation of concerns.
- **`app/[locale]/[tool]/page.tsx`**: A single dynamic route file handles all 40+ tool pages. `generateStaticParams()` enumerates every tool slug at build time. This avoids 40+ near-identical page files.
- **`proxy.ts` at root**: next-intl's `createMiddleware` must be at project root (same level as `src/`). It is not inside `src/app/`.

---

## Architectural Patterns

### Pattern 1: Single Dynamic Route for All Tools

**What:** One `app/[locale]/[tool]/page.tsx` file serves all 40+ tool pages via `generateStaticParams`. The page reads the `tool` param, looks up the tool config in `tool-registry.ts`, and renders the shared `ToolPage` component.

**When to use:** Any time you have many pages with identical structure but different data/behavior — avoids 40 near-identical files.

**Trade-offs:** All tools share one build entry point (good: DRY). Debugging one tool's build failure may affect all. Individual tool pages cannot have fully custom layouts without branching.

```typescript
// app/[locale]/[tool]/page.tsx

export async function generateStaticParams() {
  const tools = getToolRegistry()
  const locales = routing.locales
  return locales.flatMap(locale =>
    tools.map(tool => ({ locale, tool: tool.slug }))
  )
}

export default async function ToolPageRoute({
  params,
}: PageProps<'/[locale]/[tool]'>) {
  const { locale, tool: toolSlug } = await params
  setRequestLocale(locale)

  const toolConfig = getToolBySlug(toolSlug)
  if (!toolConfig) notFound()

  const dict = await getDictionary(locale)

  const jsonLd = buildSoftwareApplicationSchema(toolConfig, locale, dict)

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ToolPage config={toolConfig} dict={dict} />
    </section>
  )
}
```

### Pattern 2: Tool Registry as Single Source of Truth

**What:** A central `tool-registry.ts` exports an array of tool config objects. Every tool slug, its transform function reference, its i18n key, its category, and its schema type live in one place.

**When to use:** Required when a single dynamic route must serve 40+ different tools without per-tool page files.

**Trade-offs:** Adding a new tool is one array entry (great). The registry becomes the critical path — a typo here breaks the build for all tools.

```typescript
// src/lib/tool-registry.ts
export interface ToolConfig {
  slug: string                    // URL: /reverse-text, /vi/reverse-text
  i18nKey: string                 // key in en.json / vi.json
  category: 'text' | 'code' | 'font' | 'random'
  transform: (input: string, options?: Record<string, unknown>) => string
  modes?: string[]                // for multi-mode tools like case converter
  schemaType: 'SoftwareApplication' | 'WebApplication'
}

export const TOOLS: ToolConfig[] = [
  {
    slug: 'reverse-text',
    i18nKey: 'tools.reverseText',
    category: 'text',
    transform: reverseText,
    schemaType: 'WebApplication',
  },
  // ... 39 more
]
```

### Pattern 3: Server Component Shell + Client Component Tool UI

**What:** Each tool page is a Server Component (handles metadata, JSON-LD, dict loading, AdSense shell) that renders a Client Component (`ToolPage`) for the interactive textarea.

**When to use:** Always for SSG + interactive UI. Server Component handles SEO-critical static content; Client Component handles real-time user input.

**Trade-offs:** Keeps hydration bundle small (transform logic stays client-side but not in server HTML). The Client Component boundary means props passed across it must be serializable — pass `dict` strings and a serializable config, not function references.

**Key constraint:** The transform function itself cannot be passed as a prop across the Server→Client boundary. The Client Component must import functions from `tool-registry` directly or receive the slug and do a client-side lookup.

### Pattern 4: localePrefix: 'as-needed' for EN/VI URL Shape

**What:** next-intl routing configured with `localePrefix: 'as-needed'` means EN pages have no prefix (`/reverse-text`) while VI pages have the prefix (`/vi/reverse-text`). This matches the project's URL design.

**When to use:** When the default locale should have clean URLs without a locale segment.

**Trade-offs:** EN is implicitly the default; hreflang tags must still explicitly reference both `en` and `vi` with full URLs. The proxy handles detection and rewriting transparently.

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',   // /slug for EN, /vi/slug for VI
})
```

---

## Data Flow

### Build-Time SSG Flow

```
next build
  │
  ├─ generateStaticParams() in [locale]/layout.tsx
  │    returns [{ locale: 'en' }, { locale: 'vi' }]
  │
  ├─ generateStaticParams() in [locale]/[tool]/page.tsx
  │    TOOLS.flatMap → 40 tools × 2 locales = 80 route params
  │
  ├─ For each route param:
  │    generateMetadata({ params }) → title, description, hreflang, canonical
  │    getDictionary(locale)        → loads en.json or vi.json (server-only)
  │    buildJsonLd(toolConfig)      → SoftwareApplication + HowTo schema
  │    render ToolPage props        → static HTML with AdSense divs
  │
  └─ Output: 82 HTML files (80 tools + homepage×2) + sitemap.xml
```

### Request-Time Flow (deployed)

```
User request: GET /reverse-text
  │
  ├─ proxy.ts (next-intl middleware)
  │    detects no locale prefix → EN default
  │    serves pre-built /reverse-text.html from CDN
  │
  └─ Browser: hydration
       ToolPage ('use client') activates
       User types in textarea → transform(input) → output rendered
       Zero network requests (all transforms are client-side pure functions)
```

### Client-Side Text Transform Flow

```
User input (textarea onChange)
  │
  ├─ React state: setInputText(value)
  │
  ├─ useMemo/useCallback: result = toolConfig.transform(inputText)
  │    (pure function, synchronous, no async, no API calls)
  │
  └─ Rendered output div updated immediately
       copy-to-clipboard button available
```

### Key Data Flows

1. **i18n strings → UI:** `getDictionary(locale)` runs server-side at build time, strings passed as props to Client Component. Zero translation JSON in client bundle.
2. **Tool config → page:** `getToolBySlug(slug)` at build time in Server Component. Only the serializable config fields (slug, i18nKey, modes array) cross the Server→Client boundary; transform function is imported directly by the Client Component.
3. **SEO metadata → head:** `generateMetadata()` returns Next.js `Metadata` object; framework injects `<title>`, `<meta>`, `<link rel="alternate" hreflang>` automatically.
4. **JSON-LD → page:** Native `<script type="application/ld+json">` rendered inside Server Component, available in static HTML for crawlers before JS executes.

---

## SSG Page Count

| Route | Pages Generated |
|-------|----------------|
| `/` (EN homepage) | 1 |
| `/vi` (VI homepage) | 1 |
| `/[tool]` (EN, 40 tools) | 40 |
| `/vi/[tool]` (VI, 40 tools) | 40 |
| **Total** | **82 HTML files** |

`generateStaticParams` must be defined in both `[locale]/layout.tsx` (returns the 2 locales) and `[locale]/[tool]/page.tsx` (returns all tool slugs). The framework computes the cartesian product.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k users/day | Static files on Vercel CDN — no server needed, scales to any traffic free/cheaply |
| 10k-500k users/day | Same architecture — CDN handles it; monitor Core Web Vitals, optimize CSS bundle |
| 500k+ users/day | Consider ISR if tools become data-driven; add Redis caching only if dynamic content is introduced |

### Scaling Priorities

1. **First bottleneck:** Build time as tools grow. At 100+ tools × 2 locales = 200+ pages, build remains fast (sub-60s) since pages are simple static HTML with no external data fetching.
2. **Second bottleneck:** JavaScript bundle size from many transform functions. Mitigation: lazy-import transforms by tool slug (`import('../lib/tools/' + slug)`) so only the active tool's code loads client-side.

---

## Anti-Patterns

### Anti-Pattern 1: Individual Page Files per Tool

**What people do:** Create `app/[locale]/reverse-text/page.tsx`, `app/[locale]/base64/page.tsx`, etc. — 40+ near-identical files.

**Why it's wrong:** Every new tool requires copying boilerplate. Metadata patterns, JSON-LD, and AdSense slots must be updated in 40+ places. Tool registry pattern becomes impossible.

**Do this instead:** Single `app/[locale]/[tool]/page.tsx` with `generateStaticParams` driven by `tool-registry.ts`.

### Anti-Pattern 2: Passing Transform Functions as React Props

**What people do:** `<ToolPage transform={config.transform} />` — passes a function reference across the Server→Client boundary.

**Why it's wrong:** Functions are not serializable and cannot cross the Server Component boundary. Next.js will throw at build time: "Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'."

**Do this instead:** Pass the tool `slug` (a string) as a prop. Inside the Client Component, import the transform registry and call `TOOLS_MAP[slug].transform(input)`.

### Anti-Pattern 3: Importing Translation Files in Client Components

**What people do:** `import enMessages from '../../dictionaries/en.json'` inside a `'use client'` component.

**Why it's wrong:** The full translation JSON gets bundled into client-side JavaScript. For 40+ tools with verbose descriptions in two languages, this adds unnecessary KB to every page's JS bundle.

**Do this instead:** Load translations in the Server Component via `getDictionary(locale)` (marked `server-only`), then pass only the strings needed by that page as props to the Client Component.

### Anti-Pattern 4: Using next-intl `useTranslations` in Server Components Without setRequestLocale

**What people do:** Call `useTranslations()` in a Server Component inside a dynamic route without calling `setRequestLocale(locale)` first.

**Why it's wrong:** Without `setRequestLocale`, next-intl falls back to dynamic rendering via request headers — the page is no longer statically generated even with `generateStaticParams`.

**Do this instead:** Call `setRequestLocale(locale)` as the very first line in every Server Component layout and page that participates in static generation.

### Anti-Pattern 5: Static Export Incompatibility (if using `output: 'export'`)

**What people do:** Enable `output: 'export'` in `next.config.ts` and then use features incompatible with full static export (Server Actions, Rewrites, Redirects from next.config, Proxy/middleware, Cookies).

**Why it's wrong:** With `output: 'export'`, the `proxy.ts` (middleware) file is non-functional — locale detection and redirection breaks entirely.

**Do this instead:** For Vercel deployment (the stated target), do NOT use `output: 'export'`. Vercel natively supports App Router SSG without it, and the proxy runs at the Edge. Reserve `output: 'export'` only for non-Vercel static hosts.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel | Deploy via GitHub, automatic preview + prod builds | Proxy/edge functions run natively; no static export needed |
| AdSense | Static placeholder `<div>` with `data-ad-slot` + HTML comments | Wired up post-v1; div structure must be in DOM from day one |
| next-sitemap | Post-build script generates `sitemap.xml` from built pages | Needs `siteUrl` config; supports `alternateRefs` for hreflang in sitemap |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Server Component → Client Component | Serializable props only (strings, numbers, plain objects) | Transform fn cannot cross; pass slug instead |
| `tool-registry.ts` → page route | Direct import | Registry is the single source of truth for `generateStaticParams` |
| `getDictionary` → Server Component | `await getDictionary(locale)` | Marked `server-only`; build error if imported client-side |
| `i18n/navigation.ts` → Client Components | `useRouter`, `usePathname` from this module (not next/navigation) | Required for locale-aware navigation links |
| next-intl `proxy.ts` → App Router | `createMiddleware(routing)` | Must be in project root, not inside `src/app/` |

---

## Build Order Implications

The following dependencies constrain what must be built before what:

1. **`tool-registry.ts` must exist before any page code** — `generateStaticParams`, `getToolBySlug`, and the Client Component's runtime lookup all depend on it.

2. **`i18n/routing.ts` must exist before `proxy.ts` and `i18n/request.ts`** — both import from it.

3. **Translation JSON files (`en.json`, `vi.json`) must be structurally complete before adding new tools** — missing i18n keys cause runtime errors at build time when `getDictionary` is called.

4. **Shared `ToolPage` Client Component must be built before any tool page** — all 40+ routes render it.

5. **AdSense slot divs must be in the layout from phase 1** — they cannot be added later without changing static HTML structure, which would require a full rebuild and may affect existing AdSense approval.

Recommended implementation sequence:
- i18n routing config + proxy.ts
- tool-registry.ts (even with just 5 tools)
- getDictionary + translation JSON (EN + VI)
- Shared ToolPage component
- Homepage (multi-mode case converter)
- First batch of tool pages (driven by generateStaticParams from registry)
- SEO layer (generateMetadata, JSON-LD, sitemap)
- Expand registry to remaining 30+ tools

---

## Sources

- Next.js 16.2.0 bundled documentation: `/node_modules/next/dist/docs/01-app/02-guides/internationalization.md`
- Next.js 16.2.0 bundled documentation: `/node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
- Next.js 16.2.0 bundled documentation: `/node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`
- Next.js 16.2.0 bundled documentation: `/node_modules/next/dist/docs/01-app/02-guides/json-ld.md`
- Next.js 16.2.0 bundled documentation: `/node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- Next.js 16.2.0 bundled documentation: `/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
- next-intl official docs: [App Router setup with i18n routing](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) — HIGH confidence
- next-intl official docs: [Routing configuration](https://next-intl.dev/docs/routing/configuration) — HIGH confidence (localePrefix: 'as-needed' confirmed)

---

*Architecture research for: Next.js 16 App Router multilingual text utility webapp (EN/VI)*
*Researched: 2026-03-19*
