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

### Active

- [ ] Homepage with 7-mode case converter (Sentence, lower, UPPER, Capitalized, Alternating, Title, Inverse) in a single textarea with tab switching
- [ ] Sub-tool pages for v1 priority tools: Reverse Text, Base64 Encode/Decode, Slug Generator, Password Generator
- [ ] Remaining 30+ sub-tool pages (Text Tools, Code & Data, Font Styles, Random) — real implementations, shipped after core
- [ ] Full EN/VI localization via next-intl: tool names, descriptions, placeholder text, how-to copy, UI chrome
- [ ] Each tool has its own route: /[tool-slug]/ (EN) and /vi/[tool-slug]/ (VI)
- [ ] Dynamic generateMetadata() per page: title, description, canonical, og:image
- [ ] JSON-LD Schema (SoftwareApplication + HowTo) on every tool page
- [ ] hreflang EN ↔ VI on all pages
- [ ] Auto sitemap via next-sitemap
- [ ] SSG (static generation) for all pages
- [ ] AdSense placeholder divs (header, sidebar, below tool) with comments — not wired up
- [ ] Clean minimal UI, dark mode support, mobile responsive, Core Web Vitals optimized
- [ ] Deploy to Vercel via GitHub

### Out of Scope

- AdSense implementation — placeholders only in v1, activation is a future milestone
- User accounts / saved history — stateless tools only
- Real-time collaboration — single-user, client-side only
- Native mobile app — web-first, PWA deferred
- Tool APIs / programmatic access — UI only for v1

## Context

- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, next-intl (EN/VI i18n), next-sitemap
- Repo is a fresh Create Next App scaffold — no custom code yet
- Competitor reference: convertcase.net (aim to surpass on SEO + UX)
- Vietnamese market is an explicit target — full translation required, not just metadata
- Deploy target: Vercel (account + GitHub connected)

## Constraints

- **Tech Stack**: Next.js 14 App Router + TypeScript + Tailwind — locked
- **i18n**: next-intl for EN/VI — locked
- **SEO**: SSG required for all pages — no SSR or client-only rendering for tool pages
- **Monetization**: AdSense slot structure must be in DOM from day one (divs + comments) even if empty

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Core tools first, expand iteratively | Ship fast with highest-value pages, add remaining 30+ tools in subsequent phases | ✓ Phase 02 homepage delivered |
| Full VI translation (not just metadata) | Vietnamese is a primary audience, not an afterthought — partial translation hurts credibility | ✓ Full EN/VI with proper diacritics |
| Each tool = its own URL | SEO-critical: individual pages rank for specific tool queries | ✓ Route structure in place |
| SSG for all pages | Core Web Vitals + SEO — no runtime server needed | ✓ 13 routes statically generated |

## Current State

Phase 02 complete — working case converter homepage live with 7 modes, dark mode, EN/VI i18n, SEO metadata, JSON-LD. Next: sub-tools + SEO infrastructure (Phase 03).

---
*Last updated: 2026-03-20 after Phase 02: core-case-converter*
