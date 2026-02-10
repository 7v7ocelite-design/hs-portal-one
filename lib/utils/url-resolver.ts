/**
 * URL Resolver for dynamic athletics websites
 * Handles season-specific URLs, redirects, and common patterns
 */

// Current season calculation (academic year format: 2026-27)
// For recruiting, we look at the UPCOMING season
export function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // After January, we're recruiting for the upcoming fall season
  // So Feb 2026 → 2026-27 (the fall 2026 season)
  if (month >= 1) {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    // January: still wrapping up previous season
    return `${year - 1}-${year.toString().slice(-2)}`;
  }
}

// Common URL patterns for athletics sites
const URL_PATTERNS = {
  // Standard patterns
  standard: [
    "/sports/football/coaches",
    "/sports/fb/coaches",
    "/staff-directory/football",
    "/staff-directory/sports/football",
  ],

  // Season-specific patterns
  seasonal: [
    "/sports/football/coaches/{season}",
    "/sports/fb/coaches/{season}",
    "/sports/football/roster/{season}/coaches",
  ],

  // Alternative patterns
  alternative: [
    "/football/coaches",
    "/team/football/coaches",
    "/athletics/football/coaches",
  ],
};

export interface ResolvedUrl {
  url: string;
  pattern: string;
  requiresSeasonUpdate: boolean;
}

/**
 * Try to resolve the best working URL for a program's staff page
 */
export async function resolveStaffUrl(
  baseUrl: string,
  knownUrl?: string
): Promise<ResolvedUrl | null> {
  const season = getCurrentSeason();

  // If we have a known URL, try it first
  if (knownUrl) {
    const resolvedKnown = await tryUrl(knownUrl, season);
    if (resolvedKnown) {
      return {
        url: resolvedKnown,
        pattern: "known",
        requiresSeasonUpdate: knownUrl.includes("{season}") || /\d{4}-\d{2}/.test(knownUrl),
      };
    }
  }

  // Extract base domain
  const domain = new URL(baseUrl).origin;

  // Try standard patterns first
  for (const pattern of URL_PATTERNS.standard) {
    const testUrl = `${domain}${pattern}`;
    const result = await tryUrl(testUrl, season);
    if (result) {
      return { url: result, pattern, requiresSeasonUpdate: false };
    }
  }

  // Try seasonal patterns
  for (const pattern of URL_PATTERNS.seasonal) {
    const testUrl = `${domain}${pattern.replace("{season}", season)}`;
    const result = await tryUrl(testUrl, season);
    if (result) {
      return { url: testUrl, pattern, requiresSeasonUpdate: true };
    }
  }

  // Try alternative patterns
  for (const pattern of URL_PATTERNS.alternative) {
    const testUrl = `${domain}${pattern}`;
    const result = await tryUrl(testUrl, season);
    if (result) {
      return { url: result, pattern, requiresSeasonUpdate: false };
    }
  }

  return null;
}

/**
 * Try a URL and follow redirects, return final URL if valid
 */
async function tryUrl(url: string, season: string): Promise<string | null> {
  try {
    // Replace season placeholder if present
    const testUrl = url.replace("{season}", season);

    const response = await fetch(testUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": "HSPortalOne/1.0 (URL Resolver)",
      },
      redirect: "follow",
    });

    if (response.ok) {
      // Return the final URL after redirects
      return response.url;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Update a seasonal URL to the current season
 */
export function updateSeasonInUrl(url: string): string {
  const season = getCurrentSeason();

  // Match patterns like 2024-25, 2025-26, etc.
  const seasonPattern = /\d{4}-\d{2}/g;

  if (seasonPattern.test(url)) {
    return url.replace(seasonPattern, season);
  }

  return url;
}

/**
 * Check if a URL needs seasonal update
 */
export function needsSeasonUpdate(url: string): boolean {
  const currentSeason = getCurrentSeason();
  const seasonPattern = /(\d{4})-(\d{2})/;
  const match = url.match(seasonPattern);

  if (!match) return false;

  const urlSeason = `${match[1]}-${match[2]}`;
  return urlSeason !== currentSeason;
}
