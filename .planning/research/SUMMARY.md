# Project Research Summary

**Project:** Text Case Converter
**Domain:** Multilingual text utility webapp (EN/VI), SEO-optimized, AdSense-ready
**Researched:** 2026-03-19
**Confidence:** HIGH

## Executive Summary

This is a multilingual text utility webapp targeting EN and Vietnamese audiences simultaneously — a differentiator no competitor currently exploits. The product is a pure client-side tool where all text transformations run in-browser (no backend required), served as statically-generated HTML files via Vercel's CDN. The competitive gap is clear: convertcase.net and freeonlinecaseconverter.com both serve English-only audiences, leaving 100M+ Vietnamese speakers underserved. The recommended approach is a Next.js 16 App Router SSG site with next-intl v4 for routing/translation, a central tool registry driving all 40+ tool pages from a single dynamic route, and per-page SEO infrastructure (generateMetadata, JSON-LD, hreflang, sitemap) established as foundational scaffolding before any tool page is written.

The critical risk is version mismatch. The installed stack is Next.js 16.2.0 — not Next.js 14 as referenced in planning documents, and not Next.js 15 which most tutorials describe. Roughly half of all common tutorials will produce broken builds or silent failures if followed without adaptation. Key breaking changes include: `middleware.ts` renamed to `proxy.ts`, `params` is now a Promise (must be awaited), and the i18n config key in `next.config.ts` is unsupported. These are not subtle gotchas — they silently break locale routing and SEO metadata in production while appearing to work in development.

A secondary risk is the i18n-first dependency chain. The route structure (`app/[locale]/[tool]/page.tsx`), the proxy setup, the translation JSON structure, and the AdSense slot placement in the root layout all must be established in Phase 1 before any content is written. Retrofitting i18n onto an existing page structure, adding AdSense slots after layout is finalized, or adding hreflang after tool pages are published each carries a rebuild cost of 35-80 files. Front-load infrastructure, defer content scale.

## Key Findings

### Recommended Stack

The core stack is entirely pre-installed and zero additional configuration is required for the framework itself. Next.js 16.2.0 with React 19.2.4 and Tailwind CSS v4 are already scaffolded. The React Compiler is already enabled (`reactCompiler: true` in next.config.ts) — this means manual `useMemo`/`useCallback` in Client Components is actively harmful. The only new dependencies needed are next-intl (i18n), schema-dts (JSON-LD type safety), clsx (conditional classNames), and server-only (build-time guard against server modules leaking to client).

One sharp edge: Tailwind CSS v4 is CSS-first with no `tailwind.config.js`. All dark mode variants must be configured in `globals.css` via `@custom-variant`, not in a JavaScript config file. Every Tailwind v3 tutorial is incorrect for this setup.

**Core technologies:**
- Next.js 16.2.0: App framework, SSG, routing — already installed; `generateStaticParams` + Server Components deliver zero-runtime-cost static pages
- next-intl ^4.8.3: EN/VI routing and translation — only i18n library with full App Router + SSG support; version 4.x required (v3 API is incompatible)
- Tailwind CSS v4: Styling, dark mode — already installed; CSS-first, no JS config
- schema-dts ^1.1.5: TypeScript types for JSON-LD — catches malformed structured data at compile time
- React 19.2.4 + React Compiler: UI rendering with automatic memoization — do not add manual memo
- Built-in `app/sitemap.ts`: Sitemap generation — supersedes next-sitemap for this project; native hreflang `alternates.languages` support

### Expected Features

The market standard for this product category is well-defined. All top competitors (convertcase.net, freeonlinecaseconverter.com, textconverter.app) converge on the same core interaction: instant conversion on mode-select (no submit button), one-click copy with visual confirmation, and live character/word counts. Missing any of these means the product feels broken to users. Each tool must have its own URL for per-keyword SEO ranking — this is architecturally foundational, not a feature that can be added later.

