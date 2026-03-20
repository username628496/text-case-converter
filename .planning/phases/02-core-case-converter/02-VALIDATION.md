---
phase: 2
slug: core-case-converter
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts — Wave 0 installs |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run --coverage` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | — | setup | `npm ls vitest` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CORE-01 | unit | `npx vitest run src/lib/case-transforms.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CORE-02 | unit | `npx vitest run src/lib/case-transforms.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | I18N-04 | manual | — | — | ⬜ pending |
| 02-02-01 | 02 | 1 | CORE-03 | manual | — | — | ⬜ pending |
| 02-03-01 | 03 | 2 | CORE-04 | manual | — | — | ⬜ pending |
| 02-03-02 | 03 | 2 | CORE-05 | manual | — | — | ⬜ pending |
| 02-03-03 | 03 | 2 | CORE-06 | manual | — | — | ⬜ pending |
| 02-03-04 | 03 | 2 | CORE-07 | manual | — | — | ⬜ pending |
| 02-03-05 | 03 | 2 | CORE-08 | manual | — | — | ⬜ pending |
| 02-04-01 | 04 | 2 | SEO-01 | manual | — | — | ⬜ pending |
| 02-04-02 | 04 | 2 | SEO-02 | manual | — | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install -D vitest @vitest/coverage-v8` — no test runner exists
- [ ] `vitest.config.ts` — configure for Next.js/React 19
- [ ] `src/lib/case-transforms.test.ts` — stubs for CORE-01, CORE-02

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Locale switcher navigates EN↔VI | I18N-04 | Browser navigation | Click locale switcher, verify URL and content change |
| SiteNav renders category dropdowns | CORE-03 | Visual/interactive | Open nav, check dropdowns open/close |
| Tabs switch case modes live | CORE-04 | Browser interaction | Paste text, click each of 7 tabs, verify output |
| Copy button shows confirmation | CORE-05 | Browser interaction | Click Copy, verify "Copied!" appears ~1.5s |
| Word/char counts update live | CORE-06 | Browser interaction | Type text, verify counts update without submit |
| Clear button empties textarea | CORE-07 | Browser interaction | Type text, click Clear, verify empty |
| Dark mode via OS preference | CORE-08 | OS-level toggle | Set OS to dark mode, verify page renders dark |
| EN/VI metadata distinct | SEO-01 | View source / DevTools | Check title, description, canonical for / and /vi/ |
| JSON-LD + hreflang present | SEO-02 | View source / DevTools | Check script[type=application/ld+json] and link[hreflang] |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
