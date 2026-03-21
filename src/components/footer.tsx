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
    <footer className="bg-white dark:bg-zinc-950">
      {/* Tool directory */}
      <div className="border-t border-[#c5e0d8] dark:border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FOOTER_TOOL_GROUPS.map(({ labelKey, category }) => {
              const groupTools = tools.filter((t) => t.category === category)
              return (
                <div key={category}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    {tNav(labelKey)}
                  </h3>
                  <ul className="list-none m-0 p-0">
                    {groupTools.map((tool) => {
                      const subKey = tool.i18nKey.replace('tools.', '')
                      const toolName = tTools(`${subKey}.name` as Parameters<typeof tTools>[0])
                      const href = tool.isHomepage
                        ? locale === 'en' ? '/' : '/vi/'
                        : locale === 'en' ? `/${tool.slug}/` : `/vi/${tool.slug}/`
                      return (
                        <li key={tool.slug}>
                          <a
                            href={href}
                            className="block py-1 text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-[#1a2744] dark:hover:text-zinc-100 transition-colors"
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

      {/* Bottom bar */}
      <div className="border-t border-[#f0f0f0] dark:border-zinc-800 py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Left: logo + copyright */}
          <div>
            <p className="font-bold text-[var(--color-navy)] dark:text-zinc-100">
              Text Case Converter
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              © {year} All rights reserved
            </p>
          </div>

          {/* Center: policy links */}
          <div className="flex flex-wrap gap-4 justify-center">
            {(['privacyPolicy', 'termsOfService', 'sitemap', 'contact'] as const).map((key) => (
              <a
                key={key}
                href="#"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#1a2744] dark:hover:text-zinc-100 transition-colors"
              >
                {tFooter(key)}
              </a>
            ))}
          </div>

          {/* Right: tagline */}
          <div className="sm:text-right">
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              {tFooter('madeWith')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
