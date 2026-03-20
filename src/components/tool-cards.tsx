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
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{names.description}</p>
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
      const href = locale === 'en' ? `/${slug}/` : `/vi/${slug}/`
      const names = toolNames[tool.i18nKey] || { name: slug }
      return { slug, href, display, name: names.name }
    })
    .filter(Boolean)

  return (
    <section aria-labelledby="related-heading" className="mt-8">
      <h2
        id="related-heading"
        className="text-lg font-semibold text-[var(--color-navy)] dark:text-zinc-200 mb-3"
      >
        {heading}
      </h2>
      <div className="flex flex-wrap gap-2">
        {relatedTools.map(
          tool =>
            tool && (
              <a
                key={tool.slug}
                href={tool.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--color-border-brand)] text-sm text-zinc-700 dark:text-zinc-300 dark:border-zinc-700 hover:border-[var(--color-navy)] hover:text-[var(--color-navy)] transition-colors"
              >
                <Badge
                  style={{ backgroundColor: tool.display.color }}
                  className="text-white text-xs w-5 h-5 justify-center p-0 border-transparent"
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
