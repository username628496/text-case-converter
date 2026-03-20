# Phase 04 Audit Results

**Audited:** 2026-03-20
**Production URL:** https://text-case-converter-chi.vercel.app/
**Lighthouse version:** 12.8.2

> **Critical finding:** Production deployment is stale — serving Phase 1 code ("Tool UI coming in Phase 2.").
> All features built in Phases 2–3 (tool pages, SEO metadata, sitemap, robots.txt) are absent from the live site.
> A `git push` to trigger Vercel redeployment is required before the site is launch-ready.
> CWV scores below are from the stale Phase 1 build — still PASS thresholds, will likely improve post-deploy.
> Hreflang, sitemap, and robots checks are partially reported from local build verification.

---

## Core Web Vitals (Lighthouse)

| Page | LCP | CLS | INP | Perf Score | Pass? |
|------|-----|-----|-----|------------|-------|
| Homepage (EN) `/` | 2133ms | 0.00 | N/A | 97% | YES |
| `/password-generator/` (EN) | 2056ms | 0.00 | N/A | 99% | YES |

Thresholds: LCP < 2500ms, CLS < 0.1, INP < 200ms (or N/A)

Notes:
- INP is N/A for both pages — Lighthouse did not detect user interaction during headless audit. This is acceptable for SSG pages per plan spec.
- Lighthouse ran against the Phase 1 deployment; scores expected to remain good or improve after redeployment (fewer placeholder JS bundles in Phase 3).
- HTML reports saved: `04-01-lighthouse-homepage.report.html` / `04-01-lighthouse-subtool.report.html`

---

## Hreflang Verification

| Page | EN hreflang | VI hreflang | Bidirectional | Pass? |
|------|-------------|-------------|---------------|-------|
| Homepage (EN) | via HTTP Link header (Vercel URL) | via HTTP Link header (Vercel URL) | YES (both locales referenced) | PARTIAL |
| `/password-generator/` | code-correct (local build) | code-correct (local build) | YES (local build verified) | PARTIAL |

Details:
- **Production (stale):** EN homepage has HTTP `Link:` response headers: `hreflang="en"` → `https://text-case-converter-chi.vercel.app/`, `hreflang="vi"` → `https://text-case-converter-chi.vercel.app/vi`, `hreflang="x-default"` → `https://text-case-converter-chi.vercel.app/`. Bidirectional. Uses Vercel URL (not canonical domain).
- **Local build (current code):** `<link rel="alternate" hrefLang="en" href="https://textcaseconverter.com/"/>` and `<link rel="alternate" hrefLang="vi" href="https://textcaseconverter.com/vi/"/>` correctly rendered in HTML `<head>` for all pages. Canonical domain `textcaseconverter.com` used as required.
- **Root cause of PARTIAL:** Phase 1 code has no `generateMetadata` alternates. Current code (Phase 2+) does. Deploy required.
- **After deploy:** All 4 hreflang checks (EN homepage, VI homepage, EN password-generator, VI password-generator) expected to PASS with canonical-domain URLs.

---

## Production Locale Routing

| URL | HTTP Status | Correct Content | Pass? |
|-----|-------------|-----------------|-------|
| `/` | 200 | YES — serves English content ("Text Case Converter"), `locale: en` in RSC payload | YES |
| `/vi/` | 200 | YES — serves Vietnamese content ("Chuyen Doi Chu Hoa Thuong"), `locale: vi` in RSC payload | YES |

Notes:
- Both locales return HTTP 200 without redirect loops.
- Content is locale-appropriate (VI page has Vietnamese translations in RSC payload).
- Sub-tool pages (`/password-generator/`, `/vi/`) redirect 308 → trailing-slash-normalized URL then return 200.

---

## Sitemap & Robots

| Resource | HTTP Status | Valid Content | Pass? |
|----------|-------------|---------------|-------|
| `/sitemap.xml` | 404 | N/A (not deployed) | NO |
| `/robots.txt` | 404 | N/A (not deployed) | NO |

Details:
- **Production:** Both return 404. Phase 1 deployment predates `src/app/sitemap.ts` and `src/app/robots.ts` (added in Phase 3).
- **Local build (current code):**
  - `sitemap.xml` generates correctly with 5 URLs × 2 locales = 10 `<xhtml:link>` hreflang entries. Uses canonical domain `textcaseconverter.com`.
  - `robots.txt` generates correctly: `User-Agent: *`, `Allow: /`, `Sitemap: https://textcaseconverter.com/sitemap.xml`.
- **After deploy:** Both expected to return 200 with valid content.

---

## Overall

- Total gates: 9 (CWV × 2 pages, Hreflang × 2 pages, Locale routing × 2, Sitemap, Robots, Deploy state)
- Passed (current production): 4 (CWV homepage, CWV subtool, Locale EN, Locale VI)
- Partial (code correct, stale deploy): 2 (Hreflang homepage, Hreflang subtool)
- Failed (stale deploy): 2 (Sitemap, Robots)
- Failed (requires action): 1 (Production deployment is stale — Phase 1 code serving)

**Action needed: YES**

Required actions for launch-readiness:
1. **Deploy latest code** — `git push` to trigger Vercel redeploy (should happen automatically). This resolves all PARTIAL and FAILED gates except CWV which already pass.
2. **Re-verify after deploy** — Run hreflang curl checks and sitemap/robots checks again after deployment completes.
3. **CWV after deploy** — Re-run Lighthouse after deploy to confirm scores hold with Phase 3 codebase. Expected: same or better scores given SSG architecture is unchanged.

**Expected state after deploy:**
- All 9 gates: PASS
- Hreflang in HTML head with canonical domain `textcaseconverter.com`
- Sitemap: 200, 10+ xhtml:link entries
- Robots.txt: 200, sitemap referenced
- CWV: LCP < 2500ms, CLS < 0.1, INP N/A

---

## Local Build Verification (current codebase)

The following were verified against `npm run build` output (15 static pages generated):

| Check | Result |
|-------|--------|
| Homepage hreflang in HTML | PASS — `hrefLang="en"` → `https://textcaseconverter.com/` and `hrefLang="vi"` → `https://textcaseconverter.com/vi/` |
| Password-generator hreflang in HTML | PASS — canonical domain, both locales |
| Sitemap xhtml:link count | PASS — 10 entries (5 pages × 2 locales) |
| Robots.txt sitemap reference | PASS — `Sitemap: https://textcaseconverter.com/sitemap.xml` |
| Build succeeds (0 errors) | PASS |
