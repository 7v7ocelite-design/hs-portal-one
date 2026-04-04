import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/* ═══════════════════════════════════════
   SEARCH-BASED COACH VERIFICATION API

   Uses Google search to verify coaches are
   still at their listed schools and finds
   updated Twitter/contact info.
   ═══════════════════════════════════════ */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface VerificationResult {
  coach_id: number
  coach_name: string
  school: string
  title: string
  status: 'verified' | 'changed' | 'not_found' | 'error'
  confidence: number // 0-100
  findings: string
  suggested_title?: string
  suggested_twitter?: string
  suggested_email?: string
  search_source?: string
}

// POST /api/scouts/search-verify
// Body: { coach_ids: number[] } or { school: string } or { limit: number, offset: number }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coach_ids, school, limit = 5, offset = 0 } = body

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Fetch coaches to verify
    let query = supabase.from('tier1_coaches').select('*')

    if (coach_ids?.length) {
      query = query.in('id', coach_ids)
    } else if (school) {
      query = query.eq('school', school)
    } else {
      query = query.range(offset, offset + limit - 1).order('school')
    }

    const { data: coaches, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!coaches?.length) {
      return NextResponse.json({ error: 'No coaches found' }, { status: 404 })
    }

    // For each coach, build a verification prompt
    // We return the search queries and expected data format
    // The actual verification will be done client-side or via a separate call
    const verificationTasks = coaches.map((coach) => ({
      coach_id: coach.id,
      coach_name: `${coach.first_name} ${coach.last_name}`,
      school: coach.school,
      title: coach.title,
      division: coach.division,
      conference: coach.conference,
      state: coach.state,
      current_email: coach.email,
      current_twitter: coach.twitter,
      current_phone: coach.phone,
      search_queries: [
        `"${coach.first_name} ${coach.last_name}" "${coach.school}" football coach 2026`,
        `"${coach.first_name} ${coach.last_name}" football coach Twitter`,
        `${coach.school} football coaching staff directory 2026`,
      ],
    }))

    return NextResponse.json({
      tasks: verificationTasks,
      count: verificationTasks.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process verification request', details: String(err) },
      { status: 500 }
    )
  }
}

// PUT /api/scouts/search-verify
// Body: { updates: Array<{ coach_id, twitter?, email?, title?, verified: boolean }> }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { updates } = body

    if (!updates?.length) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const results: Array<{ coach_id: number; success: boolean; error?: string }> = []

    for (const update of updates) {
      const { coach_id, twitter, email, phone, title } = update

      // Build update object - only include non-null fields
      const updateData: Record<string, string> = {}
      if (twitter !== undefined && twitter !== null) updateData.twitter = twitter
      if (email !== undefined && email !== null) updateData.email = email
      if (phone !== undefined && phone !== null) updateData.phone = phone
      if (title !== undefined && title !== null) updateData.title = title

      if (Object.keys(updateData).length === 0) {
        results.push({ coach_id, success: true })
        continue
      }

      // Update the coaches table (not the view)
      const { error } = await supabase
        .from('coaches')
        .update(updateData)
        .eq('id', coach_id)

      if (error) {
        results.push({ coach_id, success: false, error: error.message })
      } else {
        results.push({ coach_id, success: true })
      }
    }

    return NextResponse.json({
      updated: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process updates', details: String(err) },
      { status: 500 }
    )
  }
}
