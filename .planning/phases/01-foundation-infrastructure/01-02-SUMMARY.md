---
phase: 01-foundation-infrastructure
plan: 02
subsystem: infra
tags: [next-intl, i18n, locale-routing, adsense, layout, static-generation, next.js-16]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure/01-01
    provides: next-intl routing config, tool registry, message files
provides:
  - src/app/layout.tsx HTML-shell root layout (no locale logic, no metadata)
  - src/app/[locale]/layout.tsx with generateStaticParams, NextIntlClientProvider, 3 AdSense placeholder slots
  - src/app/[locale]/page.tsx homepage placeholder with locale-aware content
  - src/app/[locale]/[tool]/page.tsx tool page placeholder with generateStaticParams
  - All locale routes statically generated (SSG) in next build
  - Language switcher in header toggling between / and /vi/
affects: [02-tool-ui, 03-seo-sitemap, all phases using layout or locale pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Root layout as HTML-shell only: fonts + globals.css, no locale logic
    - Locale layout as the locale-aware shell: setRequestLocale before getTranslations
    - NextIntlClientProvider with no manual messages/locale props (v4 auto-inherits)
    - generateStaticParams in [locale]/layout.tsx propagates to all child routes
    - AdSense placeholder divs with data-ad-slot attributes at header/sidebar/below-tool

key-files:
  created:
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/app/[locale]/[tool]/page.tsx
  modified:
    - src/app/layout.tsx

key-decisions:
  - "src/app/page.tsx deleted — with as-needed localePrefix, proxy rewrites / to [locale=en]; root page.tsx caused route conflicts"
  - "lang attribute set to 'en' in root layout as Phase 1 default — hreflang tags (Phase 3) are primary locale signal for SEO"
  - "setRequestLocale called before getTranslations in every page/layout — required for SSG static rendering"

patterns-established:
  - "Locale layout pattern: await params -> hasLocale check -> setRequestLocale -> getTranslations -> render"
  - "AdSense slots: data-ad-slot attribute on placeholder divs, header=90px, sidebar=250px, below-tool=90px"
  - "Language switcher: locale === 'en' ? /vi/ : / for toggle href"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03]

# Metrics
duration: 5min
completed: 2026-03-20
---

# Phase 1 Plan 02: App Directory Structure with Locale Layout and AdSense Slots Summary

**Next.js 16 app directory wired with next-intl locale routing: HTML-shell root layout, locale-aware layout with 3 AdSense placeholder slots (90px/250px/90px), language switcher, and statically-generated EN+VI placeholder pages for homepage and 4 tool routes**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-19T17:04:21Z
- **Completed:** 2026-03-19T17:09:00Z
- **Tasks:** 1 of 2 (Task 2 is a human-verify checkpoint)
- **Files modified:** 4

## Accomplishments
- Root layout replaced with HTML-shell only (Geist fonts + globals.css, no metadata, no i18n logic)
- Locale layout created with `generateStaticParams`, `setRequestLocale`, `NextIntlClientProvider`, language switcher in header, and 3 AdSense placeholder divs
- Homepage placeholder (`[locale]/page.tsx`) and tool page placeholder (`[locale]/[tool]/page.tsx`) created with proper static params
- `next build` succeeds with all routes (EN + VI for homepage and 4 tools) showing SSG `●` symbol — no dynamic rendering

## Task Commits

1. **Task 1: Create root layout, locale layout with AdSense slots, and page placeholders** - `b2f4a82` (feat)

**Task 2 (checkpoint:human-verify):** Pending — requires GitHub push and Vercel deployment verification.

## Files Created/Modified
- `src/app/layout.tsx` - HTML-shell root layout: Geist fonts, globals.css, no metadata, no locale logic
- `src/app/page.tsx` - DELETED: conflicting root page; proxy handles / -> [locale=en] routing
- `src/app/[locale]/layout.tsx` - Locale layout with generateStaticParams, setRequestLocale, NextIntlClientProvider, header ad slot (90px), sidebar ad slot (250px), below-tool ad slot (90px), language switcher
- `src/app/[locale]/page.tsx` - Homepage placeholder rendering home.heading and home.subheading translations
- `src/app/[locale]/[tool]/page.tsx` - Tool page placeholder with generateStaticParams from getToolSlugs(), notFound for invalid slugs

## Decisions Made
- Deleted `src/app/page.tsx` rather than replacing with redirect — with `as-needed` localePrefix, next-intl proxy rewrites `/` directly to `[locale=en]`; a root page.tsx causes route conflicts
- Set `lang="en"` in root layout as Phase 1 default; search engines use hreflang (Phase 3) as primary locale signal
- `setRequestLocale` called before any `getTranslations` calls in every page/layout — this is required for SSG to work correctly with next-intl v4

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- No GitHub remote configured (`git remote -v` returns empty). The checkpoint task requires pushing to GitHub and verifying on Vercel. User must add a remote before the checkpoint can complete.

## User Setup Required
- Add GitHub remote: `git remote add origin <your-github-repo-url>`
- Push: `git push -u origin main`
- Create Vercel project at https://vercel.com/new (import GitHub repo, default settings)
- Verify deployment following the checkpoint verification checklist

## Next Phase Readiness
- App directory structure complete: root layout, locale layout, homepage and tool pages all created
- Build verified: all EN/VI routes statically generated
- Awaiting Vercel deployment verification (Task 2 checkpoint)
- Phase 2 tool UI can begin after Vercel deployment confirmed

---
*Phase: 01-foundation-infrastructure*
*Completed: 2026-03-20*
