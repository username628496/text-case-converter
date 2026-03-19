# Roadmap: Text Case Converter

## Overview

Starting from a fresh Next.js scaffold, this roadmap builds a multilingual (EN/VI) text utility site optimized for SEO and AdSense revenue. Phase 1 establishes the foundational infrastructure that everything else depends on: locale routing, tool registry, and layout with AdSense slot structure. Phase 2 builds the core case converter homepage — the primary traffic entry point — along with the full SEO template (metadata, JSON-LD, hreflang) that all subsequent pages will reuse. Phase 3 completes v1 by shipping the four priority sub-tools and the auto-generated sitemap. Phase 4 verifies the site is launch-ready: Core Web Vitals, Rich Results Test, hreflang validation, and live Vercel deployment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation Infrastructure** - Next.js 16 + next-intl v4 locale routing, tool registry, root layout with AdSense placeholders, Vercel deployment pipeline
- [ ] **Phase 2: Core Case Converter** - Fully functional 7-mode homepage tool with complete SEO treatment (metadata, JSON-LD, hreflang) establishing the template for all tool pages
- [ ] **Phase 3: Sub-Tools + SEO Infrastructure** - Four priority sub-tools (Reverse Text, Base64, Slug Generator, Password Generator) plus sitemap.ts and robots.ts
- [ ] **Phase 4: Launch Readiness** - Core Web Vitals audit, Rich Results Test validation, hreflang verification, live deployment

## Phase Details

### Phase 1: Foundation Infrastructure
**Goal**: A working, building scaffold with correct locale routing, tool registry, and AdSense-ready layout — no visible product yet but the complete foundation for everything built in later phases
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, I18N-01, I18N-02, I18N-03
**Success Criteria** (what must be TRUE):
  1. Navigating to `/` returns English content and navigating to `/vi/` returns Vietnamese content — locale routing works without `output: 'export'`
  2. Navigating to `/vi/anything/` redirects correctly to the Vietnamese locale; navigating to `/anything/` uses the English locale with no prefix
  3. The root layout renders AdSense placeholder divs at all three placements (header, sidebar, below-tool) with correct reserved CSS min-height values (90px / 250px / 90px)
  4. All pages are statically generated — `next build` completes with no server runtime required and no `output: 'export'` flag
  5. Pushing to main on GitHub triggers a successful Vercel deployment and the preview URL resolves correctly
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Install next-intl v4, configure i18n routing + proxy, create translation files, build tool registry
- [ ] 01-02-PLAN.md — Create app directory structure with locale layout, AdSense placeholders, page stubs, build verification, Vercel deploy

### Phase 2: Core Case Converter
**Goal**: Users can use a fully functional 7-mode case converter at the homepage, with complete SEO infrastructure (metadata, JSON-LD, hreflang) that serves as the validated template for all subsequent tool pages
**Depends on**: Phase 1
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07, CORE-08, SEO-01, SEO-02, I18N-04
**Success Criteria** (what must be TRUE):
  1. User can paste text, switch between all 7 case modes (Sentence, lower, UPPER, Capitalized, Alternating, Title, Inverse) via tabs, and see the converted output instantly — no submit button needed
  2. User can click "Copy" and see a "Copied!" confirmation for ~1.5 seconds; character and word counts update live as text is typed; "Clear" empties the textarea in one click
  3. The page renders correctly in dark mode when OS preference is dark (Tailwind `prefers-color-scheme`)
  4. The English homepage (`/`) and Vietnamese homepage (`/vi/`) each have unique `<title>`, `<meta name="description">`, canonical URL, and `og:image` in their respective languages
  5. Both locale pages include valid JSON-LD with SoftwareApplication + HowTo schema and bidirectional hreflang `<link rel="alternate">` tags pointing EN ↔ VI
**Plans**: TBD

Plans:
- [ ] 02-01: TBD

### Phase 3: Sub-Tools + SEO Infrastructure
**Goal**: Four priority sub-tools are live at their own URLs (EN + VI each) with full SEO treatment, the sitemap is auto-generated with hreflang alternates, and related-tools navigation is wired up across all tool pages
**Depends on**: Phase 2
**Requirements**: SEO-03, SEO-04, TOOL-01, TOOL-02, TOOL-03, TOOL-04, TOOL-05
**Success Criteria** (what must be TRUE):
  1. All four sub-tools are accessible at their EN URLs (`/reverse-text/`, `/base64-encode-decode/`, `/slug-generator/`, `/password-generator/`) and their VI equivalents (`/vi/reverse-text/`, etc.), each with the same UX as the core tool (instant conversion, copy, char/word count, clear, FAQ, related tools)
  2. `/sitemap.xml` is accessible and contains entries for all tool pages (EN + VI) with correct `xhtml:link` hreflang alternates referencing both locale variants per URL
  3. `/robots.txt` is accessible with correct crawl directives and sitemap reference
  4. Each tool page displays related tools navigation links that route to other working tool pages — no dead links
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Launch Readiness
**Goal**: The site passes all pre-launch quality gates — Core Web Vitals in "Good" range, structured data valid, hreflang verified, and the production deployment is live and confirmed working
**Depends on**: Phase 3
**Requirements**: (no new feature requirements — verification and deployment phase)
**Success Criteria** (what must be TRUE):
  1. Lighthouse audit on the homepage and at least one sub-tool page shows LCP, CLS, and INP all in the "Good" range (LCP < 2.5s, CLS < 0.1, INP < 200ms)
  2. Google Rich Results Test passes for SoftwareApplication + HowTo schema on the homepage and at least one sub-tool page
  3. Each EN tool page and its VI counterpart both include bidirectional hreflang tags — the EN page references the VI page and vice versa, with no self-referential mismatches
  4. The production Vercel URL serves the correct locale for `/` (English) and `/vi/` (Vietnamese) with correct HTTP status codes — no 404s or redirect loops
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Infrastructure | 1/2 | In Progress|  |
| 2. Core Case Converter | 0/? | Not started | - |
| 3. Sub-Tools + SEO Infrastructure | 0/? | Not started | - |
| 4. Launch Readiness | 0/? | Not started | - |
