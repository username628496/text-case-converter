---
phase: 01-foundation-infrastructure
plan: 02
subsystem: infra
tags: [next-intl, i18n, locale-routing, adsense, layout, static-generation, next.js-16, vercel]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure/01-01
    provides: next-intl routing config, tool registry, message files
provides:
  - src/app/layout.tsx HTML-shell root layout (no locale logic, no metadata)
  - src/app/[locale]/layout.tsx with generateStaticParams, NextIntlClientProvider, 3 AdSense placeholder slots
  - src/app/[locale]/page.tsx homepage placeholder with locale-aware content
  - src/app/[locale]/[tool]/page.tsx tool page placeholder with generateStaticParams
  - src/proxy.ts in correct src/ location for Next.js 16 middleware registration
  - All locale routes statically generated (SSG) in next build
  - Language switcher in header toggling between / and /vi/
  - Vercel deployment live and verified at https://text-case-converter-chi.vercel.app/
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
    - localeDetection: false required with as-needed prefix to prevent Accept-Language redirects
    - proxy.ts must live in src/ for Next.js 16 (project root placement silently ignored)

key-files:
  created:
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/app/[locale]/[tool]/page.tsx
  modified:
    - src/app/layout.tsx
    - src/proxy.ts (moved from project root to src/)
    - src/i18n/routing.ts (added localeDetection: false)

key-decisions:
  - "src/app/page.tsx deleted — with as-needed localePrefix, proxy rewrites / to [locale=en]; root page.tsx caused route conflicts"
  - "lang attribute set to 'en' in root layout as Phase 1 default — hreflang tags (Phase 3) are primary locale signal for SEO"
  - "setRequestLocale called before getTranslations in every page/layout — required for SSG static rendering"
  - "proxy.ts must live in src/ for Next.js 16 — project root placement silently ignored; moved during Vercel debugging"
  - "localeDetection: false set in routing.ts — as-needed prefix conflicts with Accept-Language auto-redirect on real browsers"

patterns-established:
  - "Locale layout pattern: await params -> hasLocale check -> setRequestLocale -> getTranslations -> render"
  - "AdSense slots: data-ad-slot attribute on placeholder divs, header=90px, sidebar=250px, below-tool=90px"
  - "Language switcher: locale === 'en' ? /vi/ : / for toggle href"
  - "Next.js 16 middleware must be in src/ — not project root"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03]

# Metrics
duration: ~1 day (includes Vercel deployment and debugging)
completed: 2026-03-20
---

# Phase 1 Plan 02: App Directory Structure with Locale Layout and AdSense Slots Summary

**Next.js 16 locale-aware layout deployed to Vercel with 3 AdSense placeholder slots (90px/250px/90px), language switcher, static EN+VI routes, and two proxy fixes discovered only in production (proxy.ts location + localeDetection)**

## Performance

- **Duration:** ~1 day (includes Vercel deployment debugging)
- **Started:** 2026-03-19T17:04:21Z
- **Completed:** 2026-03-20
- **Tasks:** 2 of 2 (Task 1 auto + Task 2 human-verify checkpoint — approved)
- **Files modified:** 6

## Accomplishments

- Root layout replaced with HTML-shell only (Geist fonts + globals.css, no metadata, no i18n logic)
- Locale layout created with `generateStaticParams`, `setRequestLocale`, `NextIntlClientProvider`, language switcher in header, and 3 AdSense placeholder divs
- Homepage placeholder and tool page placeholder created with static params for all EN/VI route combinations
- `next build` succeeds with all routes showing SSG static symbol — no dynamic rendering
- Vercel deployment verified at https://text-case-converter-chi.vercel.app/ — both locales work, no 404s or redirect loops
- Two production-only routing bugs identified and fixed (proxy.ts location, localeDetection)

## Task Commits

1. **Task 1: Create root layout, locale layout with AdSense slots, and page placeholders** - `b2f4a82` (feat)
2. **Task 2: Vercel deployment verification** - human-approved

**Deviation fix commits (during Task 2 verification):**
- `29a925e` fix(routing): move proxy.ts to src/ so Next.js 16 registers it
- `5a76e05` fix(i18n): disable locale detection to prevent browser-header redirects

**Plan metadata:** `ffafe7a` (docs: complete layout and pages plan — checkpoint reached)

