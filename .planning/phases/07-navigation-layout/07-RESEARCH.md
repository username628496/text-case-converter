# Phase 07: Navigation + Layout - Research

**Researched:** 2026-03-21
**Domain:** Next.js 16 App Router layout components, i18n navigation patterns, component composition
**Confidence:** HIGH

## Summary

Phase 07 requires three distinct deliverables: (1) adding a Footer component to the locale layout with i18n translations, (2) converting the sidebar ad placeholder into grouped tool navigation links, and (3) ensuring all 5 tool pages use an identical layout structure through a shared ToolPageLayout component.

The codebase already establishes clear patterns: locale-aware href construction (with locale prefix), SSG-compatible component composition (Server Components for layout, Client Components for interactive content), and i18n via next-intl v4 with raw() extraction for arrays. The main work is creating new components (Footer, ToolPageLayout, SidebarNav) that follow existing conventions and adding translations to messages files.

**Primary recommendation:** Create Footer as a Server Component (receives locale + translations as props), export SidebarNav as a Server Component to be rendered after the ad slot in layout.tsx, and refactor individual tool page renders into a ToolPageLayout wrapper that enforces consistent spacing and section ordering.

## Standard Stack

### Core (Confirmed in Codebase)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.0 | App Router framework (SSG, dynamic routing, metadata) | Locked in project constraints |
| React | 19.2.4 | UI library; Server Components by default in App Router | Locked in project constraints |
| TypeScript | 5 | Type safety; all components typed | Locked in project constraints |
| next-intl | 4.8.3 | i18n routing + translation helpers (getTranslations, useTranslations) | Locked in project constraints; locale namespace extraction via t.raw() |
| Tailwind CSS | 4.x | Utility-first styling; arbitrary values (text-[15px], rounded-[4px]) | Locked in project constraints |
| Lucide React | 0.577.0 | Icon library (HelpCircle, Menu, etc.) | Already in use for nav/FAQ |

### Radix UI (for interactive primitives)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-dropdown-menu | 2.1.16 | Desktop menu for locale switcher | Already used in SiteNav |
| @radix-ui/react-sheet | Latest | Mobile drawer for responsive nav | Already used in SiteNav mobile menu |
| @radix-ui/react-separator | 1.1.8 | Visual dividers in footer (optional) | Available if needed |

### No Additional Dependencies Needed

The project has all required libraries. Do NOT introduce new npm packages for this phase:
- No third-party footer libraries (build custom)
- No new layout wrapper packages (use React composition)
- No additional icon sets (use Lucide React icons already available)

**Installation:** No new packages. Verify existing versions:
```bash
npm list next next-intl react tailwindcss
```

Current verified versions from package.json:
- next: 16.2.0
- next-intl: 4.8.3
- react: 19.2.4
- tailwindcss: 4

## Architecture Patterns

### Recommended Component Structure

```
src/components/
├── footer.tsx                 # Footer Server Component (receives locale + tFooter)
├── sidebar-nav.tsx           # SidebarNav Server Component (receives locale + translations)
├── tool-page-layout.tsx      # ToolPageLayout Client wrapper (enforces section ordering)
└── [existing tool components]

src/app/[locale]/layout.tsx   # Modified to add Footer + SidebarNav
src/app/[locale]/[tool]/page.tsx  # Modified to wrap content in ToolPageLayout
```

### Pattern 1: Server Components for Layout Regions

**What:** Locale layout regions (header, sidebar, footer) are Server Components that receive locale + translations as props. They compute hrefs and i18n strings server-side, not client-side.

**When to use:** Any component that needs locale awareness (href construction, i18n lookup) and doesn't require user interaction. Reduces hydration mismatch risks.

**Example:**

```typescript
// src/components/footer.tsx
import { getTranslations } from 'next-intl/server'

interface FooterProps {
  locale: string
}

export async function Footer({ locale }: FooterProps) {
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t border-[var(--color-border-brand)] bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 3-column grid on desktop, single column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-[var(--color-navy)] dark:text-zinc-100">
              {tFooter('copyright')}
            </h3>
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {tFooter('tagline')}
            </p>
          </div>
          <div>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[var(--color-navy)] dark:text-zinc-200 hover:underline">{tFooter('privacy')}</a></li>
              <li><a href="#" className="text-[var(--color-navy)] dark:text-zinc-200 hover:underline">{tFooter('terms')}</a></li>
              <li><a href="#" className="text-[var(--color-navy)] dark:text-zinc-200 hover:underline">{tFooter('sitemap')}</a></li>
              <li><a href="#" className="text-[var(--color-navy)] dark:text-zinc-200 hover:underline">{tFooter('contact')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-[var(--color-border-brand)] pt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {tFooter('madeWith', { year: currentYear })}
        </div>
      </div>
    </footer>
  )
}
```

