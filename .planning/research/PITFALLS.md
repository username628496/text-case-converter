# Pitfalls Research

**Domain:** Multilingual SEO text utility webapp (Next.js + next-intl + SSG)
**Researched:** 2026-03-19
**Confidence:** HIGH — majority of findings verified against the installed Next.js 16.2.0 docs at `node_modules/next/dist/docs/`

---

## Critical Pitfalls

### Pitfall 1: Assuming This Is Next.js 14 — It Is Not

**What goes wrong:**
The project's `.planning/PROJECT.md` references "Next.js 14 App Router" but the installed version is **Next.js 16.2.0** with React 19.2.4. Tutorials, blog posts, and the next-intl docs you find via search are almost all written for Next.js 14 or 15. Following them verbatim will produce build failures, runtime errors, or broken SEO.

**Why it happens:**
Create Next App scaffolds to the latest version. The planning doc was written before the scaffold was generated. Version drift between planning assumptions and reality.

**How to avoid:**
Before writing any feature code, run `npx next --version` and cross-reference against the changelog. For every third-party tutorial, verify it matches the installed version. When in doubt, consult `node_modules/next/dist/docs/` — this is the ground truth for the installed version.

**Warning signs:**
- Tutorial says `import { middleware } from 'next/server'` — that API is gone in v16
- Tutorial references `experimental.ppr` — removed in v16, use `cacheComponents`
- Tutorial shows synchronous `params` access — broken in v16
- Tutorial shows `serverRuntimeConfig` / `publicRuntimeConfig` — removed in v16

**Phase to address:**
Phase 1 (project setup). Establish version awareness before any code is written.

---

### Pitfall 2: `middleware.ts` No Longer Exists in Next.js 16

