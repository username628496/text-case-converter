export function base64Encode(text: string): string {
  if (text === '') return ''
  const bytes = new TextEncoder().encode(text)
  return btoa(String.fromCharCode(...bytes))
}

export function base64Decode(text: string): { result: string; error: false } | { result: ''; error: true } {
  try {
    const binary = atob(text)
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
    return { result: new TextDecoder().decode(bytes), error: false }
  } catch {
    return { result: '', error: true }
  }
}
