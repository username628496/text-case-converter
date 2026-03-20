# Phase 1: Foundation Infrastructure - Research

**Researched:** 2026-03-19
**Domain:** Next.js 16 App Router, next-intl v4, Tailwind CSS v4, Vercel deployment
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**App Directory Structure**
- Use `app/[locale]/` tree — all localized pages live under `src/app/[locale]/`
- Root layout (`src/app/layout.tsx`) is the HTML shell only (no locale-specific logic)
- Locale-aware root layout lives at `src/app/[locale]/layout.tsx`
- `generateStaticParams` exported from `[locale]/layout.tsx` returning `[{locale: 'en'}, {locale: 'vi'}]` — child pages inherit it
- Tool pages live at `src/app/[locale]/[tool]/page.tsx`
- `proxy.ts` at project root handles next-intl v4 locale routing (NOT `middleware.ts`)
- English uses clean URLs with no prefix (`/`, `/reverse-text/`); Vietnamese uses `/vi/` prefix (`/vi/`, `/vi/reverse-text/`)

**Translation Files**
- Messages live at project root: `messages/en.json` and `messages/vi.json`
- Standard next-intl convention, not inside `src/`

**Tool Registry Schema**
- Location: `src/lib/tools.ts`
- Each entry carries: `slug`, `i18nKey`, `category`, `relatedSlugs`, `isHomepage` (boolean flag)
- Phase 1 seeds with 5 v1 tools: case-converter, reverse-text, base64-encode-decode, slug-generator, password-generator

**Layout Anatomy**
- Three-column-ish layout: header strip at top, main content (left) + sidebar (right), below-tool slot inside main
- AdSense placeholder slots with reserved `min-height`: header=90px, sidebar=250px, below-tool=90px
- Sidebar collapses on mobile (hidden or stacked below main)
- Full header with site name (linking to `/`) + EN/VI language switcher

**Vercel / GitHub Setup**
- Not yet connected — Vercel project needs to be created manually via Vercel dashboard
- No env vars required for Phase 1
- Push to `main` branch triggers deployment

### Claude's Discretion
- Exact AdSense placeholder div attributes (class names, aria labels, data attributes, HTML comments)
- Exact sidebar width in CSS
- Language switcher visual style
- Any `vercel.json` if needed for headers/redirects beyond what next-intl handles

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | All pages statically generated (SSG) via generateStaticParams — no server runtime required | `generateStaticParams` in `[locale]/layout.tsx` propagates to all child pages; `setRequestLocale` enables static rendering in next-intl v4 |
| INFRA-02 | Root layout includes AdSense placeholder divs at 3 placements with reserved CSS min-height (90px/250px/90px) | Tailwind v4 inline min-height utilities in `[locale]/layout.tsx`; placeholders are inert divs with no script |
| INFRA-03 | App deploys to Vercel via GitHub push to main — no `output: 'export'` | Vercel auto-detects Next.js; no `output: 'export'` required; proxy.ts (Next.js 16) is supported |
| I18N-01 | All tool content translated EN/VI via next-intl | next-intl v4 installed; `messages/en.json` + `messages/vi.json` at project root; `getTranslations` in Server Components |
| I18N-02 | English pages use clean URLs without locale prefix: `/[tool-slug]/` | `localePrefix: { mode: 'as-needed' }` in `defineRouting` — default locale gets no prefix |
| I18N-03 | Vietnamese pages use `/vi/[tool-slug]/` prefix | Same `defineRouting` config covers `/vi/` prefix for non-default locale |
</phase_requirements>

---

## Summary

This phase wires up a Next.js 16.2.0 App Router project with next-intl v4 for bilingual routing (English unprefixed, Vietnamese at `/vi/`), establishes the layout shell with AdSense placeholder slots, creates the tool registry, and connects the GitHub repo to Vercel for automatic deploys.

