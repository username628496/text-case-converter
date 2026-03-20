import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHomepageTool, tools } from '@/lib/tools'
import { ToolPage } from '@/components/tool-page'
import { FAQSection } from '@/components/faq-section'
import { ToolCards, RelatedTools } from '@/components/tool-cards'
import { JsonLd } from '@/components/json-ld'

const BASE_URL = 'https://textcaseconverter.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  const canonical = locale === 'en' ? `${BASE_URL}/` : `${BASE_URL}/vi/`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/`,
        vi: `${BASE_URL}/vi/`,
      },
    },
    openGraph: {
      images: [`${BASE_URL}/og/text-case-converter.png`],
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const homepageTool = getHomepageTool()
  const tFaq = await getTranslations({ locale, namespace: 'faq' })
  const tRelated = await getTranslations({ locale, namespace: 'related' })
  const tHowto = await getTranslations({ locale, namespace: 'howto' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })

  // Extract FAQ items from translations
  // next-intl v4: use raw() to get array
  const faqItems = tFaq.raw('items') as Array<{ question: string; answer: string }>

  // Build tool names lookup for ToolCards and RelatedTools
  const toolNames: Record<string, { name: string; description: string }> = {}
  for (const tool of tools) {
    const key = tool.i18nKey // e.g. 'tools.caseConverter'
    const subKey = key.replace('tools.', '') // e.g. 'caseConverter'
    toolNames[key] = {
      name: tTools(subKey + '.name'),
      description: tTools(subKey + '.description'),
    }
  }

  // Build JSON-LD data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Text Case Converter',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: locale === 'en' ? `${BASE_URL}/` : `${BASE_URL}/vi/`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'HowTo',
        name: tHowto('name'),
        step: [
          { '@type': 'HowToStep', text: tHowto('step1') },
          { '@type': 'HowToStep', text: tHowto('step2') },
          { '@type': 'HowToStep', text: tHowto('step3') },
          { '@type': 'HowToStep', text: tHowto('step4') },
        ],
      },
    ],
  }

  return (
    <div>
      <ToolPage />

      <ToolCards locale={locale} toolNames={toolNames} />

      <FAQSection
        heading={tFaq('heading')}
        items={faqItems}
      />

      <RelatedTools
        heading={tRelated('heading')}
        locale={locale}
        relatedSlugs={homepageTool.relatedSlugs}
        toolNames={toolNames}
      />

      <JsonLd data={jsonLd} />
    </div>
  )
}
