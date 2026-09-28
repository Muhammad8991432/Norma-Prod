/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/**
 * deviceInfo.js
 * Utility to gather browser / device information for the customer/save-login-data API call.
 *
 * Gathered from:
 *  - navigator.userAgent     – widely supported, works on all browsers and devices
 *  - navigator.userAgentData – Chromium-only (Chrome, Edge, Samsung Internet …)
 *  - window.innerWidth       – used as a tablet-vs-mobile heuristic
 */

// ─── OS version ───────────────────────────────────────────────────────────────

/**
 * Extract a human-readable OS version string from the User-Agent.
 * @param {string} ua
 * @returns {string}
 */
const parseOsVersion = (ua) => {
  // iOS – e.g. "iPhone OS 17_4_1" or "CPU OS 16_0"
  let m = ua.match(/(?:iPhone|CPU)\s+OS\s+([\d_]+)/i);
  if (m) return `iPhone OS ${m[1]}`;

  // macOS – e.g. "Mac OS X 10_15_7"
  m = ua.match(/Mac OS X\s+([\d_]+)/i);
  if (m) return `Mac OS X ${m[1]}`;

  // Android – e.g. "Android 14"
  m = ua.match(/Android\s+([\d.]+)/i);
  if (m) return `Android ${m[1]}`;

  // Windows – e.g. "Windows NT 10.0"
  m = ua.match(/Windows NT\s+([\d.]+)/i);
  if (m) return `Windows NT ${m[1]}`;

  // Linux
  if (/Linux/i.test(ua)) return 'Linux';

  return '';
};

// ─── Browser (app) version ────────────────────────────────────────────────────

/**
 * Extract the browser name + version from the User-Agent.
 * Returned as a string like "Chrome 123.0", "Firefox 124.0", "Safari 17.4", "Edge 123.0".
 *
 * Priority: Edge before Chrome (Edge UA contains both "Edg/" and "Chrome/").
 * @param {string} ua
 * @returns {string}
 */
const parseBrowserVersion = (ua) => {
  let m;

  // Samsung Internet – e.g. "SamsungBrowser/25.0"
  m = ua.match(/SamsungBrowser\/([\d.]+)/i);
  if (m) return `Samsung Internet ${m[1]}`;

  // Opera (new) – e.g. "OPR/109.0"
  m = ua.match(/OPR\/([\d.]+)/i);
  if (m) return `Opera ${m[1]}`;

  // Edge (Chromium) – "Edg/123.0"  (must come before Chrome!)
  m = ua.match(/Edg\/([\d.]+)/i);
  if (m) return `Edge ${m[1]}`;

  // Chrome – "Chrome/123.0.0.0"
  m = ua.match(/Chrome\/([\d.]+)/i);
  if (m) return `Chrome ${m[1]}`;

  // Firefox – "Firefox/124.0"
  m = ua.match(/Firefox\/([\d.]+)/i);
  if (m) return `Firefox ${m[1]}`;

  // Safari – "Version/17.4 … Safari/"  (Version/ carries the real version)
  m = ua.match(/Version\/([\d.]+).*Safari/i);
  if (m) return `Safari ${m[1]}`;

  return '';
};

// ─── Device model ─────────────────────────────────────────────────────────────

/**
 * Extract device model / name from the User-Agent.
 * Returns "Desktop" for non-mobile user-agents.
 * @param {string} ua
 * @returns {string}
 */
const parseDevice = (ua) => {
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';

  // Android – grab the model: "Android 14; Pixel 8" → "Pixel 8"
  const androidModel = ua.match(/Android[^;]*;\s*([^)]+)\)/i);
  if (androidModel) return androidModel[1].trim();

  return 'Desktop';
};

// ─── Device brand ─────────────────────────────────────────────────────────────