The critical technical challenge is next-intl v4 static rendering: every layout and page in the `[locale]` segment must call `setRequestLocale(locale)` before any next-intl hooks are used. Without this call, next-intl falls back to dynamic rendering (reading `headers()`), which breaks SSG. The `createNextIntlPlugin` wrapper in `next.config.ts` is required — it is not optional.

Next.js 16 renames `middleware.ts` to `proxy.ts`. The function export is `proxy` (not `middleware`). The existing codebase has `reactCompiler: true` in `next.config.ts`, which must be preserved when wrapping with `withNextIntl`. No `output: 'export'` should ever appear — it disables Proxy execution on Vercel.

**Primary recommendation:** Install next-intl v4.8.3, configure `defineRouting` with `localePrefix: { mode: 'as-needed' }`, wire `createNextIntlPlugin` into `next.config.ts`, write `proxy.ts` with `createMiddleware(routing)`, and use `setRequestLocale` + `generateStaticParams` in the `[locale]/layout.tsx`.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.0 (installed) | App Router, SSG, Proxy | Already installed; v16 renames middleware to proxy |
| next-intl | 4.8.3 (latest) | i18n routing + translations | Official next-intl recommendation; v4 supports Next.js 16 |
| react | 19.2.4 (installed) | UI runtime | Already installed |
| tailwindcss | ^4 (installed) | Utility CSS | Already installed; v4 syntax active |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/postcss | ^4 (installed) | Tailwind v4 PostCSS integration | Already in devDependencies |
| babel-plugin-react-compiler | 1.0.0 (installed) | React Compiler support | Already present; required by `reactCompiler: true` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl | Native Next.js getDictionary pattern | next-intl is chosen (locked decision); native pattern is also viable but has less ecosystem tooling |
| next-intl routing | @formatjs/intl-localematcher + Negotiator | Locked; next-intl encapsulates this cleanly |

**Installation:**
```bash
npm install next-intl
```

**Version verification:** Confirmed via npm registry: next-intl latest is 4.8.3 (2026-03). Peer deps accept `next ^12–^16`, `react ^16.8+`, `typescript ^5`.

---

## Architecture Patterns

### Recommended Project Structure
```
text-case-converter/
├── messages/
│   ├── en.json              # English translations (project root, not src/)
│   └── vi.json              # Vietnamese translations
├── proxy.ts                 # next-intl middleware (Next.js 16: proxy.ts not middleware.ts)
├── src/
│   ├── i18n/
│   │   ├── routing.ts       # defineRouting — locales, defaultLocale, localePrefix
│   │   └── request.ts       # getRequestConfig — loads messages per locale
│   ├── lib/
│   │   └── tools.ts         # Tool registry (slug, i18nKey, category, relatedSlugs, isHomepage)
│   └── app/
│       ├── layout.tsx       # HTML shell only: <html><body>{children}</body></html>
│       ├── page.tsx         # Root redirect → /[locale]/ or handled by proxy rewrite
│       └── [locale]/
│           ├── layout.tsx   # NextIntlClientProvider + AdSense layout + setRequestLocale
│           ├── page.tsx     # Homepage placeholder (Phase 1: "coming soon" or empty)
│           └── [tool]/
│               └── page.tsx # Tool page placeholder (Phase 1: empty stub)
├── next.config.ts           # withNextIntl wrapper + reactCompiler: true
└── tsconfig.json            # Unchanged
```

### Pattern 1: next-intl v4 Routing Configuration

**What:** Defines supported locales, default locale, and URL prefix strategy. English gets no prefix; Vietnamese gets `/vi/`.

**When to use:** This is the single source of truth for routing — `proxy.ts`, `navigation.ts`, and all locale-aware layouts reference this.

```typescript
// src/i18n/routing.ts
// Source: https://next-intl.dev/docs/routing/configuration
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'as-needed',
    // English (default) gets no prefix: /
    // Vietnamese gets: /vi/
  }
})
```

### Pattern 2: proxy.ts (Next.js 16 naming)

**What:** Intercepts requests, negotiates locale, rewrites/redirects so the `[locale]` segment is always populated correctly.

