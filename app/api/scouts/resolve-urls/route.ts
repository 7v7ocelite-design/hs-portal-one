import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveStaffUrl, updateSeasonInUrl, needsSeasonUpdate } from "@/lib/utils/url-resolver";

/**
 * POST: Auto-discover staff URLs for programs missing them
 * GET: Update seasonal URLs to current season
 */

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { program_id, limit = 10 } = body;

  const supabase = createAdminClient();

  try {
    if (program_id) {
      // Resolve URL for a single program
      const { data: program } = await supabase
        .from("college_programs")
        .select("id, name, athletics_url, staff_url")
        .eq("id", program_id)
        .single();

      if (!program) {
        return NextResponse.json({ error: "Program not found" }, { status: 404 });
      }

      const resolved = await resolveStaffUrl(
        program.athletics_url || `https://${program.name.toLowerCase().replace(/\s+/g, "")}.com`,
        program.staff_url || undefined
      );

      if (resolved) {
        await supabase
          .from("college_programs")
          .update({ staff_url: resolved.url })
          .eq("id", program.id);

        return NextResponse.json({
          program: program.name,
          resolved: resolved.url,
          pattern: resolved.pattern,
          requiresSeasonUpdate: resolved.requiresSeasonUpdate,
        });
      }

      return NextResponse.json({
        program: program.name,
        resolved: null,
        error: "Could not auto-discover staff URL",
      });
    }

    // Resolve URLs for programs missing staff_url
    const { data: programs } = await supabase
      .from("college_programs")
      .select("id, name, athletics_url, staff_url")
      .is("staff_url", null)
      .eq("is_active", true)
      .limit(limit);

    const results = [];
    for (const program of programs || []) {
      const resolved = await resolveStaffUrl(
        program.athletics_url || `https://${program.name.toLowerCase().replace(/\s+/g, "")}.com`
      );

      if (resolved) {
        await supabase
          .from("college_programs")
          .update({ staff_url: resolved.url })
          .eq("id", program.id);

        results.push({
          program: program.name,
          resolved: resolved.url,
          pattern: resolved.pattern,
        });
      } else {
        results.push({
          program: program.name,
          resolved: null,
          error: "Could not auto-discover",
        });
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 1000));
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: "Resolution failed", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();

  try {
    // Find all programs with seasonal URLs that need updating
    const { data: programs } = await supabase
      .from("college_programs")
      .select("id, name, staff_url")
      .not("staff_url", "is", null)
      .eq("is_active", true);

    const updates = [];
    for (const program of programs || []) {
      if (program.staff_url && needsSeasonUpdate(program.staff_url)) {
        const newUrl = updateSeasonInUrl(program.staff_url);

        await supabase
          .from("college_programs")
          .update({ staff_url: newUrl })
          .eq("id", program.id);

        updates.push({
          program: program.name,
          oldUrl: program.staff_url,
          newUrl,
        });
      }
    }

    return NextResponse.json({
      message: `Updated ${updates.length} seasonal URLs`,
      updates,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed", details: String(error) },
      { status: 500 }
    );
  }
}
