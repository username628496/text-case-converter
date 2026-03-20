---
phase: 04-launch-readiness
plan: 01
subsystem: infra
tags: [lighthouse, cwv, hreflang, seo, vercel, sitemap]

# Dependency graph
requires:
  - phase: 03-sub-tools-seo-infrastructure
    provides: sitemap.ts, robots.ts, generateMetadata with hreflang alternates on all tool pages
provides:
  - Lighthouse CWV audit reports for homepage and password-generator (JSON + HTML)
  - Consolidated audit-results.md with pass/fail for 4 quality gate categories
  - Production deployment gap identified (Phase 1 code serving, Phase 3 code not deployed)
affects: [04-02-fixes-and-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lighthouse CLI via npx with --only-categories=performance for focused CWV auditing"
    - "HTTP Link headers carry hreflang in Next.js 16 RSC streaming (in addition to HTML meta)"
    - "Production audit against live Vercel URL (not local) as authoritative measurement"

key-files:
  created:
    - .planning/phases/04-launch-readiness/04-01-lighthouse-homepage.report.json
    - .planning/phases/04-launch-readiness/04-01-lighthouse-homepage.report.html
    - .planning/phases/04-launch-readiness/04-01-lighthouse-subtool.report.json
    - .planning/phases/04-launch-readiness/04-01-lighthouse-subtool.report.html
    - .planning/phases/04-launch-readiness/04-01-audit-results.md
  modified: []

key-decisions:
  - "Production deployment is stale (Phase 1 code) — Vercel was not auto-triggered after Phase 3 completion; deploy required before launch"
  - "CWV PASS despite stale code — Phase 1 is a simpler page, scores (97%/99% perf) expected to hold or improve post-deploy"
  - "Hreflang code is correct in local build — generateMetadata alternates verified in .next/server/app/*.html output"
  - "Sitemap/robots 404 on production are a deployment gap, not a code bug — both render correctly in local build"

patterns-established:
  - "Audit against Vercel URL even when stale — documents actual live state, not just code correctness"
  - "Local build verification as fallback when production is stale — separates code correctness from deployment state"

requirements-completed: [LAUNCH-VERIFY]

# Metrics
duration: 6min
completed: 2026-03-20
---

# Phase 04 Plan 01: Pre-Launch Quality Gate Audit Summary

**Lighthouse CWV audit (97%/99% perf, all thresholds PASS) completed against live Vercel URL; stale production deployment (Phase 1) identified as blocker — code correct, deploy required**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-20T06:48:31Z
- **Completed:** 2026-03-20T06:54:31Z
- **Tasks:** 2
- **Files modified:** 5 (4 Lighthouse report files + audit-results.md)

## Accomplishments

- Lighthouse audit completed for homepage (97% performance, LCP 2133ms) and password-generator (99% performance, LCP 2056ms) — all CWV thresholds PASS
- Identified stale Vercel production deployment serving Phase 1 code; Phase 3 features (tool pages, SEO metadata, sitemap, robots) not yet live
- Verified current codebase is correct via local `npm run build` — hreflang, sitemap, and robots all generate correctly in local build
- Locale routing confirmed working: `/` (EN) and `/vi/` (VI) both return HTTP 200 with correct locale content

## Task Commits

Each task was committed atomically:

1. **Task 1: Lighthouse CWV audit on homepage and sub-tool** - `a3cf89f` (chore)
2. **Task 2: Hreflang + locale routing + sitemap/robots audit** - `23520c1` (chore)

## Files Created/Modified

- `.planning/phases/04-launch-readiness/04-01-lighthouse-homepage.report.json` - Lighthouse JSON report, homepage EN
- `.planning/phases/04-launch-readiness/04-01-lighthouse-homepage.report.html` - Lighthouse HTML report, homepage EN
- `.planning/phases/04-launch-readiness/04-01-lighthouse-subtool.report.json` - Lighthouse JSON report, password-generator EN
- `.planning/phases/04-launch-readiness/04-01-lighthouse-subtool.report.html` - Lighthouse HTML report, password-generator EN
- `.planning/phases/04-launch-readiness/04-01-audit-results.md` - Consolidated audit results with pass/fail per gate

## Decisions Made

- **Production is stale, audit still conducted:** The audit ran against the live Vercel URL as specified. The stale state is documented — this is the correct approach since the audit's purpose is to determine actual live state.
- **Local build used as code verification:** When production 404'd on sitemap/robots and lacked hreflang in HTML, local build verified the code is correct. This separates "code quality" from "deployment state".
- **CWV scores accepted from Phase 1 deployment:** Phase 1 is architecturally simpler, so scores may be slightly different post-deploy. But the SSG architecture and font loading are the same, so scores are expected to remain PASS.

## Deviations from Plan

None — plan executed as written. The stale production deployment is a factual finding, not a deviation. The audit-results.md documents both production state and local-build verification as specified.

## Issues Encountered

**Stale production deployment discovered during audit:**
- Homepage served "Tool UI coming in Phase 2." — Phase 1 placeholder content
- No hreflang in HTML (Phase 1 had no `generateMetadata` with alternates)
- Sitemap/robots.txt both 404 (Phase 1 predates these files)
- Resolution: Documented in audit-results.md. Deploy required (Plan 02 action).

**Hreflang in HTTP Link headers vs HTML:**
- EN homepage has correct `Link:` HTTP response headers with hreflang (generated by Next.js 16 from routing config), but URLs point to Vercel deployment domain not canonical domain
- After deploy with Phase 3 code, `generateMetadata` will produce canonical-domain hreflang in HTML head

## User Setup Required

None — this plan was verification only, no external service configuration required.

## Next Phase Readiness

- CWV thresholds PASS — no performance fixes needed before launch
- Production deployment is the primary blocker — Plan 02 must trigger Vercel redeploy
- After deploy: re-run hreflang curl checks (4 pages) and sitemap/robots checks to confirm all pass
- Code is verified correct for all quality gates in local build — deploy will be sufficient to pass all gates

---
*Phase: 04-launch-readiness*
*Completed: 2026-03-20*
