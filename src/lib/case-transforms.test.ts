import { describe, it, expect } from 'vitest'
import {
  transformText,
  toSentenceCase,
  toCapitalizedCase,
  toAlternatingCase,
  toTitleCase,
  toInverseCase,
  CASE_MODES,
} from './case-transforms'

describe('toSentenceCase', () => {
  it('capitalizes first letter and lowercases rest', () => {
    expect(toSentenceCase('HELLO WORLD')).toBe('Hello world')
  })

  it('handles multi-sentence input', () => {
    expect(toSentenceCase('HELLO WORLD. HOW ARE YOU?')).toBe('Hello world. How are you?')
  })

  it('handles single word', () => {
    expect(toSentenceCase('hello')).toBe('Hello')
  })

  it('returns empty string unchanged', () => {
    expect(toSentenceCase('')).toBe('')
  })

  it('capitalizes after exclamation mark', () => {
    expect(toSentenceCase('hello! world')).toBe('Hello! World')
  })

  it('capitalizes after question mark', () => {
    expect(toSentenceCase('hello? world')).toBe('Hello? World')
  })
})

describe('toCapitalizedCase', () => {
  it('capitalizes first letter of each word', () => {
    expect(toCapitalizedCase('hello world test')).toBe('Hello World Test')
  })

  it('lowercases already-capitalized words', () => {
    expect(toCapitalizedCase('ALREADY BIG')).toBe('Already Big')
  })

  it('handles empty string', () => {
    expect(toCapitalizedCase('')).toBe('')
  })
})

describe('toAlternatingCase', () => {
  it('alternates case starting with lowercase', () => {
    expect(toAlternatingCase('Hello')).toBe('hElLo')
  })

  it('space counts as a character in the index', () => {
    expect(toAlternatingCase('hello world')).toBe('hElLo wOrLd')
  })

  it('handles empty string', () => {
    expect(toAlternatingCase('')).toBe('')
  })
})

describe('toTitleCase', () => {
  it('capitalizes all words by default', () => {
    expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox')
  })

  it('skips "of" as a non-first word', () => {
    expect(toTitleCase('a tale of two cities')).toBe('A Tale of Two Cities')
  })

  it('skips "and" as a non-first word', () => {
    expect(toTitleCase('war and peace')).toBe('War and Peace')
  })

  it('always capitalizes the first word even if it is a skip word', () => {
    expect(toTitleCase('the great gatsby')).toBe('The Great Gatsby')
  })

  it('skips all stop words: a, an, the, of, in, and, or, but, for, nor', () => {
    expect(toTitleCase('a man in a plan or a canal but not for nor against')).toBe(
      'A Man in a Plan or a Canal but Not for nor Against'
    )
  })
})

describe('toInverseCase', () => {
  it('flips case of each letter', () => {
    expect(toInverseCase('Hello World 123')).toBe('hELLO wORLD 123')
  })

  it('returns empty string unchanged', () => {
    expect(toInverseCase('')).toBe('')
  })

  it('leaves numbers and symbols unchanged', () => {
    expect(toInverseCase('abc123!@#')).toBe('ABC123!@#')
  })
})

describe('transformText', () => {
  it('routes sentence mode to toSentenceCase', () => {
    expect(transformText('hello world', 'sentence')).toBe('Hello world')
  })

  it('routes lower mode to toLowerCase', () => {
    expect(transformText('HELLO World', 'lower')).toBe('hello world')
  })

  it('routes upper mode to toUpperCase', () => {
    expect(transformText('hello World', 'upper')).toBe('HELLO WORLD')
  })

  it('routes capital mode to toCapitalizedCase', () => {
    expect(transformText('hello world', 'capital')).toBe('Hello World')
  })

  it('routes alternating mode to toAlternatingCase', () => {
    expect(transformText('Hello', 'alternating')).toBe('hElLo')
  })

  it('routes title mode to toTitleCase', () => {
    expect(transformText('the quick brown fox', 'title')).toBe('The Quick Brown Fox')
  })

  it('routes inverse mode to toInverseCase', () => {
    expect(transformText('Hello World 123', 'inverse')).toBe('hELLO wORLD 123')
  })
})

describe('CASE_MODES', () => {
  it('has exactly 7 entries', () => {
    expect(CASE_MODES).toHaveLength(7)
  })

  it('each entry has id, abbr, label, color fields', () => {
    for (const mode of CASE_MODES) {
      expect(mode).toHaveProperty('id')
      expect(mode).toHaveProperty('abbr')
      expect(mode).toHaveProperty('label')
      expect(mode).toHaveProperty('color')
    }
  })

  it('contains all 7 expected mode ids', () => {
    const ids = CASE_MODES.map((m) => m.id)
    expect(ids).toContain('sentence')
    expect(ids).toContain('lower')
    expect(ids).toContain('upper')
    expect(ids).toContain('capital')
    expect(ids).toContain('alternating')
    expect(ids).toContain('title')
    expect(ids).toContain('inverse')
  })
})

describe('word count logic', () => {
  it('counts words in a string', () => {
    const text = 'hello world'
    expect(text.trim().split(/\s+/).length).toBe(2)
  })

  it('returns 0 for empty string', () => {
    const text = ''
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    expect(wordCount).toBe(0)
  })
})

describe('character count logic', () => {
  it('counts characters correctly', () => {
    expect('hello'.length).toBe(5)
  })
})
