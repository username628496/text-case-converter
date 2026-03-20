---
phase: 02-core-case-converter
plan: "02"
subsystem: navigation
tags: [sitenav, navigation-menu, sheet, dark-mode, locale-switcher, next-themes, shadcn]
dependency_graph:
  requires: ["02-01"]
  provides: ["SiteNav component", "nav translation namespace"]
  affects: ["src/app/[locale]/layout.tsx"]
tech_stack:
  added: []
  patterns: ["mounted state hydration guard for next-themes", "client component with shadcn NavigationMenu+Sheet"]
key_files:
  created:
    - src/components/site-nav.tsx
  modified:
    - src/app/[locale]/layout.tsx
    - messages/en.json
    - messages/vi.json
decisions:
  - "Header ad slot kept above SiteNav (not inside it) — layout structure preserved from Plan 01"
  - "resolvedTheme used (not theme) to avoid 'system' string in dark mode toggle logic"
  - "mounted guard renders Moon placeholder until hydrated — prevents SSR/client mismatch"
metrics:
  duration: "2 min"
  completed_date: "2026-03-20"
  tasks_completed: 2
  files_changed: 4
---

# Phase 02 Plan 02: SiteNav Component Summary

SiteNav 'use client' component with desktop NavigationMenu (4 empty category dropdowns), mobile Sheet drawer, next-themes dark mode toggle with mounted hydration guard, and locale switcher DropdownMenu; wired into locale layout replacing Phase 1 minimal header.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | SiteNav component | a1e2577 | src/components/site-nav.tsx (created) |
| 2 | Replace layout header with SiteNav | 6fbbe7c | src/app/[locale]/layout.tsx, messages/en.json, messages/vi.json |

## Verification Results

- Build: `npm run build` passed (13 static pages generated, no TypeScript errors)
- All acceptance criteria passed for both tasks
- Ad slots (header, sidebar, below-tool) preserved in layout
- Toaster preserved in layout

## Decisions Made

1. **Header ad slot position:** Kept above SiteNav rather than inside it — maintains existing layout structure from Plan 01 and keeps SiteNav focused on navigation only.

2. **resolvedTheme over theme:** Used `resolvedTheme` to avoid the string `"system"` in toggle logic, ensuring toggle always works correctly regardless of OS preference setting.

3. **Mounted hydration guard:** `useState(false)` + `useEffect(() => setMounted(true), [])` pattern prevents React hydration mismatch for the theme icon — renders Moon as placeholder until client mounts.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- src/components/site-nav.tsx: FOUND
- src/app/[locale]/layout.tsx: FOUND
- 02-02-SUMMARY.md: FOUND
- Commit a1e2577: FOUND
- Commit 6fbbe7c: FOUND
