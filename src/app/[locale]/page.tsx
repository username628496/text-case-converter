import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {t('heading')}
      </h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        {t('subheading')}
      </p>
      <p className="mt-8 text-sm text-zinc-500">
        Tool UI coming in Phase 2.
      </p>
    </div>
  )
}