**When to use:** Required for locale routing to work. Must be at project root (same level as `src/`).

```typescript
// proxy.ts  (NOT middleware.ts — Next.js 16 breaking change)
// Source: installed node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

Note: The function exported from `proxy.ts` should be a default export (not named `proxy`) when using `createMiddleware` — next-intl's `createMiddleware` returns a function compatible with both named and default export conventions.

### Pattern 3: next.config.ts with withNextIntl wrapper

**What:** Wraps Next.js config with `createNextIntlPlugin` to wire `i18n/request.ts` to the framework.

**Critical:** `reactCompiler: true` must be preserved inside the wrapped config.

```typescript
// next.config.ts
// Source: https://next-intl.dev/docs/getting-started/app-router
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default withNextIntl(nextConfig)
```

### Pattern 4: i18n/request.ts

**What:** Server-side config that loads the right message file per request locale.

```typescript
// src/i18n/request.ts
// Source: https://next-intl.dev/docs/getting-started/app-router
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

### Pattern 5: [locale]/layout.tsx — Static Rendering + Provider

**What:** The locale-aware layout. Must call `setRequestLocale` before any next-intl usage to enable SSG. `generateStaticParams` here is inherited by all child pages.

```typescript
// src/app/[locale]/layout.tsx
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#static-rendering
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // CRITICAL: must be called before any next-intl hooks to enable SSG
  setRequestLocale(locale)

  return (
    <NextIntlClientProvider>
      {/* layout structure goes here */}
      {children}
    </NextIntlClientProvider>
  )
}
```

### Pattern 6: Tool Registry Shape

**What:** Typed registry of all tools. Phase 1 seeds it; later phases use it for navigation and SEO.

```typescript
// src/lib/tools.ts
export interface Tool {
  slug: string            // URL segment: 'case-converter', 'reverse-text', etc.
  i18nKey: string         // Translation key in messages/*.json
  category: string        // Grouping: 'text', 'encoding', 'generator'
  relatedSlugs: string[]  // For related-tools widget (Phase 3)
  isHomepage?: boolean    // true only for case-converter
}

export const tools: Tool[] = [
  { slug: 'case-converter', i18nKey: 'tools.caseConverter', category: 'text', relatedSlugs: ['reverse-text', 'slug-generator'], isHomepage: true },
  { slug: 'reverse-text', i18nKey: 'tools.reverseText', category: 'text', relatedSlugs: ['case-converter', 'slug-generator'] },
  { slug: 'base64-encode-decode', i18nKey: 'tools.base64', category: 'encoding', relatedSlugs: [] },
  { slug: 'slug-generator', i18nKey: 'tools.slugGenerator', category: 'text', relatedSlugs: ['case-converter', 'reverse-text'] },
  { slug: 'password-generator', i18nKey: 'tools.passwordGenerator', category: 'generator', relatedSlugs: [] },
]
```

### Anti-Patterns to Avoid

- **Using `middleware.ts` instead of `proxy.ts`:** Next.js 16 deprecated `middleware.ts`. The file must be `proxy.ts` at project root. The internal function name is still compatible but the file name matters.
- **Forgetting `setRequestLocale`:** Without this call before any `useTranslations` / `getTranslations` / `useLocale` usage, the page falls back to dynamic rendering (reads `headers()`), breaking SSG.
- **Adding `output: 'export'` to next.config.ts:** This disables Proxy execution. Vercel handles SSG natively without it. Confirmed out of scope in requirements.
- **Placing `generateStaticParams` in each child page individually:** Declare it once in `[locale]/layout.tsx`; Next.js propagates it to all pages under that layout.
- **Adding manual `useMemo`/`useCallback` in Client Components:** React Compiler (`reactCompiler: true`) handles memoization automatically. Manual memoization can conflict.
- **Importing from `next-intl/middleware` as named export in proxy.ts:** Use `createMiddleware` as default import. Do not name-export `proxy` when using `createMiddleware` — just default export the result.
- **Nesting `messages/` inside `src/`:** next-intl's default discovery path for `createNextIntlPlugin` expects `messages/` at project root. Placing it inside `src/` requires passing a custom path to `createNextIntlPlugin`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale detection from Accept-Language | Custom header parsing | `createMiddleware` from next-intl | Handles negotiation, cookie persistence, redirects, rewrites correctly |
| Locale-aware Link/useRouter | Manual `href` prefixing | `createNavigation` from next-intl | Handles prefix stripping for default locale automatically |
| Translation loading + type safety | Custom JSON loader | next-intl `getTranslations` / `useTranslations` | Handles server/client split, TypeScript inference, pluralization |
| Static locale params | Manual `generateStaticParams` array | `routing.locales.map(locale => ({ locale }))` | Single source of truth tied to routing config |

