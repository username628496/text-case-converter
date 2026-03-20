import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getToolBySlug } from '@/lib/tools'

const BASE_URL = 'https://convertcase.uk'

/**
 * Build Next.js Metadata for a tool page.
 * Called from [tool]/page.tsx generateMetadata.
 */
export async function buildToolMetadata(slug: string, locale: string): Promise<Metadata> {
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  const t = await getTranslations({ locale, namespace: tool.i18nNamespace })
  const enUrl = `${BASE_URL}/${tool.slug}/`
  const viUrl = `${BASE_URL}/vi/${tool.slug}/`
  const canonical = locale === 'en' ? enUrl : viUrl

  return {
    title: t('seo.title'),
    description: t('seo.description'),
    alternates: {
      canonical,
      languages: { en: enUrl, vi: viUrl },
    },
    openGraph: {
      images: [`${BASE_URL}/og/${tool.slug}.png`],
    },
  }
}

/**
 * Build JSON-LD structured data (SoftwareApplication + HowTo) for a tool page.
 * Called from [tool]/page.tsx default export to pass to <JsonLd>.
 */
export async function buildToolJsonLd(slug: string, locale: string): Promise<Record<string, unknown>> {
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  const t = await getTranslations({ locale, namespace: tool.i18nNamespace })
  const enUrl = `${BASE_URL}/${tool.slug}/`
  const viUrl = `${BASE_URL}/vi/${tool.slug}/`
  const canonical = locale === 'en' ? enUrl : viUrl

  // Use raw() to safely check for optional step4 without throwing on missing key
  const howtoRaw = t.raw('howto') as Record<string, string>

  const steps: Array<{ '@type': string; text: string }> = [
    { '@type': 'HowToStep', text: howtoRaw.step1 },
    { '@type': 'HowToStep', text: howtoRaw.step2 },
    { '@type': 'HowToStep', text: howtoRaw.step3 },
  ]

  // Some tools have a 4th step — include conditionally
  if (howtoRaw.step4) {
    steps.push({ '@type': 'HowToStep', text: howtoRaw.step4 })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: t('tool.title'),
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: canonical,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'HowTo',
        name: t('howto.name'),
        step: steps,
      },
    ],
  }
}
