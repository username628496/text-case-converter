import { getTranslations } from 'next-intl/server'
import { tools } from '@/lib/tools'

const FOOTER_TOOL_GROUPS = [
  { labelKey: 'textTools', category: 'text' },
  { labelKey: 'codeData', category: 'encoding' },
  { labelKey: 'randomGenerators', category: 'generator' },
] as const

interface FooterProps {
  locale: string
}

export async function Footer({ locale }: FooterProps) {
  const tFooter = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#c5e0d8] bg-white dark:bg-zinc-950 dark:border-zinc-800">
      {/* Tool directory */}
      <div className="border-b border-[#c5e0d8] dark:border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FOOTER_TOOL_GROUPS.map(({ labelKey, category }) => {
              const groupTools = tools.filter((t) => t.category === category)
              return (
                <div key={category}>
                  <h3
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      marginBottom: 12,
                    }}
                  >
                    {tNav(labelKey)}
                  </h3>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {groupTools.map((tool) => {
                      const subKey = tool.i18nKey.replace('tools.', '')
                      const toolName = tTools(`${subKey}.name` as Parameters<typeof tTools>[0])
                      const href = tool.isHomepage
                        ? locale === 'en' ? '/' : '/vi/'
                        : locale === 'en' ? `/${tool.slug}/` : `/vi/${tool.slug}/`
                      return (
                        <li key={tool.slug} style={{ marginBottom: 6 }}>
                          <a
                            href={href}
                            className="text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-[#1a2744] dark:hover:text-zinc-100 hover:underline transition-colors"
                          >
                            {toolName}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 3-column desktop, single-column mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Col 1: Logo + copyright + tagline */}
          <div>
            <p className="font-bold text-[var(--color-navy)] dark:text-zinc-100">
              Text Case Converter
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              {tFooter('copyright', { year })}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {tFooter('tagline')}
            </p>
          </div>

          {/* Col 2: 2×2 link grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 content-start">
            {([
              ['privacyPolicy', '#'],
              ['termsOfService', '#'],
              ['sitemap', '#'],
              ['contact', '#'],
            ] as const).map(([key, href]) => (
              <a
                key={key}
                href={href}
                className="text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-navy)] dark:hover:text-zinc-100 transition-colors"
              >
                {tFooter(key)}
              </a>
            ))}
          </div>

          {/* Col 3: Tagline blurb (right-aligned on desktop) */}
          <div className="sm:text-right">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Free tools for English and Vietnamese users
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-[#f0f0f0] dark:border-zinc-800 mt-8 pt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          {tFooter('madeWith')} · convertcase.uk
        </div>
      </div>
    </footer>
  )
}
