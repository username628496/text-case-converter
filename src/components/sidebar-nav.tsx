import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { tools } from '@/lib/tools'

interface SidebarNavProps {
  locale: string
  currentSlug?: string // active tool slug, e.g. 'reverse-text'; undefined on homepage
}

// Tool groups using category from tools.ts
// Text Tools: text category
// Code & Data: encoding category
// Random: generator category
const TOOL_GROUPS = [
  {
    labelKey: 'textTools', // maps to nav.textTools in messages
    category: 'text',
  },
  {
    labelKey: 'codeData', // maps to nav.codeData in messages
    category: 'encoding',
  },
  {
    labelKey: 'randomGenerators', // maps to nav.randomGenerators in messages
    category: 'generator',
  },
]

export { TOOL_GROUPS }

export async function SidebarNav({ locale, currentSlug }: SidebarNavProps) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })

  return (
    <nav className="mt-4 space-y-5" aria-label={tNav('sidebarTools')}>
      {TOOL_GROUPS.map(({ labelKey, category }) => {
        const groupTools = tools.filter((t) => t.category === category)
        if (groupTools.length === 0) return null

        return (
          <div key={category}>
            <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              {tNav(labelKey as 'textTools' | 'codeData' | 'randomGenerators')}
            </h3>
            <ul className="space-y-0.5">
              {groupTools.map((tool) => {
                const href = tool.isHomepage
                  ? locale === 'en'
                    ? '/'
                    : '/vi/'
                  : locale === 'en'
                    ? `/${tool.slug}/`
                    : `/vi/${tool.slug}/`

                const isActive = tool.isHomepage
                  ? currentSlug === undefined
                  : currentSlug === tool.slug

                const toolSubKey = tool.i18nKey.replace('tools.', '') // e.g. 'caseConverter'
                const toolName = tTools(`${toolSubKey}.name` as Parameters<typeof tTools>[0])

                return (
                  <li key={tool.slug}>
                    <Link
                      href={href}
                      className={`block px-2 py-1.5 rounded-[4px] text-[14px] transition-colors ${
                        isActive
                          ? 'bg-[var(--color-navy)] text-white font-medium'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-[var(--color-mint)] dark:hover:bg-zinc-800 hover:text-[var(--color-navy)]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {toolName}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
