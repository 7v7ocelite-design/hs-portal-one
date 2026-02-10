/**
 * Input sanitization utilities to prevent unicode/emoji API errors
 */

// Remove emoji and special unicode characters, keep basic text
export function sanitizeText(input: string): string {
  if (!input) return input

  // Remove emoji ranges and special unicode
  return input
    // Remove emoji
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Symbols & Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & Map
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Extended
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols Extended-A
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc Symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
    .replace(/[\u{200D}]/gu, '')            // Zero Width Joiner
    .trim()
}

// For names: letters, spaces, hyphens, apostrophes only
export function sanitizeName(input: string): string {
  if (!input) return input
  return sanitizeText(input)
    .replace(/[^a-zA-Z\s\-']/g, '')
    .trim()
}

// For school/club names: letters, numbers, spaces, common punctuation
export function sanitizeOrgName(input: string): string {
  if (!input) return input
  return sanitizeText(input)
    .replace(/[^a-zA-Z0-9\s\-'&.]/g, '')
    .trim()
}

// For city names: letters, spaces, hyphens
export function sanitizeCity(input: string): string {
  if (!input) return input
  return sanitizeText(input)
    .replace(/[^a-zA-Z\s\-'.]/g, '')
    .trim()
}

// For phone: digits, parentheses, hyphens, spaces, plus
export function sanitizePhone(input: string): string {
  if (!input) return input
  return input.replace(/[^0-9()\-\s+]/g, '')
}

// For URLs: keep valid URL characters
export function sanitizeUrl(input: string): string {
  if (!input) return input
  return sanitizeText(input)
    .replace(/[^a-zA-Z0-9:/.?=&\-_~#%]/g, '')
}

// For Twitter handles: alphanumeric and underscore only
export function sanitizeHandle(input: string): string {
  if (!input) return input
  return input.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 15)
}

// For email: standard email characters
export function sanitizeEmail(input: string): string {
  if (!input) return input
  return sanitizeText(input)
    .replace(/[^a-zA-Z0-9@.\-_+]/g, '')
    .toLowerCase()
}

// For GPA: digits and decimal only
export function sanitizeGpa(input: string): string {
  if (!input) return input
  const cleaned = input.replace(/[^0-9.]/g, '')
  // Ensure only one decimal point
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }
  return cleaned
}

// For conference/generic text: letters, numbers, spaces, common punctuation
export function sanitizeGeneric(input: string): string {
  if (!input) return input
  return sanitizeText(input)
    .replace(/[^a-zA-Z0-9\s\-'&.,#]/g, '')
    .trim()
}