**Key insight:** next-intl v4 encapsulates locale routing complexity that is surprisingly hard to get right (cookie vs. Accept-Language negotiation, rewrite vs. redirect semantics, static rendering with dynamic locale). Do not attempt to replicate it.

---

## Common Pitfalls

### Pitfall 1: setRequestLocale Not Called — Dynamic Rendering Sneaks In

**What goes wrong:** Build output shows dynamic pages (`λ`) instead of static (`○`) for localized routes. Vercel may work but pages will SSR on every request.

**Why it happens:** next-intl needs the current locale. Without `setRequestLocale`, it reads `headers()` (an async dynamic API), which triggers dynamic rendering for the entire route.

**How to avoid:** Call `setRequestLocale(locale)` as the very first statement in every layout and page in the `[locale]` segment, before any other code. The call must happen synchronously before `await`.

**Warning signs:** `next build` output shows `λ` symbols next to locale routes. Fix: grep all files under `src/app/[locale]/` for missing `setRequestLocale`.

### Pitfall 2: proxy.ts Misconfiguration Not Caught in Local Dev

**What goes wrong:** Local dev (`next dev`) appears to work for locale routing, but Vercel deployment shows 404s or redirects to the wrong locale.

**Why it happens:** Next.js dev server is more permissive than production. Proxy matcher patterns that look correct locally can fail on Vercel's edge.

**How to avoid:** Deploy to Vercel as the Phase 1 success gate. Verify the preview URL before declaring Phase 1 complete.

**Warning signs:** Local dev works; Vercel deploy shows `/vi/` pages returning 404 or English content.

### Pitfall 3: matcher in proxy.ts Blocks Static Assets

**What goes wrong:** Images, fonts, or CSS fail to load because `proxy.ts` intercepts them.

**Why it happens:** A broad matcher like `'/(.*)'` catches everything including `_next/static`.

**How to avoid:** Use the negative lookahead pattern that excludes `_next`, static files, and metadata files:
```
'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
```

### Pitfall 4: withNextIntl Wrapper Drops reactCompiler

**What goes wrong:** React Compiler stops running silently after `next.config.ts` refactor.

**Why it happens:** Developer replaces the entire config object instead of wrapping it.

**How to avoid:** Keep `reactCompiler: true` inside the `nextConfig` object that is passed to `withNextIntl(nextConfig)`.

### Pitfall 5: Root page.tsx Not Handled

**What goes wrong:** Visiting `/` returns a blank page or 404 because `app/page.tsx` exists outside the `[locale]` segment.

**Why it happens:** With `localePrefix: 'as-needed'`, English pages live at `/` (root), which is served by `app/[locale]/page.tsx` after proxy rewrite — not by `app/page.tsx`. The root `app/page.tsx` must either be deleted or redirect to the `[locale]` tree.

**How to avoid:** In Phase 1, delete or replace `app/page.tsx` with a redirect to `/` (which proxy will rewrite to `[locale=en]`). The `app/[locale]/page.tsx` serves the English homepage.

### Pitfall 6: NextIntlClientProvider Auto-Inherits Messages in v4

**What goes wrong:** Developer manually passes `messages` prop to `NextIntlClientProvider`, causing type errors or double-loading.

