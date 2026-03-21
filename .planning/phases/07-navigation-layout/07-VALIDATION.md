---
phase: 7
slug: navigation-layout
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest v4 |
| **Config file** | vitest.config.ts (project root) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run && npm run build` |
| **Estimated runtime** | ~5 seconds (tests) + ~30 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green + build passes
- **Max feedback latency:** 35 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | LAYOUT-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | LAYOUT-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 1 | NAV-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 07-02-02 | 02 | 1 | NAV-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 07-03-01 | 03 | 2 | NAV-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 07-03-02 | 03 | 2 | NAV-02 | manual | visual inspection | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No new test files needed — Phase 07 adds UI components; validation via SSG build output + visual inspection
- [ ] Existing `src/lib/case-transforms.test.ts` and `src/lib/__tests__/sub-tools.test.ts` must remain green

*Existing infrastructure covers all phase requirements. No Wave 0 setup required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Footer renders EN/VI translations correctly | LAYOUT-01 | Browser rendering | Load / and /vi/, verify footer text in each locale |
| Sidebar nav shows active tool highlight | NAV-01 | usePathname client behavior | Visit each tool page, verify active link styling |
| Mobile sidebar nav accessible | NAV-01 | Touch/viewport interaction | Resize to 375px, verify nav accessible in Sheet/drawer |
| ToolPageLayout spacing consistent | LAYOUT-01 | Visual spacing | Compare all 5 tool pages side-by-side |
| All 10 URLs (EN + VI) render without error | LAYOUT-01 | SSG + locale routing | `npm run build` must complete with 10+ pages |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 35s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