The EN/VI bilingual UI is the primary competitive differentiator. It must be built-in from day one because the route structure shapes everything else. All other "differentiators" (dark mode, download as .txt, undo) are low-cost and easily added post-launch. AdSense placeholder divs must be in the DOM structure from Phase 1 per project constraint and to avoid CLS issues when ads eventually activate.

**Must have (table stakes):**
- 7-mode case converter (sentence, lower, UPPER, Capitalized, Alternating, Title, Inverse) — industry standard, missing any mode feels broken
- Instant conversion on mode-select — every competitor, users abandon tools with submit buttons
- Copy to clipboard with visual confirmation ("Copied!" state) — the core action; friction here = abandonment
- Real-time character + word count — all top competitors show this live
- Clear/reset button — expected for multi-use sessions
- Individual URL per tool — table stakes for SEO; each tool must rank independently
- Mobile-responsive single-column layout — majority of search traffic is mobile
- SSG (all pages pre-rendered) — Core Web Vitals hard requirement for ranking
- FAQ/how-to content below each tool — Google requires this for SoftwareApplication schema validity
- Related tools navigation — reduces bounce, increases pages/session

**Should have (competitive):**
- EN/VI full bilingual UI via next-intl — unique differentiator, no competitor targets Vietnamese market
- JSON-LD (SoftwareApplication + HowTo) on every tool page — structured data eligibility for rich results
- hreflang EN ↔ VI — prevents duplicate content penalty across locale variants
- generateMetadata() per page — per-tool title, description, canonical, og:image
- Dark mode (OS preference minimum) — present in all top competitors; Tailwind makes it near-free
- AdSense placeholder divs (3 placements: header, sidebar, below-tool) — project constraint; must be in DOM from day one
- Auto-generated sitemap with hreflang alternates — accelerates VI page indexing

**Defer (v2+):**
- Download as .txt — validate demand post-launch
- Undo / restore original — quality-of-life, add when user feedback surfaces the need
- Remaining 30+ sub-tool pages — expand catalog iteratively after v1 core tools rank
- PWA manifest — defer until web traffic is established
- AdSense activation — requires traffic threshold; out of v1 scope

### Architecture Approach