**What goes wrong:**
In Next.js 16.0, `middleware.ts` was deprecated and renamed to `proxy.ts`. The exported function must also be renamed from `middleware` to `proxy`. Configuration flags like `skipMiddlewareUrlNormalize` are renamed to `skipProxyUrlNormalize`. Every next-intl tutorial and setup guide (including next-intl's own "getting started" docs that were written before v16) instructs you to create `middleware.ts` — this file is silently ignored by Next.js 16.

**Why it happens:**
next-intl's locale routing relies on intercepting requests to detect locale from the URL and rewrite paths. This intercept layer must live in `proxy.ts` in Next.js 16. A `middleware.ts` file in the project root is not an error — it just does nothing. Locale detection silently fails, all pages render with the default locale, and `useLocale()` returns the wrong value with no visible error during `next dev`.

**How to avoid:**
Use `proxy.ts` (not `middleware.ts`) from day one. Export a function named `proxy` (not `middleware`). If using next-intl's routing integration, confirm the next-intl version has been updated to support the `proxy.ts` convention. Apply the Next.js v16 codemod to migrate if starting from a Next.js 15 example: `npx @next/codemod@canary middleware-to-proxy .`

**Warning signs:**
- Language switcher appears to work in UI but URL locale prefix is not being set
- All pages render English content regardless of `/vi/` prefix in URL
- `console.log` in `middleware.ts` never fires during `next dev`
- next-intl error: "Unable to find `next-intl` locale, have you configured the middleware?"

**Phase to address:**
Phase 1 (i18n routing setup). The proxy file is infrastructure — must be correct before any locale-dependent feature is built.

---

### Pitfall 3: Static Export (`output: 'export'`) Is Incompatible with Proxy/Middleware

**What goes wrong:**
The project targets SSG via `output: 'export'` in `next.config.ts`. The official Next.js docs confirm: **Proxy is not supported in static exports** (Platform support table in `proxy.md` explicitly lists "Static export: No"). This means the standard next-intl setup that uses proxy/middleware for locale detection and URL rewriting cannot be used with `output: 'export'`.

**Why it happens:**
Static exports produce HTML/CSS/JS files with no running server. There is no runtime to intercept requests. Proxy runs at request time — it has nowhere to execute in a static file host context.

**How to avoid:**
Use next-intl's "without i18n routing" or "prefix-based routing via `generateStaticParams`" approach:

1. Structure routes as `app/[locale]/page.tsx` with no proxy file
2. Use `generateStaticParams` in `app/[locale]/layout.tsx` to enumerate locales: `return [{locale: 'en'}, {locale: 'vi'}]`
3. EN pages live at `/[tool-slug]/` — this requires the default locale to NOT have a prefix, which means the file structure is `app/page.tsx` (EN) and `app/vi/[tool-slug]/page.tsx` (VI), OR use a catch-all `app/[locale]/[tool-slug]/page.tsx` where EN uses the `en` prefix too (`/en/reverse-text/`)
4. Accept the trade-off: locale cannot be detected from browser `Accept-Language` header at request time. Use a cookie or hardcode locale from URL segment only.

The cleanest approach for this project: use `app/[locale]/[tool-slug]/page.tsx` with `locale: 'en' | 'vi'` as the dynamic segment, no default locale redirect. Both `/en/reverse-text/` and `/vi/reverse-text/` are statically generated. No proxy needed.

**Warning signs:**
- `next build` succeeds but locale redirects don't work on deployed static site
- Vercel deployment shows proxy errors when `output: 'export'` is set
- `next dev` locale detection works locally (because it uses a Node server) but fails in production (static files)

**Phase to address:**
Phase 1 (i18n routing setup). The URL structure and `output` mode decision must be made before page routes are created — it changes the entire `app/` directory structure.

---

### Pitfall 4: Async `params` — Synchronous Access Breaks the Build in Next.js 16

**What goes wrong:**
Next.js 15 introduced async Request APIs as a temporary breaking change with a synchronous compatibility shim. **Next.js 16 removes the synchronous compatibility shim entirely.** `params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` must all be awaited. Code that accesses `params.locale` or `params.slug` directly (without `await`) will throw at runtime or build time.

**Why it happens:**
Tutorial code predating Next.js 16 (and most AI-generated code trained before the cutoff) uses synchronous param access: `const { locale } = params`. This is now a runtime error in Next.js 16. The error message is not always obvious — it may surface as a React Server Component rendering failure rather than a clear "params is not awaitable" message.

**How to avoid:**
Always `await params` in page and layout components:

```typescript
// WRONG (Next.js 14/15 pattern)
export default function Page({ params }: { params: { locale: string } }) {
  const { locale } = params
}

// CORRECT (Next.js 16)
export default async function Page(props: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await props.params
}
```

Run `npx next typegen` after scaffolding to generate globally available `PageProps` and `LayoutProps` helpers with correct async types.

**Warning signs:**
- "Cannot read properties of a Promise" errors in console
- Params that are always `undefined` in production build
- `generateMetadata` receiving wrong locale values

**Phase to address:**
Phase 1 (project scaffold). Establish the async params pattern in the first page template so it propagates to all subsequent pages.

---

### Pitfall 5: hreflang Without Matching Canonical Creates Duplicate Content Signals

**What goes wrong:**
Adding hreflang `<link rel="alternate" hreflang="vi" href="https://site.com/vi/reverse-text/" />` on the EN page while simultaneously setting the canonical to the EN URL for all pages (a common "be safe" pattern) directly contradicts the hreflang signal. Google interprets canonical as "this page is a duplicate of the canonical" and may ignore the hreflang entirely, collapsing both language versions to one.

**Why it happens:**
Developers add `canonical` to "prevent duplicate content" without realizing that for i18n, each language page should canonicalize to **itself**. The SEO principle "point all canonicals to the authoritative version" is misapplied across languages — it applies within a language (e.g., paginated variants), not across languages.

**How to avoid:**
In `generateMetadata`, set each page's canonical to its own URL. In Next.js 16 App Router, use the `alternates` object:

```typescript
return {
  alternates: {
    canonical: `https://site.com/${locale === 'en' ? '' : locale + '/'}${slug}/`,
    languages: {
      'en': `https://site.com/${slug}/`,
      'vi': `https://site.com/vi/${slug}/`,
    },
  },
}
```

Both pages must include both language alternates (bidirectional — "return tags"). The EN page lists EN + VI. The VI page also lists EN + VI.

**Warning signs:**
- Google Search Console shows "Alternate page with proper canonical tag" for VI pages
- Only EN pages appear indexed despite VI pages being in sitemap
- Hreflang validator (e.g., ahrefs hreflang checker) reports missing return links

**Phase to address:**
Phase 1 or 2 (metadata infrastructure). Set the canonical + hreflang pattern in the base layout/page template before any individual tool page is built.

---

### Pitfall 6: Sitemap Missing hreflang `alternates` — next-sitemap May Not Handle This Correctly

**What goes wrong:**
`next-sitemap` is a common choice (it's in the project plan) but it was built primarily for Next.js Pages Router and has limited support for App Router hreflang alternates. When used with a custom i18n URL structure, it often generates a sitemap with only one locale's URLs, missing the `<xhtml:link rel="alternate">` entries that signal to Google which pages are locale alternates of each other.

**Why it happens:**
`next-sitemap` reads the filesystem output from `next build`. In a static export with `app/[locale]/[slug]/page.tsx`, it may enumerate all routes correctly but fail to add the correct `alternates.languages` section to each URL entry — this requires custom configuration that is underdocumented for App Router.

**How to avoid:**
Use Next.js's built-in `app/sitemap.ts` file convention instead of `next-sitemap`. The native API directly supports `alternates.languages` in the returned sitemap entries:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { tools } from '@/data/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  return tools.flatMap(tool => ([
    {
      url: `https://site.com/${tool.slug}/`,
      alternates: {
        languages: {
          en: `https://site.com/${tool.slug}/`,
          vi: `https://site.com/vi/${tool.slug}/`,
        },
      },
    },
  ]))
}
```

If `next-sitemap` is kept, verify its output XML includes `<xhtml:link>` tags before deploying. The sitemap is what Google uses for initial crawl discovery — errors here delay indexing of VI pages by weeks.

**Warning signs:**
- `sitemap.xml` contains only EN URLs with no `xhtml:link` alternate entries
- Google Search Console > International Targeting shows "no hreflang" for VI pages
- VI pages are not indexed after 4+ weeks despite being accessible

**Phase to address:**
Phase 2 (SEO infrastructure). Build and validate the sitemap before submitting to Search Console.

---

### Pitfall 7: AdSense Placeholder Divs Cause CLS if Unsized

**What goes wrong:**
The project requires AdSense placeholder divs in the DOM from day one (even without live ads). When AdSense eventually activates, ad units expand to their served dimensions after page load. If no space is reserved, the content below the ad slot shifts down — causing a high Cumulative Layout Shift (CLS) score. CLS above 0.1 is a "poor" Core Web Vitals score and directly impacts ranking.

**Why it happens:**
Developers add `<div id="adsense-header"><!-- AdSense placeholder --></div>` with zero height. When AdSense renders a 728×90 banner, the page layout shifts. This happens even with placeholder divs — the div must have a minimum reserved height.

**How to avoid:**
Reserve space for every ad slot with CSS `min-height` matching the largest ad unit expected for that slot. For a leaderboard slot (728×90 on desktop), set `min-height: 90px`. For a responsive slot, use the responsive breakpoints from AdSense's recommendations. Use `aspect-ratio` or fixed `min-height` on the wrapper div, not the inner ad tag.

```css
/* Reserve ad space to prevent layout shift */
.ad-slot-header    { min-height: 90px; }
.ad-slot-sidebar   { min-height: 250px; }
.ad-slot-below-tool { min-height: 90px; }
```

Also: ensure `next/font` is used for fonts (self-hosted, no external request) to prevent font-swap CLS. Use `next/image` with explicit `width` and `height` for any images.

**Warning signs:**
- Chrome DevTools Performance panel shows layout shifts after page load
- Lighthouse CLS score above 0.1 with "Layout shift" attributed to ad slot elements
- `console.warn` from AdSense about unsized containers

**Phase to address:**
Phase 1 (initial layout). Reserve ad slot dimensions in the initial layout component before any tool page is built. Retrofitting 35+ pages later is expensive.

---

### Pitfall 8: JSON-LD Script Tag XSS Vector (Using `next/script` Instead of `<script>`)

**What goes wrong:**
Two related mistakes:
1. Using `<Script>` from `next/script` instead of a native `<script>` tag for JSON-LD
2. Passing untranslated user-controlled strings into JSON-LD without escaping the `<` character

The official Next.js docs explicitly state: "The `next/script` component is optimized for loading and executing JavaScript. Since JSON-LD is structured data, not executable code, a native `<script>` tag is the right choice here." Using `next/script` with `dangerouslySetInnerHTML` for JSON-LD can produce hydration errors or deferred execution, causing Google to miss the structured data.

**Why it happens:**
Developers see `<Script>` used throughout the Next.js ecosystem and assume it is the correct tag for all script injection. For JSON-LD in tool description or how-to content, tool names from translation files may contain `<` characters that break the JSON when not escaped.

**How to avoid:**
Always use native `<script type="application/ld+json">` for structured data. Always escape `<` characters in the JSON payload before injection:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  }}
/>
```