Source: Next.js 16 App Router Server Components pattern; established in codebase via SiteNav integration

### Pattern 2: Locale-Aware Sidebar Navigation

**What:** Below the sidebar ad slot, render grouped tool navigation. Each group (Text Tools, Code & Data, etc.) contains links to 5 tools. Active page link styled with navy + mint tint. Mobile version integrated into Sheet drawer.

**When to use:** Secondary navigation that needs locale prefixing and active state styling. Server Component to compute hrefs, but active styling can be Client Component wrapper if needed.

**Example (Server Component):**

```typescript
// src/components/sidebar-nav.tsx
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { tools } from '@/lib/tools'
import { getTranslations } from 'next-intl/server'

interface SidebarNavProps {
  locale: string
  currentTool?: string // e.g., 'reverse-text' — optional, for active styling
}

const TOOL_GROUPS = {
  textTools: ['case-converter', 'reverse-text'],
  codeData: ['base64-encode-decode', 'slug-generator'],
  randomGenerators: ['password-generator'],
}

export async function SidebarNav({ locale, currentTool }: SidebarNavProps) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <nav className="space-y-6">
      {Object.entries(TOOL_GROUPS).map(([groupKey, toolSlugs]) => (
        <div key={groupKey}>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {tNav(groupKey)}
          </h3>
          <ul className="space-y-1">
            {toolSlugs.map(slug => {
              const href = locale === 'en'
                ? `/${slug}/`
                : `/vi/${slug}/`
              const isActive = currentTool === slug
              return (
                <li key={slug}>
                  <Link
                    href={href}
                    className={`block px-2 py-1.5 rounded-[4px] text-sm transition-colors ${
                      isActive
                        ? 'bg-[var(--color-navy)] text-white'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-[var(--color-mint)] dark:hover:bg-zinc-800'
                    }`}
                  >
                    {/* Get tool name from tools array */}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
```

Source: Established sidebar structure in layout.tsx; navigation pattern in SiteNav component

### Pattern 3: ToolPageLayout Wrapper Component

**What:** A Client Component wrapper that enforces consistent section ordering and spacing across all 5 tool pages. Receives `children` (ToolComponent output) and renders:
1. Tool area (ToolComponent)
2. Below-tool content region (ad slot)
3. FAQ section
4. Related tools section

**When to use:** When multiple pages share identical layout structure but differ only in content. Client Component here because section padding/spacing may vary by viewport, and React Compiler handles memoization.

**Example:**

```typescript
// src/components/tool-page-layout.tsx
'use client'

interface ToolPageLayoutProps {
  children: React.ReactNode
  faqSection: React.ReactNode
  relatedTools: React.ReactNode
  adSlot: React.ReactNode
}

export function ToolPageLayout({
  children,
  faqSection,
  relatedTools,
  adSlot,
}: ToolPageLayoutProps) {
  return (
    <div>
      {/* 1. Tool area */}
      <section className="mb-6">
        {children}
      </section>

      {/* 2. Below-tool ad slot */}
      <section className="my-6">
        {adSlot}
      </section>

      {/* 3. FAQ */}
      <section className="my-10">
        {faqSection}
      </section>

      {/* 4. Related tools */}
      <section className="my-8">
        {relatedTools}
      </section>
    </div>
  )
}
```

Then in `[tool]/page.tsx`:

```typescript
return (
  <ToolPageLayout
    adSlot={adSlot}
    faqSection={<FAQSection... />}
    relatedTools={<RelatedTools... />}
  >
    <ToolComponent />
  </ToolPageLayout>
)
```

Alternative (simpler): Keep tool pages as-is and just document spacing in shared CSS classes.

### Anti-Patterns to Avoid

