const VIETNAMESE_MAP: Record<string, string> = {
  // a variants
  à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
  ă: 'a', ắ: 'a', ằ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
  â: 'a', ấ: 'a', ầ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
  // e variants
  è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
  ê: 'e', ế: 'e', ề: 'e', ể: 'e', ễ: 'e', ệ: 'e',
  // i variants
  ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
  // o variants
  ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
  ô: 'o', ố: 'o', ồ: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
  ơ: 'o', ớ: 'o', ờ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
  // u variants
  ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
  ư: 'u', ứ: 'u', ừ: 'u', ử: 'u', ữ: 'u', ự: 'u',
  // y variants
  ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
  // d variants
  đ: 'd', Đ: 'd',
}

export function generateSlug(text: string): string {
  if (text === '') return ''

  return text
    .toLowerCase()
    // Transliterate Vietnamese diacritics
    .replace(/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]/g, c => VIETNAMESE_MAP[c] ?? c)
    // Strip apostrophes and similar word-internal punctuation (no hyphen replacement)
    .replace(/[''`]/g, '')
    // Replace remaining non-alphanumeric chars (spaces, @, ., etc.) with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Collapse multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}