Type JSON-LD using `schema-dts` to get TypeScript validation of the schema structure.

**Warning signs:**
- Google's Rich Results Test shows no structured data detected
- JSON-LD validator shows broken JSON when tool names contain `<` or `>`
- Hydration warnings in dev console related to `<Script>` and `dangerouslySetInnerHTML`

**Phase to address:**
Phase 2 (tool page template). Build a reusable `ToolJsonLd` component once and use it for all tool pages.

---

### Pitfall 9: next-intl v4 Requires Explicit `locale` Return and `NextIntlClientProvider` Wrapper

**What goes wrong:**
If the project uses next-intl v4 (the current release), two changes from v3 are required:

1. `getRequestConfig` must explicitly return `locale`. In v3 this was optional — omitting it silently fell back to the default. In v4 omitting it causes "Unable to find next-intl locale" at runtime.
2. All Client Components that call `useTranslations()`, `useLocale()`, etc. must be wrapped in `<NextIntlClientProvider>`. In v4 the provider no longer inherits from a global context automatically for edge cases.

**Why it happens:**
Next.js 14/15 tutorials and blog posts almost universally show the v3 setup. Copying them into a v4 environment silently breaks locale resolution.

**How to avoid:**
In `i18n/request.ts`:

```typescript
import {getRequestConfig} from 'next-intl/server'
import {routing} from './routing'

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale
  // Must explicitly return locale
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
```