- **Hardcoding href locale prefix**: Always use locale variable from params/props, never hardcode "/vi/" or "/" — breaks i18n routing
- **Forgetting dark mode support**: Footer and nav must have dark: variants (already established pattern in SiteNav)
- **Client-only nav construction**: Never useParams() to build hrefs in nav unless wrapped in useTransition() — causes hydration mismatches. Use Server Components instead.
- **Tool link naming inconsistency**: If sidebar nav shows tool names, fetch them from the same i18n namespace as tool cards to avoid duplication

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Site footer layout | Custom multi-column grid | Tailwind grid-cols-* utilities | Already established, standard, responsive built-in |
| Dark mode footer | Manual dark: CSS classes | Tailwind dark: prefix (already used in SiteNav) | Consistent with codebase convention |
| Tool links with active state | Manual className conditionals | Use className with ternary or clsx (already in codebase) | Next.js usePathname() + substring matching is error-prone; Server Component href checking is cleaner |
| i18n footer text | Manual fallback strings | next-intl getTranslations() | Already required for locale safety; fallbacks handled by next-intl |
| Sidebar scroll/overflow | Custom scroll wrapper | Existing ScrollArea (already imported in tool-page.tsx) | Avoid component bloat; sidebar is small and fits |

**Key insight:** This phase is primarily composition + i18n + minor styling. Avoid custom components; use existing patterns (Server Components, Tailwind, next-intl) that the project has already validated.

## Common Pitfalls

### Pitfall 1: Forgetting to Pass Locale to Footer

**What goes wrong:** Footer is rendered in layout.tsx without locale prop, so getTranslations() fails or defaults to English on VI pages.

**Why it happens:** Easy to miss that Server Components need explicit locale prop; it's not automatically inherited from params.

**How to avoid:** In layout.tsx, always pass `locale={locale}` to Footer and SidebarNav. Make TypeScript enforce this with `FooterProps` interface requiring locale field.

**Warning signs:** Footer translations always English regardless of page locale; VI page shows English copyright/links.

### Pitfall 2: Active Nav Link Styling Breaks on Pagination

**What goes wrong:** Sidebar nav shows active styling based on `currentTool` param, but on tool pages the active state is computed incorrectly or updates don't reflect on back/forward navigation.

**Why it happens:** If active styling logic depends on usePathname() in a Client Component, it may not re-render on hydration mismatch, or pathname may include locale prefix unexpectedly.

**How to avoid:** Either (a) pass `currentTool` as a Server Component prop and avoid usePathname() logic entirely, or (b) if Client Component, use usePathname() but strip locale prefix first: `const pathWithoutLocale = pathname.replace(/^\/(vi\/)?/, '')`.

**Warning signs:** Sidebar active state doesn't match current page; active styling persists after navigation.

### Pitfall 3: Footer Link hrefs Hardcoded

**What goes wrong:** Footer has links like `href="/privacy/"` (English) and "/privacy/" (VI), breaking locale-aware routing.

**Why it happens:** Easy to hardcode footer nav without locale prefix; "Contact", "Privacy" are static content.

**How to avoid:** For footer links to other pages on the site (if any), ALWAYS include locale prefix in Server Component: `href={locale === 'en' ? '/privacy/' : '/vi/privacy/'}`. For external links (Privacy Policy, etc.) that go off-site, no prefix needed.

**Warning signs:** Footer links on /vi/ pages redirect to English version.

### Pitfall 4: Sidebar Ad Slot Removed Accidentally

**What goes wrong:** Replacing the sidebar ad placeholder div with SidebarNav without preserving the ad slot results in losing ad space layout.

**Why it happens:** Ad slot is in layout.tsx below SidebarNav; easy to reorder components and forget the DOM structure.

**How to avoid:** Add SidebarNav AFTER the ad slot in layout.tsx, not replacing it:
```
<aside>
  <div data-ad-slot="sidebar">Ad Placeholder</div>
  <SidebarNav locale={locale} currentTool={currentTool} />
</aside>
```

**Warning signs:** Sidebar no longer has reserved space for ads; sidebar nav text wraps into ad area.

### Pitfall 5: ToolPageLayout Wrapper Breaks Section Margins

**What goes wrong:** Adding ToolPageLayout wrapper with hardcoded `mt-10` margins causes double-spacing or collapsed margins because ToolComponent already has its own margins.

**Why it happens:** Margin collapsing in CSS (adjacent margins merge); not accounting for existing margins in ToolComponent (h1, p, Card all have margins).

