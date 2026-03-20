export interface PasswordOptions {
  length: number     // 8-64
  uppercase: boolean // A-Z
  lowercase: boolean // a-z
  numbers: boolean   // 0-9
  symbols: boolean   // !@#$%^&*()_+-=[]{}|;:,.<>?
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

export function generatePassword(options: PasswordOptions): string {
  let charset = ''

  if (options.uppercase) charset += UPPERCASE
  if (options.lowercase) charset += LOWERCASE
  if (options.numbers) charset += NUMBERS
  if (options.symbols) charset += SYMBOLS

  // Default to lowercase if no sets enabled
  if (charset === '') charset = LOWERCASE

  const length = Math.max(8, Math.min(64, options.length))
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)

  return Array.from(array, n => charset[n % charset.length]).join('')
}
