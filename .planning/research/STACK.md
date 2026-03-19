# Stack Research

**Domain:** Multilingual text utility webapp (EN/VI), SEO-optimized, AdSense-ready
**Researched:** 2026-03-19
**Confidence:** HIGH (verified against node_modules/next/dist/docs/ and official sources)

---

## CRITICAL: Version Reality Check

The project context references "Next.js 14 App Router" — **this is wrong**. The installed scaffold is Next.js **16.2.0** with React 19.2.4. Multiple APIs differ from Next.js 14. All recommendations below are verified against the actual docs at `node_modules/next/dist/docs/`.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.0 (installed) | App framework, routing, SSG, metadata | Already installed. App Router with `generateStaticParams()` + Server Components delivers SSG for all tool pages with zero runtime server needed on Vercel. |
| React | 19.2.4 (installed) | UI rendering | Ships with Next.js 16. React 19 Compiler support is already enabled in next.config.ts. |
| TypeScript | ^5 (installed) | Type safety | Already configured. Use `PageProps<'/[locale]/[slug]'>` helper for strongly-typed route params — new in Next.js 16. |
| Tailwind CSS | ^4 (installed) | Styling, dark mode | Already installed with `@tailwindcss/postcss`. v4 is CSS-first — no `tailwind.config.js`. Dark mode configured in `globals.css` via `@custom-variant`. |

### i18n

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| next-intl | ^4.8.3 | EN/VI routing, translations, Server Component hooks | The only i18n library with full App Router + SSG support. `getTranslations()` runs server-side: zero i18n JS in client bundle. Recommended in Next.js 16 official docs. Version 4.x required — v3 API differs significantly. |

**next-intl setup note:** Next.js 16 renamed `middleware.ts` → `proxy.ts` and `middleware()` export → `proxy()`. next-intl 4.x supports this. Create `src/proxy.ts` (not `src/middleware.ts`) exporting `createMiddleware(routing)` as `proxy`.

### SEO & Structured Data

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| schema-dts | ^1.1.5 | TypeScript types for JSON-LD | Provides `SoftwareApplication`, `HowTo`, `WithContext<T>` types. Official recommendation from Next.js JSON-LD docs. Catches malformed structured data at compile time rather than at Google Search Console. |

**sitemap note:** Do NOT install `next-sitemap`. Next.js 16 has a built-in `app/sitemap.ts` file convention with native `alternates.languages` support for hreflang in sitemaps. It generates XML with `xhtml:link` hreflang entries natively. The external package is now redundant.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| server-only | latest | Prevent server modules from leaking to client | Wrap dictionary loader (`getDictionary`) with `import 'server-only'` to get a build error if accidentally imported in a Client Component. |
| clsx | ^2.x | Conditional className composition | When building tool UI components with state-dependent styles (active tab, toggle states). Tiny, tree-shaken. |
| next-themes | ^0.4.x | User-controlled dark/light toggle | Only needed if implementing a manual dark mode toggle button. If OS preference is sufficient, use the default Tailwind v4 `prefers-color-scheme` behavior — no package needed. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint + eslint-config-next | Linting | Already installed at 16.2.0. Catches App Router anti-patterns (e.g., `searchParams` in root layout). |
| babel-plugin-react-compiler | React Compiler | Already installed (1.0.0). `reactCompiler: true` is set in `next.config.ts`. Automatically memoizes components — do not add manual `useMemo`/`useCallback` to Client Components. |
| TypeScript strict mode | Type checking | Ensure `"strict": true` in tsconfig. `PageProps` and `LayoutProps` generics require it. |

---

## Installation

```bash
# i18n
npm install next-intl

# Structured data types
npm install schema-dts

# Conditional classes (when building components)
npm install clsx

# Server-only guard
npm install server-only

# Dark mode toggle (only if adding a manual theme switcher)
npm install next-themes
```