**How to avoid:** Use `gap` in flex/grid instead of margins, or use negative margin override. Safer: have ToolPageLayout use only `space-y-*` utility on a flex column, which respects margin collapse. Example:
```tsx
<div className="flex flex-col space-y-6">
  {children}  {/* ToolComponent with internal margins */}
  <section>{faqSection}</section>
</div>
```

**Warning signs:** First section has extra space above it; FAQ section is too close to tool area.

## Code Examples

Verified patterns from existing codebase:

### Locale-Aware Link in Server Component

```typescript
// Source: src/components/tool-cards.tsx (RelatedTools)
const href = tool.isHomepage
  ? locale === 'en' ? '/' : '/vi/'
  : locale === 'en' ? `/${tool.slug}/` : `/vi/${tool.slug}/`

// Applied to SidebarNav:
const href = locale === 'en'
  ? `/${slug}/`
  : `/vi/${slug}/`
```

### Server Component with i18n Props

```typescript
// Source: src/app/[locale]/layout.tsx
const tNav = await getTranslations({ locale, namespace: 'nav' })

// In component:
<SiteNav
  locale={locale}
  siteName={t('siteName')}
  translations={{
    textTools: tNav('textTools'),
    codeData: tNav('codeData'),
    // ... etc
  }}
/>
```

### Dark Mode Styling Pattern

```typescript
// Source: src/components/site-nav.tsx
className="bg-white dark:bg-zinc-950 border-b border-[var(--color-border-brand)]"
className="text-[var(--color-navy)] dark:text-zinc-100"
```

Applied to footer:
```tsx
<footer className="bg-white dark:bg-zinc-950 border-t border-[var(--color-border-brand)]">
```

### CSS Variables for Brand Colors