The architecture is a three-layer system: build-time SSG generates 80+ static HTML files (40 tools × 2 locales) using `generateStaticParams` driven by a central tool registry; a proxy layer (`proxy.ts` with next-intl's `createMiddleware`) handles locale detection and URL rewriting at edge with no server runtime; and the browser hydrates static HTML with Client Components that run text transforms as pure synchronous functions with zero network round-trips. The defining pattern is a single dynamic route (`app/[locale]/[tool]/page.tsx`) serving all tools via the tool registry, paired with Server Component shells handling all SEO concerns (metadata, JSON-LD, dictionary loading) and a shared `ToolPage` Client Component handling the interactive textarea.

**Major components:**
1. `proxy.ts` (project root) — locale detection, URL rewriting (EN no prefix, VI with `/vi/`); must be at project root not inside `src/`
2. `src/lib/tool-registry.ts` — single source of truth for all tool slugs, transform function references, i18n keys, schema types; drives `generateStaticParams`, sitemap, and page rendering
3. `src/lib/tools/` — pure TypeScript transform functions with no React; imported by the Client Component at runtime by slug lookup, never passed as props across the Server/Client boundary
4. `app/[locale]/[tool]/page.tsx` — single dynamic route file for all 40+ tools; Server Component shell that renders `ToolPage` with serializable config props
5. `src/components/tool/ToolPage.tsx` — shared `'use client'` component; handles textarea state, mode selection, copy, and calls transform functions via slug lookup
6. `src/i18n/` (routing.ts, request.ts, navigation.ts) — next-intl contract; must exist before any locale-dependent code
7. `app/sitemap.ts` — native Next.js 16 sitemap with `alternates.languages` hreflang entries per tool URL

### Critical Pitfalls

1. **Wrong Next.js version assumptions** — The installed version is 16.2.0, not the 14 referenced in planning docs. `middleware.ts` was renamed to `proxy.ts`, `params` must be awaited, `getStaticPaths` is replaced by `generateStaticParams`. Before writing any code, verify patterns against `node_modules/next/dist/docs/` not search results or tutorials.

2. **`middleware.ts` silently does nothing in Next.js 16** — Locale routing fails silently if `proxy.ts` is not used. There is no error; all pages just render the default locale. The file must be `proxy.ts` at project root exporting a function named `proxy`, not `middleware`. Run `npx @next/codemod@canary middleware-to-proxy .` if migrating from an older example.

3. **Static export (`output: 'export'`) is incompatible with proxy-based locale routing** — Vercel natively supports App Router SSG without `output: 'export'`; the proxy runs at Vercel's edge. Do not set `output: 'export'` for Vercel deployment — it removes locale detection entirely. If targeting a static host (not Vercel), use prefix-based routing via `generateStaticParams` only (no proxy file).

4. **Async `params` — synchronous access throws at runtime in Next.js 16** — `const { locale } = params` (without await) is a runtime error. Always: `const { locale } = await props.params`. Use `PageProps<'/[locale]/[tool]'>` TypeScript helper generated by `npx next typegen` to catch this at compile time.

5. **hreflang without self-canonical creates duplicate content signals** — Each language page must canonicalize to itself, not to the EN version. Both EN and VI pages must include bidirectional `alternates.languages` referencing both locales. Omitting the return tag on the VI page means Google ignores hreflang entirely.

6. **AdSense placeholder divs without reserved CSS height cause CLS** — Placeholder divs with no `min-height` produce layout shift when ads activate. Set `min-height: 90px` (header), `min-height: 250px` (sidebar), `min-height: 90px` (below-tool) from Phase 1. Retrofitting 35+ pages later is expensive.

7. **next-intl v4 requires explicit `locale` return and `NextIntlClientProvider` wrapper** — v3 setup copied from tutorials will silently fail locale resolution. `getRequestConfig` must explicitly `return { locale, messages }`. Root layout must wrap children in `<NextIntlClientProvider messages={messages}>`.

## Implications for Roadmap

Based on the dependency chain identified across all research files, the build order is constrained. Infrastructure must precede content. i18n routing must precede any page. The tool registry must precede dynamic routes. SEO infrastructure (metadata, JSON-LD, sitemap) should be established as a template before tool content is scaled out — retrofitting across 80+ pages is the highest-cost mistake pattern identified.

### Phase 1: Foundation Infrastructure

**Rationale:** The route structure, i18n proxy, tool registry, and root layout (with AdSense slots) all have cascading dependencies. Every subsequent phase builds on top of this. Getting these wrong requires restructuring 80+ files. This phase should produce zero visible product but a complete, building scaffold.

**Delivers:** Working Next.js 16 + next-intl v4 locale routing for EN/VI; root layout with AdSense placeholder divs and reserved CSS dimensions; tool registry with 5 initial tool configs; translation JSON structure for EN and VI; `proxy.ts` using correct Next.js 16 convention; async `params` pattern established in all page templates; TypeScript strict mode with `PageProps` helpers via `npx next typegen`.

**Addresses:** All table-stakes infrastructure features (SSG, mobile layout, i18n routing, hreflang structure)

**Avoids:** Pitfall 1 (version assumptions), Pitfall 2 (middleware.ts), Pitfall 3 (static export incompatibility), Pitfall 4 (async params), Pitfall 7 (next-intl v4 setup), AdSense CLS (Pitfall 7 from PITFALLS.md)

### Phase 2: Core Tool — Case Converter

**Rationale:** The homepage 7-mode case converter is the core product and the primary traffic entry point. Build it fully (with SEO layer) before expanding to sub-tools. This phase validates the shared `ToolPage` Client Component pattern and the Server Component shell + JSON-LD + generateMetadata template that will be reused for all 40+ tools.

**Delivers:** Fully functional 7-mode case converter on homepage; instant conversion; copy to clipboard; live word/char count; clear button; dark mode; generateMetadata() with per-locale title/description/canonical/og; JSON-LD (SoftwareApplication + HowTo); hreflang EN ↔ VI; FAQ/how-to content; related tools placeholder navigation.

**Uses:** `ToolPage` Client Component, tool registry pattern, getDictionary, schema-dts for JSON-LD

**Implements:** Server Component shell + Client Component pattern; JSON-LD with XSS-safe `<` escaping; per-page metadata with self-canonical

**Avoids:** Pitfall 5 (hreflang/canonical conflict), Pitfall 8 (JSON-LD script tag XSS)

### Phase 3: SEO Infrastructure + First Sub-Tools

**Rationale:** Before scaling tool count, establish the sitemap, robots.txt, and SEO template as validated infrastructure. Then prove the single dynamic route pattern works for sub-tools by shipping the first 4 (Reverse Text, Base64, Slug Generator, Password Generator). These are functionally simple but validate the entire "tool registry drives everything" architecture end-to-end.

**Delivers:** `app/sitemap.ts` with hreflang `alternates.languages` per tool URL (native Next.js 16 convention); `app/robots.ts`; 4 sub-tool pages with full SEO treatment (EN + VI each); related tools navigation wired up.

**Addresses:** Individual tool URLs (SEO differentiator), related tools links, FAQ/how-to content per tool, auto-generated sitemap

**Avoids:** Pitfall 6 (sitemap missing hreflang alternates), Pitfall 10 (generateSitemaps async id — avoided by using single sitemap.ts)

### Phase 4: Tool Catalog Expansion

**Rationale:** With the architecture validated and SEO infrastructure stable, expanding the tool catalog is a mechanical process: add to tool registry, add translation keys, add transform function. Each addition generates 2 new SSG pages automatically. Aim for 15-20 total tools to cover the main keyword clusters before launch.

**Delivers:** 15-20 total tool pages (EN + VI each); expanded dictionary with all tool strings in both languages; complete related tools navigation grid.

**Addresses:** Must-have individual tool URLs for SEO; remaining P1 features from FEATURES.md

**Avoids:** Anti-pattern of individual page files per tool (use registry); translation file loading in Client Components (use server-only getDictionary)

### Phase 5: Launch Readiness

**Rationale:** Before publishing, validate the full SEO implementation with tooling, audit Core Web Vitals, and ensure the AdSense slot structure passes Google's content policies. This phase is verification, not feature development.

**Delivers:** Lighthouse scores (CWV: LCP, CLS, INP) all in "Good" range; Google Rich Results Test passing for SoftwareApplication + HowTo schema on all tool pages; sitemap.xml validated for hreflang `xhtml:link` entries; "Looks Done But Isn't" checklist from PITFALLS.md fully cleared; deployment to Vercel with correct environment (no `output: 'export'`).

**Addresses:** All items in the PITFALLS.md verification checklist

### Phase Ordering Rationale

- Phase 1 must precede all others because the route structure, i18n setup, and layout are foundational — wrong decisions here require restructuring 80+ files
- Phase 2 precedes sub-tools because the shared `ToolPage` and SEO template must be proven on the homepage before being copied to 40+ tool pages
- Phase 3 establishes the sitemap before Google discovers any pages — submitting an incomplete or hreflang-missing sitemap to Search Console wastes weeks of indexing time
- Phase 4 is deliberately mechanical after Phase 3 validates the pattern — no new architectural decisions
- Phase 5 verification happens before public launch, not after (fixing CLS post-launch requires a rebuild and redeploy across all 80+ pages)

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** next-intl v4 exact `proxy.ts` export signature for Next.js 16 — next-intl docs and Next.js docs both updated recently and may have nuance worth re-verifying against installed `node_modules/next-intl/`
- **Phase 3:** Verify native `app/sitemap.ts` hreflang output format against Google's requirements — confirm the `xhtml:link` entries are correctly formed in the generated XML (test with an actual build)

Phases with standard patterns (skip research-phase):
- **Phase 2:** Core case converter logic is deterministic pure JavaScript with well-documented algorithms — no research needed
- **Phase 4:** Tool expansion is mechanical once registry pattern is proven — no research needed per tool
- **Phase 5:** Lighthouse and Rich Results Test are self-explanatory verification steps

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All findings verified against installed `node_modules/next/dist/docs/` — these are the actual bundled docs for the installed version, not external sources |
| Features | HIGH | Direct observation of 3+ live competitors; feature patterns corroborated across all observed sites; competitor analysis is primary research |
| Architecture | HIGH | Verified against Next.js 16.2.0 bundled docs and next-intl official docs; all code patterns are tested conventions not theoretical |
| Pitfalls | HIGH | Most pitfalls verified against actual installed docs; version-specific breaking changes confirmed in `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` |

**Overall confidence:** HIGH

### Gaps to Address

- **Vercel deployment behavior with next-intl proxy:** Local `next dev` uses a Node server so locale routing works even if `proxy.ts` is misconfigured. The real test is a Vercel Preview deployment. Plan to deploy a preview build at end of Phase 1 to validate locale routing before Phase 2.
- **VI translation quality:** Research focused on structure, not content. The Vietnamese translation strings themselves need a native speaker review before launch — machine-translated UI reduces credibility for the target audience.
- **AdSense approval requirements:** The project plans AdSense activation post-v1. Google's content policy review may require minimum traffic or content thresholds. This is not an architecture risk but is an unknown for the monetization timeline.
- **Image optimization with static SSG:** If `og:image` files are generated per-tool, `next/image` optimization behavior on Vercel vs. with `output: 'export'` differs. Since this project targets Vercel (not static export), standard `next/image` works — but this should be confirmed before generating OG images at scale.

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/` (Next.js 16.2.0 bundled documentation) — all architecture, stack, and pitfall findings
  - `01-app/02-guides/internationalization.md` — i18n patterns, proxy.ts, generateStaticParams for locales
  - `01-app/02-guides/json-ld.md` — JSON-LD native script tag pattern
  - `01-app/02-guides/static-exports.md` — proxy incompatibility with static export
  - `01-app/02-guides/upgrading/version-16.md` — breaking changes: proxy.ts rename, async params
  - `01-app/03-api-reference/03-file-conventions/proxy.md` — proxy platform support table
  - `01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` — built-in sitemap with hreflang
  - `01-app/03-api-reference/04-functions/generate-metadata.md` — alternates.canonical and alternates.languages
  - `01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md` — React Compiler config
- [next-intl official docs](https://next-intl.dev/docs/routing/setup) — v4.x proxy.ts pattern for Next.js 16
- [Tailwind CSS v4 dark mode](https://tailwindcss.com/docs/dark-mode) — CSS-first @custom-variant dark mode

### Secondary (MEDIUM confidence)
- [convertcase.net](https://convertcase.net/) — direct UX observation, feature analysis, tool catalog structure
- [freeonlinecaseconverter.com](https://freeonlinecaseconverter.com/) — UX observation: instant conversion, copy toast, dark mode, undo
- [textconverter.app](https://textconverter.app/) — referenced via search results
- [next-intl 4.0 release notes](https://next-intl.dev/blog/next-intl-4-0) — locale required from getRequestConfig, NextIntlClientProvider changes
- [Fix next-intl in Next.js 16: Rename middleware to proxy](https://www.buildwithmatija.com/blog/next-intl-nextjs-16-proxy-fix) — confirms v16 + next-intl interaction
- [Google AdSense best practices](https://support.google.com/adsense/answer/1282097) — ad placement density guidelines
- [Minimize layout shift — Google Publisher Tag](https://developers.google.com/publisher-tag/guides/minimize-layout-shift) — reserved ad slot sizing
- [How to Use Canonical Tags and Hreflang in Next.js 16](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags) — alternates object pattern
- [GitHub: next-intl static export support #334](https://github.com/amannn/next-intl/issues/334) — known limitation confirmed

---
*Research completed: 2026-03-19*
*Ready for roadmap: yes*
