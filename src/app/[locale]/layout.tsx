import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Toaster } from '@/components/ui/sonner'

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

  const otherLocale = locale === 'en' ? 'vi' : 'en'
  const switchHref = locale === 'en' ? '/vi/' : '/'

  return (
    <NextIntlClientProvider>
      {/* Header with site name and language switcher */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
        {/* Header ad slot: 90px min-height */}
        <div
          className="min-h-[90px] w-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-xs text-zinc-400"
          aria-hidden="true"
          data-ad-slot="header"
        >
          {tLayout('adPlaceholder')}
        </div>
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <a href={locale === 'en' ? '/' : '/vi/'} className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t('siteName')}
          </a>
          <a
            href={switchHref}
            className="text-sm px-3 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {t(`languageSwitcher.${otherLocale}`)}
          </a>
        </div>
      </header>

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
        <aside className="hidden lg:block w-72 shrink-0">
          {/* Sidebar ad slot: 250px min-height */}
          <div
            className="min-h-[250px] w-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-xs text-zinc-400 sticky top-6"
            aria-hidden="true"
            data-ad-slot="sidebar"
          >
            {tLayout('adPlaceholder')}
          </div>
        </aside>
      </div>
      <Toaster />
    </NextIntlClientProvider>
  )
}