## Files Created/Modified

- `src/app/layout.tsx` - HTML-shell root layout: Geist fonts, globals.css, no metadata, no locale logic
- `src/app/page.tsx` - DELETED: conflicting root page; proxy handles / -> [locale=en] routing
- `src/app/[locale]/layout.tsx` - Locale layout with generateStaticParams, setRequestLocale, NextIntlClientProvider, header ad slot (90px), sidebar ad slot (250px hidden on mobile), below-tool ad slot (90px), language switcher
- `src/app/[locale]/page.tsx` - Homepage placeholder rendering home.heading and home.subheading translations
- `src/app/[locale]/[tool]/page.tsx` - Tool page placeholder with generateStaticParams from getToolSlugs(), notFound for invalid slugs
- `src/proxy.ts` - Moved from project root to src/; Next.js 16 only registers middleware from src/
- `src/i18n/routing.ts` - Added localeDetection: false to prevent Accept-Language header redirects

## Decisions Made

- Deleted `src/app/page.tsx` rather than replacing with redirect — with `as-needed` localePrefix, next-intl proxy rewrites `/` directly to `[locale=en]`; a root page.tsx causes route conflicts
- Set `lang="en"` in root layout as Phase 1 default; search engines use hreflang (Phase 3) as primary locale signal
- `setRequestLocale` called before any `getTranslations` calls in every page/layout — required for SSG to work correctly with next-intl v4
- Moved proxy.ts to src/ — Next.js 16 changed middleware discovery; project root is silently ignored
- Set `localeDetection: false` — real browsers send Accept-Language headers that trigger unwanted redirects on Vercel when using as-needed prefix mode

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] proxy.ts at project root not registered by Next.js 16 on Vercel**
- **Found during:** Task 2 (Vercel deployment verification)
- **Issue:** proxy.ts was placed at project root (from Plan 01), but Next.js 16 only discovers middleware from the src/ directory. In local dev the proxy was being picked up by a different mechanism, but on Vercel with a clean build it was silently ignored — causing /vi/ to return 404 and / to not route correctly.
- **Fix:** Moved proxy.ts from project root to src/proxy.ts
- **Files modified:** src/proxy.ts
- **Verification:** Vercel re-deployed; /vi/ returned Vietnamese content correctly
- **Committed in:** `29a925e`

**2. [Rule 1 - Bug] localeDetection defaulting to true caused browser Accept-Language redirects**
- **Found during:** Task 2 (Vercel deployment verification)
- **Issue:** next-intl defaults localeDetection to true. On Vercel (real HTTP environment), browsers send Accept-Language headers. With as-needed prefix mode (EN has no prefix, VI has /vi/), next-intl auto-redirected based on the header — conflicting with the intended routing strategy and causing redirect loops for non-English browser users visiting /.
- **Fix:** Set localeDetection: false in src/i18n/routing.ts
- **Files modified:** src/i18n/routing.ts
- **Verification:** Browser visit to / no longer redirects based on Accept-Language; language switcher is the sole locale toggle mechanism
- **Committed in:** `5a76e05`

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were required for correct Vercel behaviour. Neither changes the planned layout structure or feature set. The as-needed localePrefix strategy works correctly after both fixes applied.

## Issues Encountered

Both bugs were invisible in local dev and only surfaced on Vercel:
- proxy.ts location: Next.js 16 changed middleware file discovery; project root is no longer valid (src/ required)
- localeDetection: local dev typically uses a single English-locale browser; Vercel serves real HTTP requests from browsers with varied Accept-Language headers

## User Setup Required

None — Vercel project is connected and auto-deploys from main branch pushes.

## Next Phase Readiness

- Complete locale routing foundation is in place: EN at /, VI at /vi/, tool pages at /[locale]/[tool]/
- Layout structure with AdSense slots ready for real ad unit insertion (Phase 3+)
- All routes statically generated — Vercel CDN serves pre-rendered pages
- Phase 2 (tool UI) can begin immediately: add interactive React components inside [locale]/[tool]/page.tsx
- Phase 3 (SEO/sitemap) can use the static route structure as the basis for sitemap.ts and hreflang

---
*Phase: 01-foundation-infrastructure*
*Completed: 2026-03-20*
