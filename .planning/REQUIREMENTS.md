# Requirements: Text Case Converter

**Defined:** 2026-03-19
**Core Value:** Fast, accurate text tools on SEO-optimized pages that rank for both English and Vietnamese search queries

## v1 Requirements

### Core Tool — Case Converter

- [ ] **CORE-01**: User can convert text using 7 case modes (Sentence, lower, UPPER, Capitalized, Alternating, Title, Inverse) via tab switching in a single textarea
- [ ] **CORE-02**: Conversion happens instantly on mode-select or keystroke — no submit button required
- [ ] **CORE-03**: User can copy converted text to clipboard with visual "Copied!" confirmation (~1.5s state)
- [ ] **CORE-04**: User sees live character and word count updating in real-time as text changes
- [ ] **CORE-05**: User can clear the textarea with a single button click
- [ ] **CORE-06**: User sees related tools navigation links below each tool to reduce bounce
- [ ] **CORE-07**: Each tool page displays FAQ and how-to content below the tool (required for JSON-LD HowTo schema validity)
- [ ] **CORE-08**: UI supports dark mode via OS preference (Tailwind CSS v4 @media prefers-color-scheme)

### Sub-Tools

- [ ] **TOOL-01**: User can reverse any text string at /reverse-text/ (EN) and /vi/reverse-text/ (VI)
- [ ] **TOOL-02**: User can encode and decode Base64 strings at /base64-encode-decode/ (EN) and /vi/base64-encode-decode/ (VI)
- [ ] **TOOL-03**: User can generate URL-friendly slugs from text at /slug-generator/ (EN) and /vi/slug-generator/ (VI)
- [ ] **TOOL-04**: User can generate secure random passwords at /password-generator/ (EN) and /vi/password-generator/ (VI)
- [ ] **TOOL-05**: All sub-tools have the same UX as the core tool: instant conversion, copy, char/word count, clear, FAQ content, related tools

### Internationalization

- [x] **I18N-01**: All tool content is fully translated EN/VI via next-intl: tool names, descriptions, placeholder text, how-to copy, UI chrome, FAQ content
- [x] **I18N-02**: English pages use clean URLs without locale prefix: /[tool-slug]/
- [x] **I18N-03**: Vietnamese pages use /vi/[tool-slug]/ prefix
- [ ] **I18N-04**: All pages include bidirectional hreflang EN ↔ VI (both locales reference each other)

### SEO

- [ ] **SEO-01**: Every tool page generates dynamic metadata via generateMetadata(): title, description, canonical URL, og:image — unique per locale
- [ ] **SEO-02**: Every tool page includes JSON-LD structured data: SoftwareApplication + HowTo schema
- [ ] **SEO-03**: Site generates an auto-updated sitemap via native app/sitemap.ts with hreflang alternates.languages entries per tool URL
- [ ] **SEO-04**: Site has robots.ts with correct crawl directives

### Infrastructure

- [ ] **INFRA-01**: All pages are statically generated (SSG) via generateStaticParams — no server runtime required
- [ ] **INFRA-02**: Root layout includes AdSense placeholder divs at 3 placements (header, sidebar, below-tool) with reserved CSS min-height (90px/250px/90px) — no live ads
- [ ] **INFRA-03**: App deploys to Vercel via GitHub push to main — no output: 'export' (incompatible with next-intl proxy routing)

## v2 Requirements

### Extended Tool Catalog

- **TOOL-V2-01**: Text Tools: Upside Down Text, Strikethrough, Bold/Italic/Underline Unicode, Wide Text, Mirror Text, Small Text, Morse Code, Binary Translator, Zalgo Text
- **TOOL-V2-02**: Text Tools: Remove Line Breaks, Remove Whitespace, Word Frequency Counter, Sort Words, Repeat Text, Plain Text Converter
- **TOOL-V2-03**: Code & Data: URL Encode/Decode, JSON Formatter, HTML Formatter, MD5, ROT13, Caesar Cipher, CSV to JSON
- **TOOL-V2-04**: Font Styles: Bold, Italic, Strikethrough, Unicode Text, Small Caps, Superscript
- **TOOL-V2-05**: Random: UUID Generator, Random Number, Random Letter

### UX Enhancements

- **UX-V2-01**: User can download converted text as .txt file
- **UX-V2-02**: User can undo / restore original text

### Monetization

- **MON-V2-01**: AdSense slots activated with live ad code (post-approval)

## Out of Scope

| Feature | Reason |
|---------|--------|
| next-sitemap package | Superseded by native Next.js 16 app/sitemap.ts with alternates.languages; external package creates competing sitemaps |
| output: 'export' static build | Incompatible with next-intl proxy routing on Vercel; Vercel handles SSG natively |
| User accounts / saved history | Stateless tools only — no backend in v1 |
| Real-time collaboration | Single-user, client-side only |
| Native mobile app | Web-first; PWA deferred to v2+ |
| Tool APIs / programmatic access | UI only for v1 |
| AdSense activation | Requires traffic threshold and AdSense approval; out of v1 scope |
| PWA manifest | Defer until web traffic established |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| I18N-01 | Phase 1 | Complete |
| I18N-02 | Phase 1 | Complete |
| I18N-03 | Phase 1 | Complete |
| CORE-01 | Phase 2 | Pending |
| CORE-02 | Phase 2 | Pending |
| CORE-03 | Phase 2 | Pending |
| CORE-04 | Phase 2 | Pending |
| CORE-05 | Phase 2 | Pending |
| CORE-06 | Phase 2 | Pending |
| CORE-07 | Phase 2 | Pending |
| CORE-08 | Phase 2 | Pending |
| SEO-01 | Phase 2 | Pending |
| SEO-02 | Phase 2 | Pending |
| I18N-04 | Phase 2 | Pending |
| SEO-03 | Phase 3 | Pending |
| SEO-04 | Phase 3 | Pending |
| TOOL-01 | Phase 3 | Pending |
| TOOL-02 | Phase 3 | Pending |
| TOOL-03 | Phase 3 | Pending |
| TOOL-04 | Phase 3 | Pending |
| TOOL-05 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓
- Note: Phase 4 (Launch Readiness) is a verification phase with no new feature requirements

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 after roadmap creation*
