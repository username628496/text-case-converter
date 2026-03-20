export type CaseMode = 'sentence' | 'lower' | 'upper' | 'capital' | 'alternating' | 'title' | 'inverse'

export const CASE_MODES = [
  { id: 'sentence' as const, abbr: 'Sc', label: 'Sentence case', color: '#ea580c' },
  { id: 'lower' as const, abbr: 'lc', label: 'lower case', color: '#16a34a' },
  { id: 'upper' as const, abbr: 'UC', label: 'UPPER CASE', color: '#2563eb' },
  { id: 'capital' as const, abbr: 'Cc', label: 'Capitalized Case', color: '#9333ea' },
  { id: 'alternating' as const, abbr: 'aC', label: 'aLtErNaTiNg', color: '#ca8a04' },
  { id: 'title' as const, abbr: 'TC', label: 'Title Case', color: '#0891b2' },
  { id: 'inverse' as const, abbr: 'iC', label: 'iNVERSE CaSe', color: '#db2777' },
] as const

export const TITLE_SKIP_WORDS = new Set(['a', 'an', 'the', 'of', 'in', 'and', 'or', 'but', 'for', 'nor'])

export function toSentenceCase(text: string): string {
  if (!text) return text
  return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())
}

export function toCapitalizedCase(text: string): string {
  return text.toLowerCase().split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export function toAlternatingCase(text: string): string {
  return text.split('').map((c, i) =>
    i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
  ).join('')
}

export function toTitleCase(text: string): string {
  return text.toLowerCase().split(' ').map((word, i) => {
    if (i === 0 || !TITLE_SKIP_WORDS.has(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return word
  }).join(' ')
}

export function toInverseCase(text: string): string {
  return text.split('').map(c =>
    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
  ).join('')
}

export function transformText(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'sentence': return toSentenceCase(text)
    case 'lower': return text.toLowerCase()
    case 'upper': return text.toUpperCase()
    case 'capital': return toCapitalizedCase(text)
    case 'alternating': return toAlternatingCase(text)
    case 'title': return toTitleCase(text)
    case 'inverse': return toInverseCase(text)
  }
}
