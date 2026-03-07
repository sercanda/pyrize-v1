/**
 * Input sanitizer for user-provided content.
 * Strips potential XSS vectors without requiring external dependencies.
 */

const SCRIPT_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_PATTERN = /\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;
const IFRAME_PATTERN = /<iframe\b[^>]*>.*?<\/iframe>/gi;
const OBJECT_PATTERN = /<(?:object|embed|applet)\b[^>]*>.*?<\/(?:object|embed|applet)>/gi;
const DATA_URI_PATTERN = /(?:href|src)\s*=\s*(?:"|')?\s*(?:data|javascript)\s*:/gi;

export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(SCRIPT_PATTERN, '')
    .replace(EVENT_HANDLER_PATTERN, '')
    .replace(IFRAME_PATTERN, '')
    .replace(OBJECT_PATTERN, '')
    .replace(DATA_URI_PATTERN, 'href="')
    .trim();
}

export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