/**
 * Guess the hardware brand on mobile/tablet devices only.
 * On desktop browsers the UA does NOT expose the PC manufacturer (ASUS, Dell, HP…),
 * so we return an empty string for desktop rather than wrongly attributing the OS
 * vendor (Microsoft, Apple) as the hardware brand.
 *
 * For Chromium desktop browsers, navigator.userAgentData.brands exposes the
 * *browser* brand (Chrome, Edge…) – also not the PC brand, so we skip that too.
 *
 * @param {string} ua
 * @param {"mobile"|"tablet"|"desktop"} deviceType
 * @returns {string}
 */
const parseBrand = (ua, deviceType) => {
  // Only attempt brand detection on mobile / tablet where the UA reliably
  // contains the manufacturer name.
  if (deviceType === 'desktop') return '';

  if (/iPhone|iPad/i.test(ua)) return 'Apple';
  if (/Samsung|SM-/i.test(ua)) return 'Samsung';
  if (/Huawei|HUAWEI/i.test(ua)) return 'Huawei';
  if (/Xiaomi|Redmi|MIUI/i.test(ua)) return 'Xiaomi';
  if (/OnePlus/i.test(ua)) return 'OnePlus';
  if (/LG/i.test(ua)) return 'LG';
  if (/Sony/i.test(ua)) return 'Sony';
  if (/Motorola|moto\s/i.test(ua)) return 'Motorola';
  if (/Nokia/i.test(ua)) return 'Nokia';
  if (/Google|Pixel/i.test(ua)) return 'Google';
  if (/HTC/i.test(ua)) return 'HTC';
  if (/OPPO/i.test(ua)) return 'OPPO';
  if (/vivo/i.test(ua)) return 'Vivo';
  if (/realme/i.test(ua)) return 'Realme';

  return '';
};

// ─── Device type ──────────────────────────────────────────────────────────────

/**
 * Detect whether the current device is "mobile", "tablet", or "desktop".
 *
 * Priority:
 *  1. iPad UA / maxTouchPoints (modern iPadOS)
 *  2. navigator.userAgentData.mobile (Chromium – reliable)
 *  3. UA regex
 *  4. window.innerWidth heuristic
 * @param {string} ua
 * @returns {"mobile"|"tablet"|"desktop"}
 */
const parseDeviceType = (ua) => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;

  // iPad – modern iPadOS sends "Macintosh" UA but has maxTouchPoints > 1
  const isIpad =
    /iPad/i.test(ua) ||
    (/Macintosh/i.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1);

  if (isIpad) return 'tablet';

  // Chromium userAgentData (most accurate for Chrome/Edge/Samsung Internet)
  if (typeof navigator !== 'undefined' && navigator.userAgentData) {
    const isMobile = navigator.userAgentData.mobile;
    if (isMobile) {
      return width >= 600 ? 'tablet' : 'mobile';
    }
    return 'desktop';
  }

  // Fallback – regex on UA
  const tabletRegex = /Android(?!.*Mobile)|Tablet|tablet/i;
  const mobileRegex =
    /Android.*Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile Safari/i;

  if (tabletRegex.test(ua)) return 'tablet';
  if (mobileRegex.test(ua)) {
    return width >= 600 ? 'tablet' : 'mobile';
  }

  return 'desktop';
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Collect device / browser information available in the browser context.
 *
 * @returns {{
 *   osVersion:    string,
 *   appVersion:   string,
 *   buildVersion: string,
 *   device:       string,
 *   deviceBrand:  string,
 *   deviceType:   "mobile"|"tablet"|"desktop"
 * }}
 */
export const getDeviceInfo = () => {
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';

  // Resolve deviceType first – parseBrand needs it to skip desktop brand guessing.
  const deviceType = parseDeviceType(ua);

  // appVersion  = browser name + version  (e.g. "Chrome 123.0", "Firefox 124.0")
  // buildVersion = same value; if a separate build ID is configured via env var, use that.
  const appVersion = parseBrowserVersion(ua);
  const buildVersion = process.env.REACT_APP_BUILD_VERSION || appVersion;

  return {
    osVersion: parseOsVersion(ua),
    appVersion,
    buildVersion,
    device: parseDevice(ua),
    deviceBrand: parseBrand(ua, deviceType),
    deviceType
  };
};
