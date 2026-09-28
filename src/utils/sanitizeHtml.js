import DOMPurify from 'dompurify';

const RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: ['a', 'b', 'strong', 'i', 'em', 'span', 'br', 'sup', 'sub', 'p', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'target', 'class', 'title']
};

const SVG_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  FORBID_TAGS: ['script', 'foreignObject'],
  FORBID_ATTR: ['onload', 'onerror', 'onclick']
};

// Sanitises CMS-authored rich text (headings, body copy, buttons) before rendering via dangerouslySetInnerHTML
export const sanitizeRichText = (html) => DOMPurify.sanitize(html ?? '', RICH_TEXT_CONFIG);

// Sanitises SVG markup fetched from the CMS before rendering via dangerouslySetInnerHTML
export const sanitizeSvg = (svg) => DOMPurify.sanitize(svg ?? '', SVG_CONFIG);
