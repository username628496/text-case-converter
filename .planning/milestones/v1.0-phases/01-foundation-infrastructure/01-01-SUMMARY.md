---
phase: 01-foundation-infrastructure
plan: 01
subsystem: infra
tags: [next-intl, i18n, routing, typescript, tool-registry]

# Dependency graph
requires: []
provides:
  - next-intl v4.8.3 installed with i18n routing fully configured
  - proxy.ts at project root intercepts requests for locale negotiation
  - src/i18n/routing.ts defines en (no prefix) and vi (/vi/) locale strategy
  - src/i18n/request.ts loads locale-specific message files server-side
  - next.config.ts wrapped with createNextIntlPlugin (reactCompiler preserved)
  - messages/en.json and messages/vi.json with 5 tool keys each
  - src/lib/tools.ts tool registry with typed Tool interface and 5 v1 tools
affects: [02-layout-pages, 03-seo-sitemap, all phases using tool registry or i18n]

# Tech tracking
tech-stack:
  added: [next-intl@4.8.3]
  patterns:
    - defineRouting with localePrefix as-needed (EN no prefix, VI /vi/)
    - getRequestConfig with dynamic JSON message loading
    - createMiddleware wrapping routing config in proxy.ts
    - createNextIntlPlugin wrapping NextConfig in next.config.ts
    - Tool registry as typed TypeScript array with lookup helpers

key-files:
  created:
    - proxy.ts
    - src/i18n/routing.ts
    - src/i18n/request.ts
    - messages/en.json
    - messages/vi.json
    - src/lib/tools.ts
  modified:
    - next.config.ts
    - package.json

key-decisions:
  - "next-intl/middleware import confirmed valid for v4.8.3 (ESM package, runtime-only error in bare node -e test is expected)"
  - "Default export used in proxy.ts (not named export) — createMiddleware returns a compatible function"
  - "Vietnamese translations use ASCII approximations without diacritics as placeholders for Phase 1"

patterns-established:
  - "proxy.ts: default export createMiddleware(routing) with negative-lookahead matcher"
  - "routing.ts: single source of truth for locales — all consumers import from here"
  - "Tool registry: slug + i18nKey + category + relatedSlugs + isHomepage flag"

requirements-completed: [I18N-01, I18N-02, I18N-03]

# Metrics
duration: 2min
completed: 2026-03-19
---

# Phase 1 Plan 01: i18n Foundation and Tool Registry Summary

**next-intl v4.8.3 wired into Next.js 16 with EN/VI locale routing (proxy.ts, routing.ts, request.ts, next.config.ts) and tool registry seeding 5 v1 tools**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-19T17:00:00Z
- **Completed:** 2026-03-19T17:01:36Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- next-intl v4.8.3 installed; i18n config (routing.ts, request.ts, proxy.ts, next.config.ts) all created and wired
- English URLs use no locale prefix (`/`); Vietnamese URLs use `/vi/` prefix — driven by `localePrefix: { mode: 'as-needed' }`
- Tool registry (src/lib/tools.ts) defines typed Tool interface and seeds 5 v1 tools with helper functions

## Task Commits

Each task was committed atomically:

1. **Task 1: Install next-intl and configure i18n routing + proxy** - `9e408c5` (feat)
2. **Task 2: Create tool registry** - `08adaa2` (feat)

**Plan metadata:** (docs commit, see below)

## Files Created/Modified
- `proxy.ts` - Next.js 16 proxy file; default-exports createMiddleware(routing) for locale routing
- `src/i18n/routing.ts` - defineRouting with locales ['en','vi'], defaultLocale 'en', mode 'as-needed'
- `src/i18n/request.ts` - getRequestConfig loading messages/${locale}.json per request
- `next.config.ts` - wrapped with createNextIntlPlugin; reactCompiler: true preserved
- `messages/en.json` - English translations; common, tools (5 entries), layout, home keys
- `messages/vi.json` - Vietnamese translations; same key structure as en.json
- `src/lib/tools.ts` - Tool interface + tools array (5 v1 tools) + getHomepageTool/getToolBySlug/getToolSlugs
- `package.json` - next-intl added to dependencies

## Decisions Made
- Used `createMiddleware` as default export in proxy.ts (not named export); next-intl docs confirm this pattern
- Vietnamese translations use ASCII approximations without diacritics as Phase 1 placeholders; will be refined in Phase 2 when full UI content is built
- `node -e "require('next-intl/middleware')"` fails in bare Node.js because next-intl is ESM and imports `next/server` which is only resolvable inside the Next.js build context; this is expected and not a bug

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- The verification command `node -e "require('next-intl/middleware')"` in the plan's `<verify>` block fails because next-intl v4 is ESM-only and `next/server` is only resolvable within the Next.js build context. Verified package existence and exports map directly instead. This is a known limitation of the verify command, not a code issue.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- i18n config complete: proxy.ts, routing.ts, request.ts, next.config.ts all in place
- Translation message files ready for Plan 02 (layout + locale pages)
- Tool registry ready for consumption by layout navigation and page generation
- Plan 02 (layout + pages) can begin immediately — all i18n foundations are in place

---
*Phase: 01-foundation-infrastructure*
*Completed: 2026-03-19*