**Why it happens:** next-intl v4 changed `NextIntlClientProvider` to automatically inherit messages from server configuration when `createNextIntlPlugin` is used. Manual `messages` prop is no longer needed.

**How to avoid:** Do not pass `messages`, `locale`, or `formats` props to `NextIntlClientProvider` unless explicitly overriding.

---

## Code Examples

Verified patterns from official sources:

### proxy.ts (Next.js 16 — must be at project root)
```typescript
// proxy.ts
// Source: next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

### generateStaticParams in [locale]/layout.tsx
```typescript
// Source: node_modules/next/dist/docs/01-app/02-guides/internationalization.md
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }]
}
// Or equivalently using routing config:
// return routing.locales.map((locale) => ({ locale }))
```

### params access in Next.js 16 layouts (params is a Promise)
```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params   // MUST await — params is a Promise in Next.js 15+/16
  // ...
}
```

### Tailwind v4 CSS — existing globals.css pattern
```css
/* src/app/globals.css — keep and extend */
@import "tailwindcss";   /* v4 syntax — NOT @tailwind base/components/utilities */

@theme inline {
  /* custom tokens go here */
}
```

AdSense placeholder with reserved height (Tailwind v4):
```tsx
{/* Header slot: 90px min-height */}
<div className="min-h-[90px] w-full" aria-hidden="true" data-ad-slot="header" />

{/* Sidebar slot: 250px min-height */}
<div className="min-h-[250px] w-full" aria-hidden="true" data-ad-slot="sidebar" />

