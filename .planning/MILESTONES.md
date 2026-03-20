# Milestones

## v1.0 MVP (Shipped: 2026-03-20)

**Phases completed:** 4 phases, 12 plans
**Files modified:** 110 | **LOC:** ~3,127 TS/TSX | **Timeline:** 2026-03-19 → 2026-03-20 (1 day)
**Git range:** Initial commit → `e2a433a` (80 commits)

**Key accomplishments:**

1. next-intl v4.8.3 wired into Next.js 16 with bilingual EN/VI locale routing (proxy.ts, as-needed prefix) and 5-tool typed registry
2. 7 pure case transform functions with 33 Vitest unit tests; full EN/VI translations with proper Unicode diacritics
3. Complete CaseConverter UI — 7 modes, clipboard copy, live char/word count, clear, dark mode (OS preference), site nav with locale switcher
4. Full SEO stack on homepage: generateMetadata(), JSON-LD (SoftwareApplication + HowTo), bidirectional hreflang EN ↔ VI — template for all pages
5. 4 sub-tools at EN+VI URLs (Reverse Text, Base64, Slug Generator, Password Generator) — matching UX, full i18n, related-tools nav
6. Native sitemap.ts with hreflang alternates + robots.ts covering all 10 tool URLs; all pages SSG
7. Production live at convertcase.uk — all 9 launch quality gates pass (CWV Good, Rich Results, hreflang, sitemap, robots, locale routing)

**Delivered:** A bilingual EN/VI text utility site with 5 tools, full SEO treatment, and production deployment on Vercel in 1 day.

---