Wrap the root layout in `<NextIntlClientProvider>`:

```typescript
// app/[locale]/layout.tsx
import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'

export default async function LocaleLayout({children, params}) {
  const {locale} = await params
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Warning signs:**
- "Unable to find next-intl locale" error in server logs
- Client Components render with `useTranslations` returning undefined or throwing
- Language appears correct in Server Components but wrong in Client Components

**Phase to address:**
Phase 1 (i18n setup). The provider and request config are foundational — establish them before any translated component is built.

---

### Pitfall 10: `generateSitemaps` — `id` Is Now a Promise in Next.js 16

**What goes wrong:**
In Next.js 16, the `id` parameter passed to the `sitemap` generating function is now `Promise<string>`, not a direct value. Code that treats it as a synchronous value (e.g., `const start = id * 50000`) produces `NaN` without a clear error message in development, and generates an empty or malformed sitemap in production.

**Why it happens:**
This is a breaking change introduced in Next.js 16 to align with the broader Async Request APIs change. It only affects projects that use `generateSitemaps` for paginated sitemaps (not standard single `sitemap.ts`). If the project grows beyond 50,000 URLs across all locale/tool combinations this becomes relevant.

**How to avoid:**
Always await `id` when using `generateSitemaps`:

```typescript
export default async function sitemap(props: { id: Promise<string> }) {
  const id = await props.id
  const start = Number(id) * 50000
  // ...
}
```

For this project's scale (35+ tools × 2 locales = ~70 URLs), a single `sitemap.ts` file is sufficient and `generateSitemaps` is not needed.

**Warning signs:**
- Sitemap contains zero URLs despite tools existing
- `sitemap/0.xml` returns an empty `<urlset>`
- TypeScript type error on `id` if types are correctly configured

**Phase to address:**
Phase 2 (SEO infrastructure). Only relevant if paginated sitemaps are used.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode locale in page instead of reading from `params` | Faster to write | All pages show wrong locale for VI routes | Never |
| Single shared `metadata` export instead of `generateMetadata` | Less boilerplate | Same title/description on all tool pages — severe SEO penalty | Never for this project |
| Use `next-sitemap` without verifying hreflang output | Familiar package | VI pages never indexed by Google | Only if custom transform verified post-build |
| Skip `min-height` on ad slot divs | Slightly cleaner markup | CLS failures on AdSense activation | Never — add from day one |
| Copy next-intl v3 setup from tutorials without version-checking | Faster onboarding | Silent locale failures in prod | Never |
| Put JSON-LD in root layout instead of per-page | Less code | All pages share one schema — wrong type/content for most pages | Never for tool utility pages |
| Use `<Script>` from next/script for JSON-LD | Feels consistent | Google may not parse it; hydration warnings | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| next-intl + static export | Use proxy/middleware for locale detection | Use `[locale]` dynamic segment + `generateStaticParams` only |
| next-intl v4 + Next.js 16 | Copy `middleware.ts` setup from tutorials | Create `proxy.ts` with exported `proxy` function |
| Native sitemap.ts + hreflang | Omit `alternates.languages` from sitemap entries | Include both EN and VI URLs in each entry's `alternates.languages` |
| `generateMetadata` + locale | Access `params.locale` synchronously | `const { locale } = await params` in every generateMetadata |
| JSON-LD + Vietnamese text | Pass translated strings directly to JSON.stringify | Escape `<` with `.replace(/</g, '\\u003c')` |
| `next/image` + static export | Use default image loader | Must configure custom loader (e.g., `loader: 'custom'`) or use unoptimized images |
| AdSense + Core Web Vitals | Insert ad div with no dimensions | Add CSS `min-height` matching largest expected ad unit |
| next-sitemap + App Router | Rely on automatic route discovery | Verify XML output contains `xhtml:link` alternate entries; prefer native `sitemap.ts` |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Ad slot without reserved height | CLS > 0.1 on Lighthouse | Set CSS `min-height` on every ad div | First AdSense activation |
| Translation files loaded in Client Component bundle | Large JS bundle, slow INP | Use Server Components for translated content; pass strings as props to client | When translation files exceed ~50KB |
| `generateStaticParams` missing for a locale | 404 on `/vi/[slug]/` at build time | Include all locales in `generateStaticParams` return value | First `next build` with `output: 'export'` |
| Font loaded from Google Fonts CDN | External request delay, CLS from font swap | Use `next/font/google` which self-hosts font files | On slow connections, CLS audit |
| No `loading="lazy"` strategy for below-fold content | Poor LCP if initial HTML is large | Tool textarea is above fold — keep initial HTML lean | With 35+ tools on a single page |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| JSON-LD without `<` escaping | XSS if any input-derived string reaches JSON-LD | `.replace(/</g, '\\u003c')` on all `JSON.stringify` output |
| `NEXT_PUBLIC_` prefix on secret keys | Key exposed to client bundle | Never use `NEXT_PUBLIC_` for API keys; for this project there are no secrets (client-side only tool) |
| AdSense publisher ID hardcoded without CSP | Allows ad injection from other domains | Add AdSense domains to Content Security Policy when activating |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No locale in URL for VI users | Sharing a link lands EN users on EN, VI users on EN (no locale negotiation in static export) | Keep `/vi/` prefix visible in URL for shareable locale-specific links |
| Text output not copyable with one click | Users manually select-all — high friction for utility tool | Add copy-to-clipboard button on every tool output |
| Tool result disappears on locale switch | User loses their work when switching EN/VI | Store input in `useState` or `sessionStorage`; locale switch should preserve text |
| Mode tabs lose state on navigation | User switches to a sub-tool page, back button resets their input | Use URL params or sessionStorage for textarea content |
| Long page load on initial visit | SSG should be instant, but fonts/ads can delay LCP | Self-host fonts via `next/font`, reserve ad space, no render-blocking resources |

---

## "Looks Done But Isn't" Checklist

- [ ] **hreflang implementation:** Check that both EN and VI pages include `alternates.languages` with BOTH EN and VI URLs (bidirectional) — verify with Google's Rich Results Test or ahrefs
- [ ] **Sitemap hreflang:** Open the generated `sitemap.xml` and confirm `<xhtml:link>` entries appear for each URL — it will look complete without them
- [ ] **Locale routing on static host:** Deploy to a static host and confirm `/vi/reverse-text/` loads in Vietnamese — it may work in `next dev` (which has a server) but fail on static
- [ ] **Async params:** Confirm all `generateMetadata`, page, and layout functions `await props.params` — synchronous access passes TypeScript but fails at runtime in Next.js 16
- [ ] **proxy.ts not middleware.ts:** Confirm the file is named `proxy.ts` (if proxy-based routing is used) — a `middleware.ts` file silently does nothing in Next.js 16
- [ ] **JSON-LD present in page source:** `curl https://yoursite.com/reverse-text/ | grep 'application/ld+json'` — client-rendered JSON-LD is invisible to Google
- [ ] **Ad slot dimensions:** Measure CLS with Lighthouse after adding AdSense test code — should be 0 or near-zero
- [ ] **VI translation completeness:** Tool descriptions, HowTo steps, and UI chrome should all be in Vietnamese — partial translation hurts credibility
- [ ] **`generateStaticParams` covers all locales:** Confirm `next build` output shows both `/reverse-text/` and `/vi/reverse-text/` pages generated, not just one

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong Next.js version assumptions | LOW | Audit and fix async params patterns; run codemod |
| `middleware.ts` instead of `proxy.ts` | LOW | Rename file, rename exported function, update config flags |
| Static export + proxy incompatibility | HIGH | Restructure `app/` directory from `[locale]/` segment, remove proxy file, add `generateStaticParams` to layout |
| hreflang missing return tags | MEDIUM | Update `generateMetadata` template and rebuild all pages |
| Sitemap without hreflang alternates | MEDIUM | Switch from next-sitemap to native `sitemap.ts`, redeploy and resubmit to Search Console |
| AdSense CLS | LOW-MEDIUM | Add `min-height` CSS to ad divs, redeploy — no code restructuring needed |
| Wrong next-intl v4 setup | MEDIUM | Rewrite `i18n/request.ts` and root layout, re-test all locale routes |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Wrong Next.js version assumptions | Phase 1 (setup) | Run `next --version`; check `node_modules/next/dist/docs/` |
| `middleware.ts` → `proxy.ts` rename | Phase 1 (i18n routing) | Confirm `proxy.ts` exists; no `middleware.ts` in project root |
| Static export + proxy incompatibility | Phase 1 (routing architecture) | `next build` with `output: 'export'` succeeds; both locale routes appear in `out/` |
| Async `params` in Next.js 16 | Phase 1 (page template) | TypeScript strict mode catches non-awaited params; build passes |
| hreflang without self-canonicals | Phase 2 (metadata) | Validate with Google Search Console or ahrefs hreflang checker |
| Sitemap missing hreflang alternates | Phase 2 (SEO) | Inspect `sitemap.xml` for `xhtml:link` entries |
| AdSense CLS | Phase 1 (layout) | Lighthouse CLS ≤ 0.1 with reserved ad slot dimensions |
| JSON-LD XSS + wrong script tag | Phase 2 (tool template) | Rich Results Test confirms schema is parsed; no hydration warnings |
| next-intl v4 locale + provider | Phase 1 (i18n setup) | Both Server and Client Components return correct locale |
| `generateSitemaps` async `id` | Phase 2 (sitemap) | Sitemap XML is non-empty; TypeScript type check passes |

