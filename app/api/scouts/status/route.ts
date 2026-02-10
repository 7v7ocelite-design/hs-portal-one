import { NextResponse } from "next/server";
import { getCurrentPeriod, getRecruitingStatus } from "@/lib/utils/recruiting-calendar";
import { getCurrentSeason } from "@/lib/utils/url-resolver";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/scouts/status
 * Returns current recruiting period status and scraping metrics
 */
export async function GET() {
  const supabase = createAdminClient();

  // Get current period info
  const periodInfo = getCurrentPeriod();
  const status = getRecruitingStatus();
  const season = getCurrentSeason();

  // Get program verification stats
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { count: totalPrograms } = await supabase
    .from("college_programs")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: verifiedToday } = await supabase
    .from("college_programs")
    .select("*", { count: "exact", head: true })
    .gte("last_verified_at", oneDayAgo);

  const { count: verifiedThisWeek } = await supabase
    .from("college_programs")
    .select("*", { count: "exact", head: true })
    .gte("last_verified_at", oneWeekAgo);

  const { count: needsVerification } = await supabase
    .from("college_programs")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .or(`last_verified_at.is.null,last_verified_at.lt.${oneWeekAgo}`);

  // Get recent staff changes
  const { data: recentChanges } = await supabase
    .from("staff_changes")
    .select("id, coach_name, change_type, announced_date")
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    recruitingCalendar: {
      season,
      currentPeriod: status.period,
      activityLevel: status.activity,
      nextEvent: status.nextEvent,
      scrapeMultiplier: periodInfo.scrapeMultiplier,
      description: periodInfo.description,
    },
    programStats: {
      total: totalPrograms || 0,
      verifiedToday: verifiedToday || 0,
      verifiedThisWeek: verifiedThisWeek || 0,
      needsVerification: needsVerification || 0,
    },
    recentStaffChanges: recentChanges || [],
    timestamp: now.toISOString(),
  });
}
