/**
 * College Football Recruiting Calendar Logic
 * Adjusts scraping frequency based on NCAA recruiting periods
 *
 * Class of 2027 Timeline (2026 Calendar Year):
 * - Feb-Apr: Quiet Period (Junior Days)
 * - Apr 15 - May 23: Spring Evaluation Period (offers fly)
 * - May 24-27: Dead Period (short reset)
 * - June 1-22: Quiet Period (Official Visit SZN - PEAK activity)
 * - June 23 - July 31: Dead Period (5+ weeks quiet)
 * - August: Dead Period (with 48hr game-day exceptions)
 * - Sept 1+: Contact Period opens (unlimited communication)
 * - Dec 18-20: Early Signing Period
 */

export type RecruitingPeriod =
  | "dead"
  | "quiet"
  | "evaluation"
  | "contact"
  | "early_signing"
  | "portal_window";

export interface PeriodInfo {
  period: RecruitingPeriod;
  name: string;
  scrapeMultiplier: number; // 1 = normal, 0.5 = half, 2 = double
  description: string;
}

// 2026 Calendar - Dead Periods
const DEAD_PERIODS_2026 = [
  { start: new Date("2026-05-24"), end: new Date("2026-05-27") }, // Short reset
  { start: new Date("2026-06-23"), end: new Date("2026-07-31") }, // Big summer dead period
  { start: new Date("2026-08-01"), end: new Date("2026-08-31") }, // August dead (with exceptions)
];

// High Activity Periods
const HIGH_ACTIVITY_2026 = [
  { start: new Date("2026-04-15"), end: new Date("2026-05-23"), period: "evaluation" as RecruitingPeriod }, // Spring Eval
  { start: new Date("2026-06-01"), end: new Date("2026-06-22"), period: "quiet" as RecruitingPeriod },      // Official Visit SZN
  { start: new Date("2026-12-18"), end: new Date("2026-12-20"), period: "early_signing" as RecruitingPeriod }, // Early Signing
];

// Portal Windows (staff changes peak here)
const PORTAL_WINDOWS_2026 = [
  { start: new Date("2025-12-09"), end: new Date("2026-01-15") }, // Winter portal
  { start: new Date("2026-04-16"), end: new Date("2026-04-30") }, // Spring portal
];

/**
 * Get the current recruiting period and scraping priority
 */
export function getCurrentPeriod(date: Date = new Date()): PeriodInfo {
  // Check Early Signing Period first (highest priority)
  for (const period of HIGH_ACTIVITY_2026) {
    if (date >= period.start && date <= period.end && period.period === "early_signing") {
      return {
        period: "early_signing",
        name: "Early Signing Period",
        scrapeMultiplier: 4, // Scrape 4x more frequently
        description: "Commitments and flips happening hourly",
      };
    }
  }

  // Check Portal Windows (staff changes)
  for (const window of PORTAL_WINDOWS_2026) {
    if (date >= window.start && date <= window.end) {
      return {
        period: "portal_window",
        name: "Transfer Portal Window",
        scrapeMultiplier: 2,
        description: "Staff changes and portal activity peak",
      };
    }
  }

  // Check Dead Periods
  for (const dead of DEAD_PERIODS_2026) {
    if (date >= dead.start && date <= dead.end) {
      // Check for August game-day exception (weekends)
      if (date.getMonth() === 7) { // August
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) { // Fri-Sat
          return {
            period: "quiet",
            name: "August Game Day Exception",
            scrapeMultiplier: 1.5,
            description: "48-hour quiet period around home games",
          };
        }
      }
      return {
        period: "dead",
        name: "Dead Period",
        scrapeMultiplier: 0.25, // Scrape 4x less frequently
        description: "No campus visits, minimal news expected",
      };
    }
  }

  // Check High Activity Periods
  for (const period of HIGH_ACTIVITY_2026) {
    if (date >= period.start && date <= period.end) {
      if (period.period === "evaluation") {
        return {
          period: "evaluation",
          name: "Spring Evaluation Period",
          scrapeMultiplier: 2,
          description: "Coaches on the road, offers flying",
        };
      }
      if (period.period === "quiet") {
        return {
          period: "quiet",
          name: "Official Visit Season",
          scrapeMultiplier: 3, // Peak activity
          description: "June visits = commitment waves",
        };
      }
    }
  }

  // September 1+ Contact Period
  if (date.getMonth() >= 8) { // September onwards
    return {
      period: "contact",
      name: "Contact Period",
      scrapeMultiplier: 1.5,
      description: "Unlimited coach-recruit communication",
    };
  }

  // Default: Normal quiet/contact period
  return {
    period: "quiet",
    name: "Quiet Period",
    scrapeMultiplier: 1,
    description: "Normal recruiting activity",
  };
}

/**
 * Calculate adjusted scraping interval based on current period
 */
export function getAdjustedInterval(baseIntervalHours: number): number {
  const { scrapeMultiplier } = getCurrentPeriod();
  // Higher multiplier = more frequent scraping = shorter interval
  return Math.round(baseIntervalHours / scrapeMultiplier);
}

/**
 * Check if we should skip scraping (deep dead period)
 */
export function shouldSkipScraping(): boolean {
  const { period, scrapeMultiplier } = getCurrentPeriod();
  // Only skip if it's a dead period with very low priority
  return period === "dead" && scrapeMultiplier < 0.5;
}

/**
 * Get human-readable status for dashboard display
 */
export function getRecruitingStatus(): {
  period: string;
  activity: "🔴 Dead" | "🟡 Quiet" | "🟢 Active" | "🔥 Peak";
  nextEvent: string;
} {
  const { period, name, scrapeMultiplier } = getCurrentPeriod();
  const now = new Date();

  let activity: "🔴 Dead" | "🟡 Quiet" | "🟢 Active" | "🔥 Peak";
  if (scrapeMultiplier >= 3) activity = "🔥 Peak";
  else if (scrapeMultiplier >= 1.5) activity = "🟢 Active";
  else if (scrapeMultiplier >= 0.5) activity = "🟡 Quiet";
  else activity = "🔴 Dead";

  // Find next significant event
  let nextEvent = "Normal operations";

  // Check upcoming high-activity periods
  for (const period of HIGH_ACTIVITY_2026) {
    if (now < period.start) {
      const daysUntil = Math.ceil((period.start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (period.period === "evaluation") {
        nextEvent = `Spring Evaluation in ${daysUntil} days`;
      } else if (period.period === "quiet" && period.start.getMonth() === 5) {
        nextEvent = `Official Visit SZN in ${daysUntil} days`;
      } else if (period.period === "early_signing") {
        nextEvent = `Early Signing Period in ${daysUntil} days`;
      }
      break;
    }
  }

  return { period: name, activity, nextEvent };
}
