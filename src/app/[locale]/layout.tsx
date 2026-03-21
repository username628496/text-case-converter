import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Toaster } from '@/components/ui/sonner'
import { SiteNav } from '@/components/site-nav'
import { Footer } from '@/components/footer'
import { SidebarNav } from '@/components/sidebar-nav'
import { tools } from '@/lib/tools'

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

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'common' })
  const tLayout = await getTranslations({ locale, namespace: 'layout' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })

  // Build tool groups for mobile nav drawer
  const toolGroupsData = [
    {
      label: tNav('textTools'),
      tools: tools
        .filter((t) => t.category === 'text')
        .map((tool) => {
          const subKey = tool.i18nKey.replace('tools.', '')
          const href = tool.isHomepage
            ? locale === 'en'
              ? '/'
              : '/vi/'
            : locale === 'en'
              ? `/${tool.slug}/`
              : `/vi/${tool.slug}/`
          return {
            name: tTools(`${subKey}.name` as Parameters<typeof tTools>[0]),
            href,
            slug: tool.slug,
          }
        }),
    },
    {
      label: tNav('codeData'),
      tools: tools
        .filter((t) => t.category === 'encoding')
        .map((tool) => {
          const subKey = tool.i18nKey.replace('tools.', '')
          const href = locale === 'en' ? `/${tool.slug}/` : `/vi/${tool.slug}/`
          return {
            name: tTools(`${subKey}.name` as Parameters<typeof tTools>[0]),
            href,
            slug: tool.slug,
          }
        }),
    },
    {
      label: tNav('randomGenerators'),
      tools: tools
        .filter((t) => t.category === 'generator')
        .map((tool) => {
          const subKey = tool.i18nKey.replace('tools.', '')
          const href = locale === 'en' ? `/${tool.slug}/` : `/vi/${tool.slug}/`
          return {
            name: tTools(`${subKey}.name` as Parameters<typeof tTools>[0]),
            href,
            slug: tool.slug,
          }
        }),
    },
  ]

  return (
    <NextIntlClientProvider>
      {/* Header ad slot: 90px min-height */}
      <div
        className="min-h-[90px] w-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-xs text-zinc-400"
        aria-hidden="true"
        data-ad-slot="header"
      >
        {tLayout('adPlaceholder')}
      </div>
      <SiteNav
        locale={locale}
        siteName={t('siteName')}
        translations={{
          textTools: tNav('textTools'),
          codeData: tNav('codeData'),
          fontStyles: tNav('fontStyles'),
          randomGenerators: tNav('randomGenerators'),
          toggleDark: tNav('toggleDark'),
          switchLocale: tNav('switchLocale'),
          menu: tNav('menu'),
          sidebarTools: tNav('sidebarTools'),
        }}
        toolGroups={toolGroupsData}
      />

      {/* Main content area with sidebar */}
      <div className="mx-auto max-w-6xl flex flex-1 px-4 py-6 gap-6">
        {/* Main content column */}
        <main className="flex-1 min-w-0">
          {children}

          {/* Below-tool ad slot: 90px min-height */}
          <div
            className="mt-6 min-h-[90px] w-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-xs text-zinc-400"
            aria-hidden="true"
            data-ad-slot="below-tool"
          >
            {tLayout('adPlaceholder')}
          </div>
        </main>

        {/* Sidebar column -- hidden on mobile */}
        <aside className="hidden lg:block w-64 shrink-0">
          {/* Sidebar ad slot: 250px min-height — PRESERVE AS-IS */}
          <div
            className="min-h-[250px] w-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-xs text-zinc-400 sticky top-6"
            aria-hidden="true"
            data-ad-slot="sidebar"
          >
            {tLayout('adPlaceholder')}
          </div>
          {/* Sidebar tool navigation — added in Phase 07 */}
          <SidebarNav locale={locale} />
        </aside>
      </div>
      <Footer locale={locale} />
      <Toaster />
    </NextIntlClientProvider>
  )
}
