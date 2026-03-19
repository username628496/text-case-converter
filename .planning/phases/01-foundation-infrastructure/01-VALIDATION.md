---
phase: 1
slug: foundation-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — Wave 0 gap; primary validation is build smoke tests |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build 2>&1 | grep -E "○|λ"` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build 2>&1 | grep -E "○|λ"` to confirm static output
- **Before `/gsd:verify-work`:** Full build must be green + manual browser check of `/` and `/vi/`
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-??-01 | TBD | 1 | INFRA-01 | smoke | `npm run build 2>&1 \| grep -E "○\|λ"` | ❌ Wave 0 | ⬜ pending |
| 1-??-02 | TBD | 1 | INFRA-02 | manual | `curl http://localhost:3000/ \| grep data-ad-slot` | ❌ Wave 0 | ⬜ pending |
| 1-??-03 | TBD | 1 | INFRA-03 | manual | Browse Vercel preview URL after deploy | N/A — Vercel | ⬜ pending |
| 1-??-04 | TBD | 1 | I18N-01 | smoke | `npm run build` (translation errors surface here) | ❌ Wave 0 | ⬜ pending |
| 1-??-05 | TBD | 1 | I18N-02 | smoke | `curl -I http://localhost:3000/` shows 200, no `/en/` redirect | ❌ Wave 0 | ⬜ pending |
| 1-??-06 | TBD | 1 | I18N-03 | smoke | `curl -I http://localhost:3000/vi/` shows 200 | ❌ Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Note: Task IDs will be filled in once PLAN.md files are created.*

---

## Wave 0 Requirements

- [ ] No test framework — this phase focuses on infra scaffolding; formal unit tests deferred to later phases
- [ ] Build smoke test: `npm run build` must succeed after each structural task
- [ ] Locale routing smoke test: `npm run dev` then verify `/` and `/vi/` in browser
- [ ] Static output check: `next build` output shows `○` (static) for all locale routes, no `λ` (dynamic)

*Primary validation for this phase is a successful `next build` with all-static output + a working Vercel deploy with observable locale routing, not automated unit tests.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| AdSense placeholder divs in rendered HTML | INFRA-02 | Layout visual/structural check | After `npm run build && npm start`, run `curl http://localhost:3000/ \| grep data-ad-slot` — expect 3 matches (header, sidebar, below-tool) |
| English homepage at `/` | I18N-02 | Proxy rewrite behavior requires running server | Browse `http://localhost:3000/` — expect English content, no redirect to `/en/` |
| Vietnamese homepage at `/vi/` | I18N-03 | Locale routing requires running server | Browse `http://localhost:3000/vi/` — expect Vietnamese content |
| All routes static in build output | INFRA-01 | Requires inspecting `next build` terminal output | Run `npm run build` — all `[locale]` routes should show `○` (static), none should show `λ` (dynamic) |
| Vercel deploy resolves correctly | INFRA-03 | Requires actual Vercel deployment | Push to `main` on GitHub, open Vercel preview URL, verify `/` and `/vi/` routes both serve content |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
