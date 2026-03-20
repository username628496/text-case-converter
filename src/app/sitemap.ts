import type { MetadataRoute } from 'next'
import { tools } from '@/lib/tools'

const BASE_URL = 'https://textcaseconverter.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return tools.map((tool) => {
    const enUrl = tool.isHomepage
      ? `${BASE_URL}/`
      : `${BASE_URL}/${tool.slug}/`
    const viUrl = tool.isHomepage
      ? `${BASE_URL}/vi/`
      : `${BASE_URL}/vi/${tool.slug}/`

    return {
      url: enUrl,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: enUrl,
          vi: viUrl,
        },
      },
    }
  })
}
