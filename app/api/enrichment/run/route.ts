import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/* ═══════════════════════════════════════════════════
   COACH ENRICHMENT API

   POST: Fetches a batch of coaches and returns
         search queries + current data gaps.

   PUT: Accepts enrichment results and writes
        updates to the coaches table in Supabase.
   ═══════════════════════════════════════════════════ */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

interface CoachRow {
  id: number
  first_name: string
  last_name: string
  school: string
  title: string
  division: string
  conference: string | null
  state: string | null
  email: string | null
  twitter: string | null
  phone: string | null
}

// POST — Get a batch of coaches needing enrichment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      school,
      missingTwitterOnly = false,
      missingEmailOnly = false,
      limit = 20,
      offset = 0,
    } = body

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    let query = supabase.from('tier1_coaches').select('*')

    if (school) {
      query = query.ilike('school', `%${school}%`)
    }

    if (missingTwitterOnly) {
      query = query.is('twitter', null)
    }

    if (missingEmailOnly) {
      query = query.is('email', null)
    }

    query = query.range(offset, offset + limit - 1).order('school')

    const { data: coaches, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const batch = (coaches || []).map((c: CoachRow) => ({
      id: c.id,
      first_name: c.first_name,
      last_name: c.last_name,
      full_name: `${c.first_name} ${c.last_name}`,
      school: c.school,
      title: c.title,
      division: c.division,
      conference: c.conference,
      state: c.state,
      has_email: !!c.email,
      has_twitter: !!c.twitter,
      has_phone: !!c.phone,
      current_email: c.email,
      current_twitter: c.twitter,
    }))

    // Stats
    const stats = {
      total: batch.length,
      missing_twitter: batch.filter((c) => !c.has_twitter).length,
      missing_email: batch.filter((c) => !c.has_email).length,
      missing_phone: batch.filter((c) => !c.has_phone).length,
    }

    return NextResponse.json({ coaches: batch, stats })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch enrichment batch', details: String(err) },
      { status: 500 }
    )
  }
}

// PUT — Write enrichment updates back to Supabase
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { updates } = body

    if (!updates?.length) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const results: Array<{ id: number; success: boolean; error?: string }> = []

    for (const update of updates) {
      const { id, twitter, email, phone, title, verified_at } = update

      const updateData: Record<string, string> = {}
      if (twitter) updateData.twitter = twitter.replace('@', '')
      if (email) updateData.email = email
      if (phone) updateData.phone = phone
      if (title) updateData.title = title
      if (verified_at) updateData.verified_at = verified_at

      if (Object.keys(updateData).length === 0) {
        results.push({ id, success: true })
        continue
      }

      const { error } = await supabase
        .from('coaches')
        .update(updateData)
        .eq('id', id)

      results.push({
        id,
        success: !error,
        error: error?.message,
      })
    }

    return NextResponse.json({
      updated: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to write updates', details: String(err) },
      { status: 500 }
    )
  }
}
