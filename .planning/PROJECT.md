# Text Case Converter

## What This Is

A multilingual (English + Vietnamese) text utility webapp targeting SEO for both audiences. Users paste text and instantly convert it across case styles and text transformations — each tool lives on its own URL for maximum search visibility. The primary revenue model is AdSense (placeholders in v1, activated later).

## Core Value

Fast, accurate text tools on SEO-optimized pages that rank for both English and Vietnamese search queries — neither the tool quality nor the discoverability can be sacrificed.

## Requirements

### Validated

- [x] Homepage with 7-mode case converter (Sentence, lower, UPPER, Capitalized, Alternating, Title, Inverse) in a single textarea with tab switching — Validated in Phase 02: core-case-converter
- [x] Full EN/VI localization via next-intl: tool names, descriptions, placeholder text, how-to copy, UI chrome (homepage) — Validated in Phase 02: core-case-converter
- [x] Dynamic generateMetadata() per page: title, description, canonical, og:image (homepage) — Validated in Phase 02: core-case-converter
- [x] JSON-LD Schema (SoftwareApplication + HowTo) on homepage — Validated in Phase 02: core-case-converter
- [x] hreflang EN ↔ VI on homepage — Validated in Phase 02: core-case-converter
- [x] SSG (static generation) for homepage — Validated in Phase 02: core-case-converter
- [x] Clean minimal UI, dark mode support, mobile responsive (homepage) — Validated in Phase 02: core-case-converter

### Validated

- [x] Sub-tool pages for v1 priority tools: Reverse Text, Base64 Encode/Decode, Slug Generator, Password Generator — Validated in Phase 03: sub-tools-seo-infrastructure
- [x] Full EN/VI localization via next-intl for all 4 sub-tools — Validated in Phase 03: sub-tools-seo-infrastructure
- [x] Each tool has its own route: /[tool-slug]/ (EN) and /vi/[tool-slug]/ (VI) — Validated in Phase 03: sub-tools-seo-infrastructure
- [x] Dynamic generateMetadata() per page: title, description, canonical, og:image (all tools) — Validated in Phase 03: sub-tools-seo-infrastructure
- [x] JSON-LD Schema (SoftwareApplication + HowTo) on every tool page — Validated in Phase 03: sub-tools-seo-infrastructure
- [x] hreflang EN ↔ VI on all pages — Validated in Phase 03: sub-tools-seo-infrastructure
- [x] Sitemap (native Next.js 16 API) covering all tool URLs — Validated in Phase 03: sub-tools-seo-infrastructure
- [x] SSG (static generation) for all tool pages — Validated in Phase 03: sub-tools-seo-infrastructure

### Validated (Phase 04: launch-readiness)

- [x] Core Web Vitals: LCP < 2.5s (homepage 2133ms, password-generator 2056ms), CLS = 0.00 on both — Validated in Phase 04: launch-readiness
- [x] Google Rich Results Test passes for SoftwareApplication + HowTo schema on homepage and sub-tool pages — Validated in Phase 04: launch-readiness
- [x] Bidirectional hreflang EN ↔ VI confirmed on all pages via production view-source — Validated in Phase 04: launch-readiness
- [x] Sitemap.xml and robots.txt accessible on production — Validated in Phase 04: launch-readiness
- [x] Production deployment live at https://convertcase.uk (deployed via Vercel) — Validated in Phase 04: launch-readiness

### Active

- [ ] Remaining 30+ sub-tool pages (Text Tools, Code & Data, Font Styles, Random) — real implementations, shipped after core
- [ ] AdSense placeholder divs (header, sidebar, below tool) with comments — not wired up

### Out of Scope

- AdSense implementation — placeholders only in v1, activation is a future milestone
- User accounts / saved history — stateless tools only
- Real-time collaboration — single-user, client-side only
- Native mobile app — web-first, PWA deferred
- Tool APIs / programmatic access — UI only for v1

## Context

- Stack: Next.js 16.2.0 App Router, TypeScript, Tailwind CSS v4, next-intl v4.8.3 (EN/VI i18n), Vitest v4
- Shipped v1.0 with ~3,127 LOC TypeScript/TSX across 110 modified files
- Production: https://convertcase.uk (Vercel, SSG, 10 URLs across 5 tools × 2 locales)
- Competitor reference: convertcase.net (aim to surpass on SEO + UX)
- Vietnamese market is an explicit target — full translation required, not just metadata

## Constraints

- **Tech Stack**: Next.js 16 App Router + TypeScript + Tailwind v4 — locked
- **i18n**: next-intl v4 for EN/VI — locked; proxy.ts (not middleware.ts) required for locale routing
- **SEO**: SSG required for all pages — no SSR or client-only rendering for tool pages
- **Monetization**: AdSense slot structure must be in DOM from day one (divs + comments) even if empty
- **React Compiler**: Enabled — do not add manual useMemo/useCallback in Client Components

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Core tools first, expand iteratively | Ship fast with highest-value pages, add remaining 30+ tools in subsequent phases | ✓ v1.0 shipped 5 tools in 1 day |
| Full VI translation (not just metadata) | Vietnamese is a primary audience, not an afterthought — partial translation hurts credibility | ✓ Full EN/VI with proper diacritics |
| Each tool = its own URL | SEO-critical: individual pages rank for specific tool queries | ✓ 10 URLs, all SSG |
| SSG for all pages | Core Web Vitals + SEO — no runtime server needed | ✓ CWV Good range on production |
| proxy.ts over middleware.ts | Next.js 16 changed convention — middleware.ts silently ignored for locale routing | ✓ Locale routing works on Vercel |
| Native sitemap.ts over next-sitemap | Built-in hreflang alternates.languages support; external package creates competing sitemaps | ✓ Single clean sitemap with xhtml:link |
| localeDetection: false | as-needed prefix conflicts with Accept-Language auto-redirect on real browsers | ✓ No redirect loops |
| t.raw('items') for i18n arrays | next-intl v4 throws MISSING_MESSAGE during SSG inside try/catch; raw() avoids the throw | ✓ All FAQ content renders correctly |
| Domain: convertcase.uk | Shorter, cleaner domain than textcaseconverter.com | ✓ Production at convertcase.uk |

## Current State

v1.0 milestone complete — all 4 phases shipped. Production live at https://convertcase.uk with 5 tools (case converter + 4 sub-tools), bilingual EN/VI, full SEO (JSON-LD, hreflang, sitemap, robots.txt), Core Web Vitals in Good range. All 9 launch quality gates passed. 59 tests passing. Domain updated from textcaseconverter.com to convertcase.uk.

---
*Last updated: 2026-03-20 after v1.0 milestone*