```typescript
// Source: Project established in Phase 5
// Tailwind arbitrary value for exact navy and mint
className="text-[var(--color-navy)]"  // #1a2744
className="bg-[var(--color-mint)]"    // #e8f5f2
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate footer/nav components (Phase 4 launch) | Integrated Footer + SidebarNav as Server Components (Phase 7) | Phase 07 start | Footer and nav have consistent locale awareness + dark mode support |
| Ad slot as static div comment | Ad slot as preserved `<div data-ad-slot="sidebar">` in layout | Phase 1+ | Allows sidebar nav to coexist with ad space without conflict |
| Tool page variations (different layouts per tool) | Unified ToolPageLayout (Phase 7) | Phase 07 start | Ensures consistent visual hierarchy and spacing across all 5 tools |

**Deprecated/outdated:**
- Inline margin styling for spacing — use Tailwind space-y-* utilities instead (established in existing components)
- Hardcoded "Coming soon" in mobile nav — replace with actual SidebarNav groups (Phase 7)

## Open Questions

1. **Should SidebarNav be visible on mobile?**
   - What we know: SiteNav has mobile Sheet drawer that currently shows "Coming soon" placeholders
   - What's unclear: Should mobile drawer hide the sidebar tool links entirely, or show them in a separate section?
   - Recommendation: Add tool groups to Sheet drawer below existing category headers, matching desktop sidebar structure. Use same SidebarNav Server Component (or extract shared TOOL_GROUPS constant).

2. **What are the "4 placeholder links" in footer?**
   - What we know: REQUIREMENTS.md mentions "Privacy Policy · Terms of Service · Sitemap · Contact"
   - What's unclear: Do these links go to real pages (not yet built) or external URLs?
   - Recommendation: href="#" for now (placeholder); when pages are created (future phase), update hrefs. Don't build fake pages in Phase 7.

3. **Should tool names in sidebar nav be fetched from i18n or hardcoded?**
   - What we know: Tool display names exist in messages/en.json and messages/vi.json under "tools" namespace
   - What's unclear: Should SidebarNav fetch these dynamically or use a constant TOOL_DISPLAY mapping (like tool-cards.tsx)?
   - Recommendation: Use existing tools array + tTools lookup (same pattern as RelatedTools). Avoids duplication, ensures consistency.

4. **Is ToolPageLayout necessary or can we document spacing in shared CSS?**
   - What we know: All 5 tool pages currently render content directly in [tool]/page.tsx without wrapper
   - What's unclear: Does phase requirement LAYOUT-01 mandate a React component wrapper, or just consistent styling/spacing?
   - Recommendation: Create ToolPageLayout as a wrapper component (enforces structure via React, not just docs). Easier for future tools to add in phases 8+.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest v4.1.0 (configured in package.json, no config file detected) |
| Config file | None — using Vitest defaults |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Footer renders on every page with copyright, tagline, 4 links, and bottom strip | e2e / integration | Manual (visual inspection on built page) | ❌ Wave 0 |
| NAV-02 | Footer dark mode styling applied correctly (dark:bg-zinc-950, dark:border-zinc-800) | visual / integration | Manual (visual on dark mode page) | ❌ Wave 0 |
| NAV-02 | Footer translations exist in en.json and vi.json with Vietnamese diacritics | unit / i18n | `npm run build` (SSG validates all strings) | ❌ Wave 0 |
| NAV-03 | Sidebar renders tool nav groups with locale-prefixed URLs | unit / component | Manual (visual on page) | ❌ Wave 0 |
| NAV-03 | Active page link styled with navy + mint tint | visual / component | Manual (visual on tool page) | ❌ Wave 0 |
| NAV-04 | Tool links accessible in mobile Sheet drawer | a11y / integration | Manual (test on mobile viewport, open menu) | ❌ Wave 0 |
| LAYOUT-01 | All 5 tool pages share identical ToolPageLayout structure | structural / snapshot | Manual (compare HTML structure of 5 pages) | ❌ Wave 0 |
| LAYOUT-01 | Tool area → below-tool → FAQ → related tools section order enforced | structural / integration | Manual (visual inspection) | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** Manual visual inspection (build page in dev, inspect layout/styling)
- **Per wave merge:** Build test (`npm run build`) — validates SSG generation and i18n compilation with no errors
- **Phase gate:** Full site build succeeds + visual verification of footer/nav on all 5 tool pages + mobile viewport test for drawer

### Wave 0 Gaps
- [ ] `tests/components/footer.test.tsx` — unit test for Footer component rendering + i18n props
- [ ] `tests/components/sidebar-nav.test.tsx` — unit test for SidebarNav locale-aware href construction
- [ ] `tests/components/tool-page-layout.test.tsx` — unit test for ToolPageLayout section ordering
- [ ] `tests/e2e/footer.spec.ts` — e2e test using Playwright or similar (not yet added; deferred beyond v1.1)
- [ ] `vitest.config.ts` — explicit Vitest config file (currently relying on package.json "test" script with defaults)
- [ ] Framework install: Vitest already in package.json; no additional setup needed

**Note:** No test files needed for Phase 7 delivery. SSG build validation (next build) is the primary verification mechanism for this phase. Visual/manual testing covers requirements adequately until e2e infrastructure is added in a later phase.

## Sources

### Primary (HIGH confidence)

- **Next.js 16 App Router** — Server Components, generateMetadata, SSG patterns established in existing code (layout.tsx, [tool]/page.tsx)
- **next-intl v4.8.3** — getTranslations() server-side, useTranslations() client-side, t.raw() for arrays — validated in current codebase
- **Radix UI + shadcn/ui** — Existing components (Button, Card, Sheet, Accordion) demonstrate composition patterns used
- **Tailwind CSS v4** — Arbitrary values (text-[15px], rounded-[4px]), dark: prefix, space-y-* utilities — established in Phase 5

### Secondary (MEDIUM confidence)

- **SiteNav component** — Existing implementation shows locale-aware link construction, dark mode support, mobile Sheet drawer pattern
- **tool-page.tsx and [tool]/page.tsx** — Current structure shows section ordering (tool area → FAQ → related tools); ToolPageLayout should follow this
- **tool-cards.tsx (RelatedTools)** — Shows how to map tool slugs to links with locale prefix and fetch tool metadata from i18n

### Tertiary (LOW confidence)

None — all findings verified against existing codebase patterns.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All libraries confirmed in package.json with versions
- Architecture patterns: HIGH — Established via SiteNav, tool-page.tsx, existing Server Components
- Pitfalls: HIGH — Based on common Next.js + i18n mistakes observed in similar projects
- Open questions: MEDIUM — Some details about mobile sidebar and footer link destinations not explicitly documented in REQUIREMENTS.md

**Research date:** 2026-03-21
**Valid until:** 2026-03-28 (Next.js 16 stable; next-intl v4.8.3 stable; patterns unlikely to change within 1 week)

**Key assumptions:**
- Footer links are placeholders (href="#") — real implementation deferred
- SidebarNav reuses existing tool groups from tool-cards.tsx
- No new npm packages introduced in this phase
- ToolPageLayout is a composition wrapper, not a layout.tsx-level component
