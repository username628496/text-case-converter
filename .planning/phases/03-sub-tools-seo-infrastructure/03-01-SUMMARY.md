---
phase: 03-sub-tools-seo-infrastructure
plan: "01"
subsystem: lib/transforms + i18n
tags: [transforms, i18n, tdd, base64, slug, password, reverse-text]
dependency_graph:
  requires: []
  provides:
    - src/lib/reverse-text.ts (reverseText export)
    - src/lib/base64.ts (base64Encode, base64Decode exports)
    - src/lib/slug-generator.ts (generateSlug export, VIETNAMESE_MAP)
    - src/lib/password-generator.ts (generatePassword, PasswordOptions exports)
    - messages/en.json (reverseText, base64, slugGenerator, passwordGenerator namespaces)
    - messages/vi.json (reverseText, base64, slugGenerator, passwordGenerator namespaces)
  affects:
    - Plan 03-02 (tool components will import these libs and consume these translations)
tech_stack:
  added: []
  patterns:
    - TDD with vitest v4 (RED → GREEN pattern)
    - TextEncoder/TextDecoder for Unicode-safe Base64
    - crypto.getRandomValues for cryptographically secure password generation
    - VIETNAMESE_MAP constant for diacritic transliteration
key_files:
  created:
    - src/lib/reverse-text.ts
    - src/lib/base64.ts
    - src/lib/slug-generator.ts
    - src/lib/password-generator.ts
    - src/lib/__tests__/sub-tools.test.ts
  modified:
    - messages/en.json
    - messages/vi.json
decisions:
  - "apostrophes stripped silently (no hyphen) in generateSlug; other non-alphanumeric chars become hyphens — matches test spec behavior"
  - "base64Decode returns union type { result: string; error: false } | { result: ''; error: true } for type-safe error handling in components"
  - "generatePassword defaults to lowercase charset when all toggles disabled (Rule 2 correctness: no empty output)"
metrics:
  duration: "10 min"
  completed: "2026-03-20"
  tasks_completed: 2
  files_changed: 7
---

# Phase 03 Plan 01: Sub-Tool Transform Libraries and i18n Summary

**One-liner:** 4 transform/generator libs (reverseText, base64, slug with Vietnamese VIETNAMESE_MAP, crypto password) with 26 vitest tests passing, plus complete EN/VI i18n namespaces for all sub-tools.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 (RED) | Failing tests for 4 transform functions | c9f0e2d | src/lib/__tests__/sub-tools.test.ts |
| 1 (GREEN) | Implement 4 transform/generator libraries | c3a9fad | reverse-text.ts, base64.ts, slug-generator.ts, password-generator.ts |
| 2 | Add EN/VI translation namespaces for all sub-tools | 9d92b9e | messages/en.json, messages/vi.json |

## Verification Results

- `npx vitest run src/lib/__tests__/sub-tools.test.ts` — 26/26 tests pass
- EN/VI namespace validation — all 4 namespaces present with tool/faq/seo/howto sub-objects
- Existing `en.tool.title` still equals "Text Case Converter" (preserved)
- passwordGenerator: regenerateBtn, lengthLabel, uppercaseLabel, lowercaseLabel, numbersLabel, symbolsLabel all present
- base64: encodeTab, decodeTab, invalidBase64 all present
- All faq.items arrays have 4-5 items in both locales

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed apostrophe slug behavior causing word-split hyphens**
- **Found during:** Task 1 GREEN phase (test run after first implementation)
- **Issue:** First attempt used single regex `[^a-z0-9]+` → `-`, converting apostrophe in "Peter's" to a hyphen, producing `peter-s-guide` instead of `peters-guide`
- **Fix:** Added a pre-pass `.replace(/[''`]/g, '')` to strip apostrophes before the general non-alphanumeric replacement step
- **Files modified:** src/lib/slug-generator.ts
- **Commit:** c3a9fad (included in GREEN commit)

**2. [Rule 1 - Bug] Fixed initial slug implementation stripping non-alphanumeric silently**
- **Found during:** Task 1 GREEN phase (first test run)
- **Issue:** Original implementation stripped `@` and `.` without replacement, producing `helloworldcom` instead of `hello-world-com` for `hello@world.com`
- **Fix:** Changed approach from strip-non-alphanumeric to replace-with-hyphens (after apostrophe pre-strip)
- **Files modified:** src/lib/slug-generator.ts
- **Commit:** c3a9fad

## Decisions Made

1. **Apostrophe stripping in generateSlug:** Apostrophes (`'`, `'`, backtick) are removed silently without becoming hyphens. All other non-alphanumeric characters become hyphens. This matches the plan spec example (`Peter's Guide` → `peters-guide`) while also satisfying `hello@world.com` → `hello-world-com`.

2. **base64Decode union return type:** Returns `{ result: string; error: false } | { result: ''; error: true }` so components can discriminate on `error` without casting.

3. **generatePassword empty-charset fallback:** When all toggles are disabled, defaults to lowercase alphabet. This ensures the function always returns a valid string (correctness requirement, not a feature).

## Self-Check: PASSED

- src/lib/reverse-text.ts — FOUND
- src/lib/base64.ts — FOUND
- src/lib/slug-generator.ts — FOUND
- src/lib/password-generator.ts — FOUND
- src/lib/__tests__/sub-tools.test.ts — FOUND
- messages/en.json — FOUND (updated)
- messages/vi.json — FOUND (updated)
- Commit c9f0e2d — FOUND
- Commit c3a9fad — FOUND
- Commit 9d92b9e — FOUND
