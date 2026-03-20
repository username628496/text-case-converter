# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-20
**Phases:** 4 | **Plans:** 12 | **Timeline:** 1 day

### What Was Built
- Next.js 16 + next-intl v4 bilingual (EN/VI) routing with as-needed locale prefix (no /en/ prefix)
- 7-mode text case converter homepage with live conversion, clipboard copy, word/char count, dark mode
- 4 sub-tools (Reverse Text, Base64, Slug Generator, Password Generator) at EN+VI URLs
- Full SEO stack: generateMetadata(), JSON-LD SoftwareApplication+HowTo schema, hreflang, sitemap, robots.txt
- Production deployed at convertcase.uk with all 9 launch quality gates passing

### What Worked
- TDD approach for transform functions: writing failing tests first made implementation fast and confident
- Template-first SEO: building the full metadata/JSON-LD pattern once on the homepage then reusing it across all 10 tool pages
- SSG from day one: no CWV fixes needed at launch — the architecture delivered Good scores automatically
- Tool registry pattern: central `tools.ts` with typed slugs/i18nKeys made adding tools and generating routes consistent

### What Was Inefficient
- proxy.ts placement: spent time debugging locale routing failure on Vercel because proxy.ts must live in `src/` not project root — Next.js 16 silently ignores root placement
- Stale Vercel deployment: production served Phase 1 code during Phase 4 audit because Vercel auto-deploy was not triggered; required a manual `git push` to unblock
- ASCII approximations in Phase 1 vi.json: placeholder approach required a full rewrite in Phase 2 — should have used correct Unicode diacritics from the start

### Patterns Established
- `proxy.ts` in `src/` (not project root) for Next.js 16 locale routing middleware
- `t.raw('items')` for next-intl v4 array access — `t('key.index')` throws MISSING_MESSAGE during SSG
- `resolvedTheme` (not `theme`) for dark mode toggle — avoids 'system' string in conditionals
- `await params` in generateMetadata — Next.js 16 params are a Promise, not a plain object
- `i18nNamespace` field on Tool interface — drives `getTranslations()` namespace selection across all tool pages

### Key Lessons
1. Read `node_modules/next/dist/docs/` before writing Next.js code — the installed version has breaking changes vs training data
2. Verify production deployment is current before running any audit — a stale deploy wastes an entire audit cycle
3. Resist ASCII placeholder translations — they create technical debt that requires a full rewrite before shipping
4. `localeDetection: false` is required with `as-needed` prefix to prevent Accept-Language auto-redirects from breaking locale routing on real browsers

### Cost Observations
- Model mix: balanced profile (sonnet primary)
- Sessions: ~1 day, 80 commits
- Notable: Yolo mode with parallel plan execution (wave-based) completed all 4 phases in 1 day

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Timeline | Key Change |
|-----------|--------|-------|----------|------------|
| v1.0 MVP | 4 | 12 | 1 day | Initial build |

### Cumulative Quality

| Milestone | Tests | LOC | Tools Shipped |
|-----------|-------|-----|---------------|
| v1.0 MVP | 33 | ~3,127 | 5 |
