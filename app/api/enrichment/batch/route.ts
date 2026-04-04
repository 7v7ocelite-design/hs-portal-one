import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/* ═══════════════════════════════════════════════════════
   BATCH ENRICHMENT API

   Processes coaches school-by-school. Returns the full
   coaching staff for a school with enrichment metadata.

   GET  - List all unique schools + enrichment stats
   POST - Get next unenriched school batch
   ═══════════════════════════════════════════════════════ */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// GET — School-level enrichment stats
export async function GET() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    // Get all coaches grouped by school with data gap counts
    const { data: coaches, error } = await supabase
      .from('tier1_coaches')
      .select('school, twitter, email, phone')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Aggregate by school
    const schoolMap = new Map<string, {
      total: number
      has_twitter: number
      has_email: number
      has_phone: number
    }>()

    for (const c of coaches || []) {
      const s = c.school || 'Unknown'
      const existing = schoolMap.get(s) || { total: 0, has_twitter: 0, has_email: 0, has_phone: 0 }
      existing.total++
      if (c.twitter) existing.has_twitter++
      if (c.email) existing.has_email++
      if (c.phone) existing.has_phone++
      schoolMap.set(s, existing)
    }

    const schools = Array.from(schoolMap.entries())
      .map(([school, stats]) => ({
        school,
        ...stats,
        missing_twitter: stats.total - stats.has_twitter,
        missing_email: stats.total - stats.has_email,
        completeness: Math.round(
          ((stats.has_twitter + stats.has_email) / (stats.total * 2)) * 100
        ),
      }))
      .sort((a, b) => a.completeness - b.completeness) // Least complete first

    const totalCoaches = coaches?.length || 0
    const totalWithTwitter = coaches?.filter((c) => c.twitter).length || 0
    const totalWithEmail = coaches?.filter((c) => c.email).length || 0

    return NextResponse.json({
      summary: {
        total_schools: schools.length,
        total_coaches: totalCoaches,
        total_with_twitter: totalWithTwitter,
        total_with_email: totalWithEmail,
        twitter_coverage: Math.round((totalWithTwitter / totalCoaches) * 100),
        email_coverage: Math.round((totalWithEmail / totalCoaches) * 100),
      },
      schools,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to get school stats', details: String(err) },
      { status: 500 }
    )
  }
}

// POST — Get coaches for a specific school (for enrichment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { school, onlyMissing = false } = body

    if (!school) {
      return NextResponse.json({ error: 'school is required' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    let query = supabase
      .from('tier1_coaches')
      .select('*')
      .ilike('school', `%${school}%`)
      .order('title')

    if (onlyMissing) {
      query = query.or('twitter.is.null,email.is.null')
    }

    const { data: coaches, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      school,
      coaches: coaches || [],
      count: coaches?.length || 0,
      missing_twitter: coaches?.filter((c) => !c.twitter).length || 0,
      missing_email: coaches?.filter((c) => !c.email).length || 0,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to get school coaches', details: String(err) },
      { status: 500 }
    )
  }
}
