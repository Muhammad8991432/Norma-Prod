/**
 * Shared gradient utilities for news teaser components (NewsTeaserSmall, NewsTeaserBig).
 * Keeps the gradient direction map and style computation in one place.
 */

/** Maps CMS `linearGradient` string values to CSS angle strings. */
export const GRADIENT_DIRECTION_MAP = {
  topToBottom: '180deg',
  bottomToTop: '0deg',
  leftToRight: '90deg',
  rightToLeft: '270deg',
  leftTopToRightBottom: '135deg',
  rightBottomToLeftTop: '315deg',
  leftBottomToRightTop: '45deg',
  rightTopToLeftBottom: '225deg'
};

/**
 * Builds an inline style object for a gradient background, or returns null for plain style.
 *
 * @param {string} teaserStyle    - "gradient" | "plain"
 * @param {string} bgColor1       - First / start color (hex or any CSS color)
 * @param {string} bgColor2       - Second / end color (optional)
 * @param {string} linearGradient - CMS direction key (e.g. "rightBottomToLeftTop")
 * @returns {{ background: string } | null}
 */
export function buildGradientStyle(teaserStyle, bgColor1, bgColor2, linearGradient) {
  if (teaserStyle === 'gradient' && bgColor1) {
    const direction = GRADIENT_DIRECTION_MAP[linearGradient] || '90deg';
    const bg = bgColor2
      ? `linear-gradient(${direction}, ${bgColor1} 0%, ${bgColor2} 100%)`
      : bgColor1;
    return { background: bg };
  }
  return null;
}

/**
 * Extracts bgColor1 and bgColor2 from a teaser CMS item.
 * Handles both array (["#aaa","#bbb"]) and plain string ("#aaa") formats.
 *
 * @param {object} item - A single teaser CMS item
 * @returns {{ bgColor1: string, bgColor2: string }}
 */
export function extractTeaserColors(item) {
  if (Array.isArray(item?.teaserBgColorLight)) {
    const [bgColor1, bgColor2 = ''] = item.teaserBgColorLight;
    return { bgColor1, bgColor2 };
  }
  return { bgColor1: item?.teaserBgColorLight || '', bgColor2: '' };
}

/**
 * Refactored from News page to be possibly used across teaser components.
 * Currently not used in favour of existing function extractTeaserColors above.
 * Is kept for potential future use if needed.
 * 
 * @param {Array | string} bg array (["#aaa","#bbb"]) or plain string ("#aaa")
 * @returns {{ bgColor1: string, bgColor2: string }}
 */
export const getBgColors = (bg) => {
  if (Array.isArray(bg)) {
    const [bgColor1 = '', bgColor2 = ''] = bg;
    return { bgColor1, bgColor2 };
  }
  return { bgColor1: bg || '', bgColor2: '' };
};
