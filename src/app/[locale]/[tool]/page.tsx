import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getToolSlugs, getToolBySlug, tools } from '@/lib/tools'
import { buildToolMetadata, buildToolJsonLd } from '@/lib/tool-seo'
import { notFound } from 'next/navigation'
import { FAQSection } from '@/components/faq-section'
import { RelatedTools } from '@/components/tool-cards'
import { JsonLd } from '@/components/json-ld'
import { ReverseTextTool } from '@/components/tools/reverse-text-tool'
import { Base64Tool } from '@/components/tools/base64-tool'
import { SlugGeneratorTool } from '@/components/tools/slug-generator-tool'
import { PasswordGeneratorTool } from '@/components/tools/password-generator-tool'

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  'reverse-text': ReverseTextTool,
  'base64-encode-decode': Base64Tool,
  'slug-generator': SlugGeneratorTool,
  'password-generator': PasswordGeneratorTool,
}

export function generateStaticParams() {
  return getToolSlugs().map((tool) => ({ tool }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>
}): Promise<Metadata> {
  const { locale, tool: toolSlug } = await params
  return buildToolMetadata(toolSlug, locale)
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

  const ToolComponent = TOOL_COMPONENTS[toolSlug]
  if (!ToolComponent) {
    notFound()
  }

  const tTool = await getTranslations({ locale, namespace: tool.i18nNamespace })
  const tRelated = await getTranslations({ locale, namespace: 'related' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })

  // Extract FAQ items using next-intl v4 raw() for array access
  const faqItems = tTool.raw('faq.items') as Array<{ question: string; answer: string }>

  // Build toolNames lookup for RelatedTools
  const toolNames: Record<string, { name: string; description: string }> = {}
  for (const t of tools) {
    const key = t.i18nKey // e.g. 'tools.caseConverter'
    const subKey = key.replace('tools.', '') // e.g. 'caseConverter'
    toolNames[key] = {
      name: tTools(subKey + '.name'),
      description: tTools(subKey + '.description'),
    }
  }

  const jsonLd = await buildToolJsonLd(toolSlug, locale)

  return (
    <div>
      <ToolComponent />

      <FAQSection
        heading={tTool('faq.heading')}
        items={faqItems}
      />

      <RelatedTools
        heading={tRelated('heading')}
        locale={locale}
        relatedSlugs={tool.relatedSlugs}
        toolNames={toolNames}
      />

      <JsonLd data={jsonLd} />
    </div>
  )
}