{/* Below-tool slot: 90px min-height */}
<div className="min-h-[90px] w-full" aria-hidden="true" data-ad-slot="below-tool" />
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js 16.0.0 | File must be renamed; function export named `proxy` or default export |
| `export default function middleware()` | `export default createMiddleware(routing)` | next-intl v4 convention | Cleaner; handles matcher internally via routing config |
| Manual `messages` prop on `NextIntlClientProvider` | Auto-inherited from server config | next-intl v4 | Fewer props to pass; simpler client provider usage |
| `params` as synchronous prop | `params` as `Promise` (must be awaited) | Next.js 15+ | Breaking: all layouts/pages must `await params` |
| Tailwind `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4 | Single import replaces three directives |
| `export const dynamic = 'force-static'` route segment config | Removed when cacheComponents enabled (not relevant here) | Next.js 16.0.0 | Not needed for this project; SSG via `generateStaticParams` |

**Deprecated/outdated:**
- `middleware.ts`: Deprecated in Next.js 16, renamed to `proxy.ts`. A codemod exists (`npx @next/codemod@canary middleware-to-proxy .`) but since there is no existing middleware file, this is not needed.
- `output: 'export'`: Works but disables Proxy. Incompatible with next-intl's middleware-based routing. Explicitly out of scope per requirements.
- next-sitemap package: Superseded by native `app/sitemap.ts`. Out of scope for Phase 1.

---

## Open Questions

1. **next-intl `createMiddleware` import path in proxy.ts**
   - What we know: Official next-intl docs show `import createMiddleware from 'next-intl/middleware'`
   - What's unclear: Whether v4.8.3 still exports from `next-intl/middleware` or has moved to `next-intl/server` — verify against installed package after `npm install`
   - Recommendation: After installing, run `node -e "require('next-intl/middleware')"` to confirm the import path resolves before writing proxy.ts

2. **Root app/page.tsx deletion vs. redirect**
   - What we know: `app/page.tsx` must not conflict with `[locale]`-based routing. With `as-needed` mode, `/` is served by `app/[locale]/page.tsx` (locale=en via proxy rewrite).
   - What's unclear: Whether Next.js 16 App Router allows both `app/page.tsx` and `app/[locale]/page.tsx` to coexist without conflict when proxy rewrites are in effect.
   - Recommendation: Replace `app/page.tsx` with a simple redirect to `/` (which proxy will pick up) or remove it entirely in favor of `app/[locale]/page.tsx`.

3. **Vercel deployment — zero configuration needed?**
   - What we know: Vercel auto-detects Next.js and runs `next build` + `next start`. No `output: 'export'` is needed or wanted.
   - What's unclear: Whether any `vercel.json` headers config is needed (e.g., caching headers for static assets). No env vars needed per Phase 1 decisions.
   - Recommendation: Deploy without `vercel.json` first. Only add it if deployment shows issues.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no test config files in project |
| Config file | Wave 0 gap — needs creation |
| Quick run command | `npm test` (after setup) |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | `next build` completes with `○` (static) symbols for all locale routes | smoke | `npm run build 2>&1 \| grep -E "○\|λ"` | ❌ Wave 0 |
| INFRA-02 | Layout HTML contains 3 placeholder divs with correct min-height values | manual | Inspect built HTML or run `curl localhost:3000 \| grep data-ad-slot` | ❌ Wave 0 |
| INFRA-03 | Vercel preview URL resolves | manual | Browse preview URL after deploy | N/A — Vercel |
| I18N-01 | `getTranslations` returns messages on server | unit | Verify messages files parse correctly | ❌ Wave 0 |
| I18N-02 | `/` serves English content (no locale prefix) | smoke | `curl http://localhost:3000/ -I` shows 200, no redirect to `/en/` | ❌ Wave 0 |
| I18N-03 | `/vi/` serves Vietnamese content | smoke | `curl http://localhost:3000/vi/ -I` shows 200 | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` (confirms SSG, no TypeScript errors)
- **Per wave merge:** Full build + manual locale routing check in browser
- **Phase gate:** `next build` output shows `○` for all routes + Vercel preview resolves

### Wave 0 Gaps
- [ ] No test framework installed — this phase focuses on infra scaffolding; formal tests deferred
- [ ] Build smoke test: verify `next build` succeeds after each structural task
- [ ] Locale routing smoke test: `npm run dev` then verify `/` and `/vi/` in browser

*(The primary validation for this phase is a successful Vercel deploy with observable locale routing behavior, not automated unit tests.)*

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` — proxy.ts file convention, migration from middleware.ts, export signatures
- `node_modules/next/dist/docs/01-app/02-guides/internationalization.md` — generateStaticParams for locales, lang segment pattern, params usage
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — matcher patterns, negative lookahead, platform support table (Static export = No)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` — params as Promise, LayoutProps helper, root layout constraints
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md` — reactCompiler: true behavior confirmed
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/index.md` — v16 removed dynamic/revalidate/fetchCache from route segment config

### Secondary (MEDIUM confidence)
- https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing — createMiddleware, routing.ts, setRequestLocale, generateStaticParams pattern (fetched 2026-03-19)
- https://next-intl.dev/docs/routing/configuration — localePrefix: `as-needed` mode for default-locale-no-prefix pattern (fetched 2026-03-19)
- https://next-intl.dev/docs/getting-started/app-router — createNextIntlPlugin, withNextIntl wrapper, NextIntlClientProvider auto-inheritance (fetched 2026-03-19)
- https://next-intl.dev/blog/next-intl-4-0 — v4 breaking changes: ESM-only, hasLocale(), session cookies, NextIntlClientProvider auto-inherit (fetched 2026-03-19)
- npm registry: `npm view next-intl version` → 4.8.3 (confirmed 2026-03-19)

### Tertiary (LOW confidence)
- None — all critical claims verified against official sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions confirmed against npm registry; Next.js docs are the installed version
- Architecture: HIGH — patterns sourced directly from installed Next.js 16 docs and next-intl official docs
- Pitfalls: HIGH for setRequestLocale/proxy.ts issues (verified against docs); MEDIUM for Vercel deploy details (no local test possible)
- next-intl import paths: MEDIUM — docs confirm the pattern; exact v4.8.3 import path should be verified post-install

**Research date:** 2026-03-19
**Valid until:** 2026-04-18 (30 days — both Next.js 16 and next-intl v4 are stable releases)
