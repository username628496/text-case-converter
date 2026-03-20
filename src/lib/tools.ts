export interface Tool {
  slug: string
  i18nKey: string
  i18nNamespace: string
  category: string
  relatedSlugs: string[]
  isHomepage?: boolean
}

export const tools: Tool[] = [
  {
    slug: 'case-converter',
    i18nKey: 'tools.caseConverter',
    i18nNamespace: 'caseConverter',
    category: 'text',
    relatedSlugs: ['reverse-text', 'slug-generator'],
    isHomepage: true,
  },
  {
    slug: 'reverse-text',
    i18nKey: 'tools.reverseText',
    i18nNamespace: 'reverseText',
    category: 'text',
    relatedSlugs: ['case-converter', 'slug-generator'],
  },
  {
    slug: 'base64-encode-decode',
    i18nKey: 'tools.base64',
    i18nNamespace: 'base64',
    category: 'encoding',
    relatedSlugs: ['slug-generator', 'password-generator'],
  },
  {
    slug: 'slug-generator',
    i18nKey: 'tools.slugGenerator',
    i18nNamespace: 'slugGenerator',
    category: 'text',
    relatedSlugs: ['case-converter', 'reverse-text'],
  },
  {
    slug: 'password-generator',
    i18nKey: 'tools.passwordGenerator',
    i18nNamespace: 'passwordGenerator',
    category: 'generator',
    relatedSlugs: ['base64-encode-decode', 'slug-generator'],
  },
]

/** Get the homepage tool (case-converter) */
export function getHomepageTool(): Tool {
  return tools.find((t) => t.isHomepage)!
}

/** Get a tool by slug */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}

/** Get all non-homepage tool slugs (for [tool] dynamic route) */
export function getToolSlugs(): string[] {
  return tools.filter((t) => !t.isHomepage).map((t) => t.slug)
}