---

## Sources

- Next.js 16.2.0 local docs: `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` — confirmed breaking changes (HIGH confidence)
- Next.js 16.2.0 local docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — Proxy platform support table, static export: No (HIGH confidence)
- Next.js 16.2.0 local docs: `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` — unsupported features list includes Proxy (HIGH confidence)
- Next.js 16.2.0 local docs: `node_modules/next/dist/docs/01-app/02-guides/json-ld.md` — use native `<script>` not next/script for JSON-LD (HIGH confidence)
- Next.js 16.2.0 local docs: `node_modules/next/dist/docs/01-app/02-guides/internationalization.md` — generateStaticParams for static locale rendering (HIGH confidence)
- Next.js 16.2.0 local docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` — `alternates.languages` in sitemap entries (HIGH confidence)
- [Fix next-intl in Next.js 16: Rename middleware to proxy](https://www.buildwithmatija.com/blog/next-intl-nextjs-16-proxy-fix) — confirms v16 + next-intl interaction (MEDIUM confidence)
- [next-intl 4.0 release notes](https://next-intl.dev/blog/next-intl-4-0) — locale required from getRequestConfig, NextIntlClientProvider changes (MEDIUM confidence)
- [next-intl: App Router setup without i18n routing](https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing) — static export approach (MEDIUM confidence)
- [How to Use Canonical Tags and Hreflang in Next.js 16](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags) — alternates object pattern (MEDIUM confidence)
- [Hreflang Done Right: Avoiding International SEO Chaos](https://insights.ramfaseo.se/hreflang-done-right-avoiding-international-seo-chaos-on-multilingual-sites-without-creating-duplicate-content/) — canonical conflict with hreflang (MEDIUM confidence)
- [Minimize layout shift — Google Publisher Tag](https://developers.google.com/publisher-tag/guides/minimize-layout-shift) — reserved ad slot sizing (MEDIUM confidence)
- [GitHub Discussion: Support for static export (output: export) — next-intl #334](https://github.com/amannn/next-intl/issues/334) — known limitation confirmed (MEDIUM confidence)

---

*Pitfalls research for: multilingual SEO text utility webapp (Next.js 16.2.0 + next-intl + SSG)*
*Researched: 2026-03-19*
