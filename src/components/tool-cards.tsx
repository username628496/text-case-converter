import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { tools } from '@/lib/tools'

const TOOL_DISPLAY: Record<string, { abbr: string; color: string }> = {
  'case-converter': { abbr: 'Cc', color: '#9333ea' },
  'reverse-text': { abbr: 'Rv', color: '#2563eb' },
  'base64-encode-decode': { abbr: '64', color: '#16a34a' },
  'slug-generator': { abbr: 'Sg', color: '#0891b2' },
  'password-generator': { abbr: 'Pw', color: '#db2777' },
}

interface ToolCardsProps {
  locale: string
  toolNames: Record<string, { name: string; description: string }>
}

export function ToolCards({ locale, toolNames }: ToolCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      {tools.map(tool => {
        const display = TOOL_DISPLAY[tool.slug] || { abbr: '?', color: '#71717a' }
        const href = tool.isHomepage
          ? locale === 'en' ? '/' : '/vi/'
          : locale === 'en' ? `/${tool.slug}/` : `/vi/${tool.slug}/`
        const names = toolNames[tool.i18nKey] || { name: tool.slug, description: '' }
        return (
          <Card
            key={tool.slug}
            className="border-[var(--color-border-brand)] hover:border-[var(--color-navy)] transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  style={{ backgroundColor: display.color }}
                  className="text-white text-xs w-6 h-6 justify-center p-0 border-transparent"
                >
                  {display.abbr}
                </Badge>
                <a
                  href={href}
                  className="text-sm font-medium text-[var(--color-navy)] dark:text-zinc-200 hover:underline"
                >
                  {names.name}
                </a>
              </div>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">{names.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface RelatedToolsProps {
  heading: string
  locale: string
  relatedSlugs: string[]
  toolNames: Record<string, { name: string }>
}

export function RelatedTools({ heading, locale, relatedSlugs, toolNames }: RelatedToolsProps) {
  const relatedTools = relatedSlugs
    .map(slug => {
      const tool = tools.find(t => t.slug === slug)
      if (!tool) return null
      const display = TOOL_DISPLAY[slug] || { abbr: '?', color: '#71717a' }
      const href = tool.isHomepage
        ? locale === 'en' ? '/' : '/vi/'
        : locale === 'en' ? `/${slug}/` : `/vi/${slug}/`
      const names = toolNames[tool.i18nKey] || { name: slug }
      return { slug, href, display, name: names.name }
    })
    .filter(Boolean)

  return (
    <section aria-labelledby="related-heading" className="mt-10 pt-6 border-t border-[#c5e0d8]">
      <h2
        id="related-heading"
        className="text-xl font-bold text-[#1a2744] dark:text-zinc-200 mb-4"
      >
        {heading}
      </h2>
      <div className="flex flex-wrap gap-3">
        {relatedTools.map(
          tool =>
            tool && (
              <a
                key={tool.slug}
                href={tool.href}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 border border-[#c5e0d8] dark:border-zinc-700 rounded-[4px] text-[14px] text-zinc-700 dark:text-zinc-300 font-medium hover:border-[#1a2744] hover:text-[#1a2744] hover:bg-[#f0faf7] dark:hover:border-zinc-500 dark:hover:text-zinc-100 transition-all duration-150"
              >
                <Badge
                  style={{ backgroundColor: tool.display.color }}
                  className="text-white text-[10px] font-bold w-[22px] h-[22px] justify-center p-0 border-transparent rounded-[3px] shrink-0"
                >
                  {tool.display.abbr}
                </Badge>
                {tool.name}
              </a>
            )
        )}
      </div>
    </section>
  )
}