No additional core dependencies needed. Next.js 16 covers: sitemap, robots.txt, metadata/og, JSON-LD patterns, SSG, i18n routing patterns.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| next-intl | next-i18next | Never for App Router — next-i18next is Pages Router only and unmaintained for App Router. |
| next-intl | Built-in Next.js i18n (getDictionary pattern) | Only for ultra-minimal projects with 2-3 strings. next-intl adds locale validation, navigation helpers, plural rules, and ICU format support that you will need for full UI translation. |
| Built-in `app/sitemap.ts` | next-sitemap | If you need robots.txt customization beyond `app/robots.ts`, next-sitemap can generate it. But for this project, `app/robots.ts` file convention handles it natively. |
| Tailwind CSS v4 | Tailwind CSS v3 | Never downgrade — v4 is installed and the `@import "tailwindcss"` CSS-first approach is already configured. v3 config patterns (darkMode: 'class' in JS config) do not apply. |
| schema-dts | Plain object literals | Acceptable for simple use cases, but schema-dts catches type errors (e.g., wrong `@type` values) at build time rather than in Google's indexing queue. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `next-sitemap` | Redundant with Next.js 16 built-in `app/sitemap.ts`. Adding it creates two sitemap systems and a post-build script that complicates Vercel deployments. | `app/sitemap.ts` with `MetadataRoute.Sitemap` type + `alternates.languages` for hreflang |
| `src/middleware.ts` | Deprecated in Next.js 16 — it still works but produces deprecation warnings in Vercel console. next-intl proxy will not be recognized correctly. | `src/proxy.ts` exporting a function named `proxy` |
| `react-helmet` / `next-head` | Both are Pages Router patterns. App Router uses the `metadata` export or `generateMetadata()` function in `layout.tsx` / `page.tsx`. | `export const metadata: Metadata` or `export async function generateMetadata()` |
| `i18n` config in `next.config.ts` | The `i18n` config key is Pages Router only. App Router i18n is handled via the `[locale]` dynamic segment + next-intl proxy routing. Setting it causes conflicts. | `app/[locale]/` directory structure + `src/proxy.ts` with `createMiddleware(routing)` |
| `useRouter().locale` | Pages Router API — does not exist in App Router. | `useLocale()` from `next-intl/client` or read from route params |
| `getStaticPaths` | Pages Router API. | `generateStaticParams()` in App Router |
| Manual `useMemo`/`useCallback` in Client Components | React Compiler (already enabled) does this automatically. Manual memoization interferes with the compiler's analysis. | Let the compiler handle it; only memoize in Server Components where the compiler does not run. |

---

## Stack Patterns by Variant

**For tool pages that need static generation (all tool pages):**
- Use `generateStaticParams()` in `app/[locale]/[tool]/page.tsx` returning `[{ locale: 'en' }, { locale: 'vi' }]`
- Call `setRequestLocale(locale)` as the first line in the page component (next-intl requirement for static rendering)
- Export `generateMetadata()` returning locale-aware `title`, `description`, `alternates.canonical`, `alternates.languages`

**For dark mode:**
- Default (no user toggle): The scaffold's `globals.css` already uses `@media (prefers-color-scheme: dark)` CSS variables. Tailwind `dark:` utilities work via OS preference out of the box.
- With user toggle: Add `@custom-variant dark (&:where(.dark, .dark *));` to `globals.css`, install `next-themes`, wrap layout in `<ThemeProvider attribute="class">`.

**For JSON-LD on tool pages:**
- Render inline in page component as a native `<script type="application/ld+json">` tag (not `next/script`)
- Use `schema-dts` types: `WithContext<SoftwareApplication>` for tool pages, embed `HowTo` as a nested property
- Sanitize: `JSON.stringify(jsonLd).replace(/</g, '\\u003c')` to prevent XSS

**For hreflang:**
- Add to `generateMetadata()`: `alternates: { canonical: 'https://example.com/tool-slug', languages: { vi: 'https://example.com/vi/tool-slug' } }`
- Next.js 16 renders this as `<link rel="alternate" hreflang="vi" href="...">` automatically
- Also include in `app/sitemap.ts` via `alternates.languages` per URL entry

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next-intl ^4.x | Next.js 16.x | Requires `proxy.ts` (not `middleware.ts`). v4.0+ changed `NextIntlClientProvider` wrapping requirements — wrap root layout, not individual pages. |
| next-intl ^3.x | Next.js 14/15 | Do NOT use v3 — it expects `middleware.ts` and older `getRequestConfig` API. |
| tailwindcss ^4 | @tailwindcss/postcss ^4 | Both are installed. No `tailwind.config.js` needed or supported for core config. Dark mode variant must be defined in CSS, not JS. |
| babel-plugin-react-compiler 1.0.0 | React 19.x | Already installed. Works with `reactCompiler: true` in next.config.ts. |
| schema-dts ^1.1.5 | TypeScript ^5 | Dev-only type dependency. No runtime cost. |

---

## Sources

- `node_modules/next/dist/docs/01-app/02-guides/internationalization.md` — Next.js 16 i18n patterns, `proxy.ts` file convention, `generateStaticParams` for locales (HIGH confidence — authoritative)
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md` — JSON-LD native pattern, schema-dts recommendation (HIGH confidence — authoritative)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` — Built-in sitemap with `alternates.languages` hreflang support (HIGH confidence — authoritative)
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` — `generateMetadata()` API, `alternates.canonical` and `alternates.languages` (HIGH confidence — authoritative)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — `middleware.ts` deprecated, renamed to `proxy.ts` (HIGH confidence — authoritative)
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md` — React Compiler already enabled in scaffold (HIGH confidence — authoritative)
- [next-intl routing setup](https://next-intl.dev/docs/routing/setup) — v4.x proxy.ts pattern for Next.js 16 (HIGH confidence — official docs)
- [Tailwind CSS v4 dark mode](https://tailwindcss.com/docs/dark-mode) — CSS-first `@custom-variant` dark mode configuration (HIGH confidence — official docs)
- WebSearch: next-intl 4.8.3 is current version; next-sitemap confirmed redundant with Next.js App Router (MEDIUM confidence — search results consistent with official docs)

---

*Stack research for: Multilingual text utility webapp (EN/VI)*
*Researched: 2026-03-19*
