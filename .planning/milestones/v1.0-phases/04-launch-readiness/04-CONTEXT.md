# Phase 4: Launch Readiness - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify the site passes all pre-launch quality gates and confirm production deployment is live and working. Specifically: Core Web Vitals in "Good" range, structured data valid (Rich Results Test), hreflang bidirectional tags verified, and production Vercel URL confirmed serving correct locales. No new features — this is a verification + fix + deployment phase.

</domain>

<decisions>
## Implementation Decisions

### Lighthouse Audit
- Run against the **live Vercel production URL** — not a local build. SSG pages are served from Vercel's edge CDN, so production scores are the authoritative measurement.
- Cover **homepage + 1 sub-tool page** — matches success criteria. If homepage and one sub-tool pass, the shared component structure means all pages pass.
- Invoke via **`npx lighthouse <url> --output=json --output=html`** — automatable, captures scores in a file, easy to verify pass/fail against thresholds (LCP < 2.5s, CLS < 0.1, INP < 200ms).

### Fix Strategy
- Phase 4 **owns the full launch-ready state** — if any quality gate fails, the plan includes a fix task and re-verification. Phase does not complete until all gates pass.
- If CWV fixes are needed, **Claude decides priority** based on what the Lighthouse report shows (likely LCP first given the tool page structure, but not prescribed upfront).

### Hreflang Verification
- Verify via **`curl` + grep on live URLs** — scriptable, verifies actual served HTML output including `<link rel="alternate" hreflang>` tags.
- Cover **homepage + 1 sub-tool** (both EN and VI variants = 4 curl calls). The `generateMetadata` pattern is shared across all pages, so if it's correct here it's correct everywhere.
- Check for: EN page references VI page, VI page references EN page, no self-referential mismatches, correct `x-default` if present.

### Production Verification
- **curl for HTTP/locale checks** (automatable): verify `/` returns HTTP 200 with English content markers, `/vi/` returns HTTP 200 with Vietnamese content markers, no redirect loops.
- **Human confirmation for tool functionality**: user opens the production URL in a browser and confirms at least one tool converts text correctly. Client-side JS interaction cannot be verified via curl.
- Tool functional correctness was already validated in Phases 2–3 — production verification is confirming the deployment, not re-testing the logic.

### Claude's Discretion
- Specific Lighthouse flags and output format options
- Which sub-tool to use as the representative audit/hreflang page
- Exact content markers to grep for in locale verification (e.g., page title text or a known translation key value)
- Order of operations within the plan (deploy first vs audit first)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Lighthouse CLI
- `node_modules/next/dist/docs/` — Check if there are any performance-specific docs for Next.js 16 SSG + Vercel. Look for CWV optimization guidance.

### Next.js 16 — Performance
- No external spec — CWV thresholds are from the roadmap success criteria: LCP < 2.5s, CLS < 0.1, INP < 200ms.

### Project Requirements
- `.planning/ROADMAP.md` §Phase 4 Success Criteria — The four specific gates that must pass.
- `.planning/REQUIREMENTS.md` §Infrastructure — INFRA-01 (SSG), INFRA-03 (Vercel deploy) for deployment context.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No new components needed — this is a verification and fix phase.
- If CWV fixes are needed, primary candidates: `src/app/[locale]/layout.tsx` (font loading, CSS), `src/components/tool-page.tsx` or individual tool components (hydration weight), `src/app/globals.css` (render-blocking CSS).

### Established Patterns
- **SSG via `generateStaticParams`** — all pages are static; no server runtime. CWV fixes must be compatible with static output.
- **React Compiler enabled** — do NOT add manual `useMemo`/`useCallback` during any CWV fixes.
- **Tailwind v4** — use v4 syntax for any CSS fixes.

### Integration Points
- Vercel deployment: GitHub push to main triggers deploy (established Phase 1). Production URL is the target for all verification steps.
- `src/proxy.ts` — locale routing; `/vi/` prefix pattern. Curl verification targets this routing behavior.

</code_context>

<specifics>
## Specific Ideas

- Verification is ordered: deploy → audit → fix (if needed) → re-audit → confirm
- The "human confirms tool works" step is a deliberate lightweight manual gate — not a full re-QA of all tools (that was Phase 3)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-launch-readiness*
*Context gathered: 2026-03-20*
