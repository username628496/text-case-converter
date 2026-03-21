'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { tools } from '@/lib/tools'

interface SidebarNavProps {
  locale: string
}

const TOOL_GROUPS = [
  { labelKey: 'textTools', category: 'text', color: '#1a2744' },
  { labelKey: 'codeData', category: 'encoding', color: '#0d6e5c' },
  { labelKey: 'randomGenerators', category: 'generator', color: '#7c3aed' },
] as const

export function SidebarNav({ locale }: SidebarNavProps) {
  const pathname = usePathname()
  const tNav = useTranslations('nav')
  const tTools = useTranslations('tools')

  return (
    <nav
      className="sticky top-20 mt-4 bg-white dark:bg-zinc-900 border border-[#c5e0d8] dark:border-zinc-700 rounded-md"
      style={{ padding: '16px 12px' }}
      aria-label={tNav('sidebarTools')}
    >
      {TOOL_GROUPS.map(({ labelKey, category, color }, groupIndex) => {
        const groupTools = tools.filter((t) => t.category === category)
        if (groupTools.length === 0) return null

        return (
          <div key={category} style={{ marginTop: groupIndex === 0 ? 0 : 16 }}>
            <h3
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 8,
                color: '#94a3b8',
              }}
            >
              {tNav(labelKey)}
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {groupTools.map((tool) => {
                const href = tool.isHomepage
                  ? locale === 'en'
                    ? '/'
                    : '/vi/'
                  : locale === 'en'
                    ? `/${tool.slug}/`
                    : `/vi/${tool.slug}/`

                // Normalize: compare without trailing slash to be robust
                const normalizedPathname = pathname.replace(/\/$/, '') || '/'
                const normalizedHref = href.replace(/\/$/, '') || '/'
                const isActive = normalizedPathname === normalizedHref

                const toolSubKey = tool.i18nKey.replace('tools.', '')
                const toolName = tTools(`${toolSubKey}.name` as Parameters<typeof tTools>[0])
                const initial = toolName.charAt(0).toUpperCase()

                return (
                  <li key={tool.slug} style={{ marginBottom: 2 }}>
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={
                        isActive
                          ? 'flex items-center gap-2 rounded-[4px] text-[13px] font-medium no-underline transition-colors duration-150 bg-[#1a2744] text-white'
                          : 'flex items-center gap-2 rounded-[4px] text-[13px] font-normal no-underline transition-colors duration-150 text-zinc-600 hover:bg-[#e8f5f2] hover:text-[#1a2744]'
                      }
                      style={{ padding: '6px 10px' }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'white',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : color,
                          flexShrink: 0,
                        }}
                      >
                        {initial}
                      </span>
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
