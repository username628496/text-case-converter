import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getToolSlugs, getToolBySlug } from '@/lib/tools'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getToolSlugs().map((tool) => ({ tool }))
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>
}) {
  const { locale, tool: toolSlug } = await params
  setRequestLocale(locale)

  const tool = getToolBySlug(toolSlug)
  if (!tool) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: tool.i18nKey })

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {t('name')}
      </h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        {t('description')}
      </p>
      <p className="mt-8 text-sm text-zinc-500">
        Tool UI coming in Phase 3.
      </p>
    </div>
  )
}
