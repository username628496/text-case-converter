import { describe, it, expect } from 'vitest'
import { reverseText } from '../reverse-text'
import { base64Encode, base64Decode } from '../base64'
import { generateSlug } from '../slug-generator'
import { generatePassword } from '../password-generator'
import type { PasswordOptions } from '../password-generator'

describe('reverseText', () => {
  it('reverses a simple string', () => {
    expect(reverseText('Hello World')).toBe('dlroW olleH')
  })

  it('reverses a single word', () => {
    expect(reverseText('Hello')).toBe('olleH')
  })

  it('returns empty string for empty input', () => {
    expect(reverseText('')).toBe('')
  })

  it('returns single char unchanged', () => {
    expect(reverseText('a')).toBe('a')
  })

  it('reverses with numbers and symbols', () => {
    expect(reverseText('abc123!')).toBe('!321cba')
  })
})

describe('base64Encode', () => {
  it('encodes Hello to SGVsbG8=', () => {
    expect(base64Encode('Hello')).toBe('SGVsbG8=')
  })

  it('returns empty string for empty input', () => {
    expect(base64Encode('')).toBe('')
  })

  it('encodes a multi-word string', () => {
    expect(base64Encode('Hello World')).toBe('SGVsbG8gV29ybGQ=')
  })
})

describe('base64Decode', () => {
  it('decodes SGVsbG8= to Hello', () => {
    const result = base64Decode('SGVsbG8=')
    expect(result.error).toBe(false)
    if (!result.error) {
      expect(result.result).toBe('Hello')
    }
  })

  it('returns error for invalid Base64 input', () => {
    const result = base64Decode('!!!invalid!!!')
    expect(result.error).toBe(true)
    expect(result.result).toBe('')
  })

  it('decodes a multi-word encoded string', () => {
    const result = base64Decode('SGVsbG8gV29ybGQ=')
    expect(result.error).toBe(false)
    if (!result.error) {
      expect(result.result).toBe('Hello World')
    }
  })

  it('round-trips encode then decode', () => {
    const original = 'Test string 123'
    const encoded = base64Encode(original)
    const decoded = base64Decode(encoded)
    expect(decoded.error).toBe(false)
    if (!decoded.error) {
      expect(decoded.result).toBe(original)
    }
  })
})

describe('generateSlug', () => {
  it('converts Hello World to hello-world', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('transliterates Vietnamese: Tiếng Việt → tieng-viet', () => {
    expect(generateSlug('Tiếng Việt')).toBe('tieng-viet')
  })

  it('transliterates Vietnamese: Cà phê Việt Nam → ca-phe-viet-nam', () => {
    expect(generateSlug('Cà phê Việt Nam')).toBe('ca-phe-viet-nam')
  })

  it("strips apostrophes: Peter's Guide → peters-guide", () => {
    expect(generateSlug("Peter's Guide")).toBe('peters-guide')
  })

  it('collapses multiple hyphens and trims leading/trailing', () => {
    expect(generateSlug('  multiple---hyphens  ')).toBe('multiple-hyphens')
  })

  it('returns empty string for empty input', () => {
    expect(generateSlug('')).toBe('')
  })

  it('lowercases the result', () => {
    expect(generateSlug('ALL CAPS')).toBe('all-caps')
  })

  it('strips non-alphanumeric except hyphens', () => {
    expect(generateSlug('hello@world.com')).toBe('hello-world-com')
  })
})

describe('generatePassword', () => {
  it('returns a string of the requested length', () => {
    const opts: PasswordOptions = { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true }
    const pwd = generatePassword(opts)
    expect(pwd).toHaveLength(16)
  })

  it('returns only lowercase when only lowercase enabled', () => {
    const opts: PasswordOptions = { length: 8, uppercase: false, lowercase: true, numbers: false, symbols: false }
    const pwd = generatePassword(opts)
    expect(pwd).toHaveLength(8)
    expect(pwd).toMatch(/^[a-z]+$/)
  })

  it('returns only numbers when only numbers enabled', () => {
    const opts: PasswordOptions = { length: 10, uppercase: false, lowercase: false, numbers: true, symbols: false }
    const pwd = generatePassword(opts)
    expect(pwd).toHaveLength(10)
    expect(pwd).toMatch(/^[0-9]+$/)
  })

  it('contains only characters from enabled sets (uppercase + numbers)', () => {
    const opts: PasswordOptions = { length: 20, uppercase: true, lowercase: false, numbers: true, symbols: false }
    const pwd = generatePassword(opts)
    expect(pwd).toHaveLength(20)
    expect(pwd).toMatch(/^[A-Z0-9]+$/)
  })

  it('defaults to lowercase when no toggles enabled', () => {
    const opts: PasswordOptions = { length: 8, uppercase: false, lowercase: false, numbers: false, symbols: false }
    const pwd = generatePassword(opts)
    expect(pwd).toHaveLength(8)
    expect(pwd).toMatch(/^[a-z]+$/)
  })

  it('generates a length-64 password', () => {
    const opts: PasswordOptions = { length: 64, uppercase: true, lowercase: true, numbers: true, symbols: true }
    const pwd = generatePassword(opts)
    expect(pwd).toHaveLength(64)
  })
})
