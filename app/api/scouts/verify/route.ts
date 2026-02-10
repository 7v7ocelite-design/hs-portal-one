import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractCoachesFromHTML, ExtractedCoach } from "@/lib/anthropic";
import { updateSeasonInUrl, needsSeasonUpdate } from "@/lib/utils/url-resolver";
import { getCurrentPeriod, shouldSkipScraping, getAdjustedInterval } from "@/lib/utils/recruiting-calendar";

// Tier thresholds (hours since last verification)
const TIER_THRESHOLDS = {
  1: 24, // Daily
  2: 72, // Every 3 days
  3: 168, // Weekly
};

// Rate limiting - be respectful
const DELAY_BETWEEN_SCHOOLS_MS = 2000;

interface Program {
  id: string;
  name: string;
  staff_url: string | null;
  athletics_url: string | null;
  priority_tier: number;
  last_verified_at: string | null;
}

interface ExistingCoach {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  is_active: boolean;
  program_id: string | null;
}

export async function GET(request: NextRequest) {
  // Check for cron secret (Vercel cron jobs send this)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Allow if it's a cron job or manual trigger with API key
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Check if manual trigger with admin key
    const apiKey = request.nextUrl.searchParams.get("key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const tier = parseInt(request.nextUrl.searchParams.get("tier") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

  try {
    const result = await verifyPrograms(tier, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed", details: String(error) },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const tier = body.tier || 1;
  const limit = body.limit || 10;
  const programId = body.program_id; // Optional: verify single program

  try {
    if (programId) {
      const result = await verifySingleProgram(programId);
      return NextResponse.json(result);
    }
    const result = await verifyPrograms(tier, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed", details: String(error) },
      { status: 500 }
    );
  }
}

async function verifyPrograms(tier: number, limit: number) {
  const supabase = createAdminClient();

  // Check recruiting calendar - skip during deep dead periods
  const periodInfo = getCurrentPeriod();
  if (shouldSkipScraping()) {
    return {
      message: `Skipping scrape - ${periodInfo.name} (${periodInfo.description})`,
      verified: 0,
      changes: [],
      period: periodInfo,
    };
  }

  // Adjust threshold based on recruiting calendar
  const baseThresholdHours = TIER_THRESHOLDS[tier as keyof typeof TIER_THRESHOLDS] || 24;
  const thresholdHours = getAdjustedInterval(baseThresholdHours);
  const cutoffDate = new Date(Date.now() - thresholdHours * 60 * 60 * 1000).toISOString();

  // Get programs that need verification
  const { data: programs, error: fetchError } = await supabase
    .from("college_programs")
    .select("id, name, staff_url, athletics_url, priority_tier, last_verified_at")
    .eq("is_active", true)
    .eq("priority_tier", tier)
    .not("staff_url", "is", null)
    .or(`last_verified_at.is.null,last_verified_at.lt.${cutoffDate}`)
    .order("last_verified_at", { ascending: true, nullsFirst: true })
    .limit(limit);

  if (fetchError) {
    throw new Error(`Failed to fetch programs: ${fetchError.message}`);
  }

  if (!programs || programs.length === 0) {
    return {
      message: `No Tier ${tier} programs need verification`,
      verified: 0,
      changes: [],
      period: periodInfo,
    };
  }

  const results = {
    verified: 0,
    changes: [] as Array<{
      program: string;
      added: number;
      removed: number;
      updated: number;
    }>,
    errors: [] as string[],
    period: periodInfo,
    adjustedThresholdHours: thresholdHours,
  };

  for (const program of programs as Program[]) {
    try {
      const changes = await verifyProgramStaff(supabase, program);
      results.verified++;
      if (changes.added > 0 || changes.removed > 0 || changes.updated > 0) {
        results.changes.push({
          program: program.name,
          ...changes,
        });
      }
      // Rate limiting
      await sleep(DELAY_BETWEEN_SCHOOLS_MS);
    } catch (error) {
      results.errors.push(`${program.name}: ${String(error)}`);
    }
  }

  return results;
}

async function verifySingleProgram(programId: string) {
  const supabase = createAdminClient();

  const { data: program, error } = await supabase
    .from("college_programs")
    .select("id, name, staff_url, athletics_url, priority_tier, last_verified_at")
    .eq("id", programId)
    .single();

  if (error || !program) {
    throw new Error(`Program not found: ${programId}`);
  }

  const changes = await verifyProgramStaff(supabase, program as Program);

  return {
    program: program.name,
    ...changes,
  };
}

async function verifyProgramStaff(
  supabase: ReturnType<typeof createAdminClient>,
  program: Program
) {
  if (!program.staff_url) {
    throw new Error("No staff URL configured");
  }

  // Check if URL needs season update (e.g., 2024-25 → 2025-26)
  let staffUrl = program.staff_url;
  if (needsSeasonUpdate(staffUrl)) {
    staffUrl = updateSeasonInUrl(staffUrl);

    // Update the URL in the database for next time
    await supabase
      .from("college_programs")
      .update({ staff_url: staffUrl })
      .eq("id", program.id);
  }

  // Fetch the staff page
  const html = await fetchPage(staffUrl);
  if (!html) {
    throw new Error("Failed to fetch staff page");
  }

  // Extract coaches using Claude
  const extractedCoaches = await extractCoachesFromHTML(html, program.name);

  // Get existing coaches from DB
  const { data: existingCoaches } = await supabase
    .from("coaches")
    .select("id, first_name, last_name, title, is_active")
    .eq("program_id", program.id);

  const existing = (existingCoaches || []) as ExistingCoach[];

  // Compare and sync
  const changes = await syncCoaches(supabase, program.id, extractedCoaches, existing);

  // Update program verification timestamp
  await supabase
    .from("college_programs")
    .update({
      last_verified_at: new Date().toISOString(),
      verification_source: "robot_scouts",
      staff_last_scraped_at: new Date().toISOString(),
    })
    .eq("id", program.id);

  return changes;
}

async function syncCoaches(
  supabase: ReturnType<typeof createAdminClient>,
  programId: string,
  extracted: ExtractedCoach[],
  existing: ExistingCoach[]
) {
  let added = 0;
  let removed = 0;
  let updated = 0;

  // Create lookup for existing coaches
  const existingMap = new Map(
    existing.map((c) => [`${c.first_name.toLowerCase()}-${c.last_name.toLowerCase()}`, c])
  );

  const extractedNames = new Set<string>();

  for (const coach of extracted) {
    const key = `${coach.first_name.toLowerCase()}-${coach.last_name.toLowerCase()}`;
    extractedNames.add(key);

    const existingCoach = existingMap.get(key);

    if (!existingCoach) {
      // New coach - insert
      await supabase.from("coaches").insert({
        program_id: programId,
        first_name: coach.first_name,
        last_name: coach.last_name,
        title: coach.title,
        position_group: coach.position_group || null,
        is_recruiting_coordinator: coach.is_recruiting_coordinator || false,
        is_active: true,
        last_verified_at: new Date().toISOString(),
        verification_source: "robot_scouts",
      });

      // Log staff change
      await logStaffChange(supabase, {
        coach_name: `${coach.first_name} ${coach.last_name}`,
        change_type: "hire",
        to_program_id: programId,
        to_title: coach.title,
      });

      added++;
    } else if (existingCoach.title !== coach.title || !existingCoach.is_active) {
      // Title changed or reactivated
      const wasInactive = !existingCoach.is_active;

      await supabase
        .from("coaches")
        .update({
          title: coach.title,
          position_group: coach.position_group || null,
          is_recruiting_coordinator: coach.is_recruiting_coordinator || false,
          is_active: true,
          last_verified_at: new Date().toISOString(),
          verification_source: "robot_scouts",
        })
        .eq("id", existingCoach.id);

      if (wasInactive) {
        await logStaffChange(supabase, {
          coach_id: existingCoach.id,
          coach_name: `${coach.first_name} ${coach.last_name}`,
          change_type: "hire",
          to_program_id: programId,
          to_title: coach.title,
        });
      } else if (existingCoach.title !== coach.title) {
        await logStaffChange(supabase, {
          coach_id: existingCoach.id,
          coach_name: `${coach.first_name} ${coach.last_name}`,
          change_type: "title_change",
          from_program_id: programId,
          from_title: existingCoach.title,
          to_program_id: programId,
          to_title: coach.title,
        });
      }

      updated++;
    }
  }

  // Mark coaches no longer on staff as inactive
  for (const [key, coach] of existingMap) {
    if (!extractedNames.has(key) && coach.is_active) {
      await supabase
        .from("coaches")
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", coach.id);

      await logStaffChange(supabase, {
        coach_id: coach.id,
        coach_name: `${coach.first_name} ${coach.last_name}`,
        change_type: "departure",
        from_program_id: programId,
        from_title: coach.title,
      });

      removed++;
    }
  }

  return { added, removed, updated };
}

async function logStaffChange(
  supabase: ReturnType<typeof createAdminClient>,
  change: {
    coach_id?: string;
    coach_name: string;
    change_type: "hire" | "departure" | "promotion" | "title_change";
    from_program_id?: string;
    from_title?: string;
    to_program_id?: string;
    to_title?: string;
  }
) {
  await supabase.from("staff_changes").insert({
    ...change,
    announced_date: new Date().toISOString().split("T")[0],
    source: "robot_scouts",
  });
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "HSPortalOne/1.0 (Recruiting Research; contact@hsportalone.com)",
        Accept: "text/html",
      },
      next: { revalidate: 0 }, // No caching
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
