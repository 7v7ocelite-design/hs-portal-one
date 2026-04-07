import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/* ═══════════════════════════════════════════════════════
   AUTO-IMPORT ENRICHMENT API

   POST: Accepts batch of coach enrichment data from web
   search results, fuzzy-matches against tier1_coaches,
   and writes Twitter handles to coaches table.
   ═══════════════════════════════════════════════════════ */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

interface EnrichmentEntry {
  first_name: string
  last_name: string
  title: string
  twitter_handle: string | null
  confidence: 'high' | 'medium' | 'low'
}

interface MatchResult {
  enrichment_name: string
  enrichment_twitter: string | null
  confidence: string
  matched_coach_id: number | null
  matched_coach_name: string | null
  matched_school: string | null
  current_twitter: string | null
  action: 'update' | 'skip_has_twitter' | 'skip_no_handle' | 'no_match'
}

// Normalize names for fuzzy matching
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z]/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { school, coaches: enrichmentData, apply = false } = body

    if (!school || !enrichmentData?.length) {
      return NextResponse.json(
        { error: 'school and coaches[] are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    // Fetch all coaches at this school from tier1_coaches
    const { data: dbCoaches, error } = await supabase
      .from('tier1_coaches')
      .select('id, first_name, last_name, title, twitter, email, school')
      .ilike('school', `%${school}%`)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Match enrichment data to DB coaches
    const results: MatchResult[] = []
    const updates: Array<{ id: number; twitter: string }> = []

    for (const entry of enrichmentData as EnrichmentEntry[]) {
      const enrichName = `${entry.first_name} ${entry.last_name}`
      const normFirst = normalize(entry.first_name)
      const normLast = normalize(entry.last_name)

      // Find matching coach in DB
      const match = dbCoaches?.find((c) => {
        const dbFirst = normalize(c.first_name)
        const dbLast = normalize(c.last_name)
        // Exact match on last name, flexible on first name
        return dbLast === normLast && (
          dbFirst === normFirst ||
          dbFirst.startsWith(normFirst) ||
          normFirst.startsWith(dbFirst)
        )
      })

      if (!match) {
        results.push({
          enrichment_name: enrichName,
          enrichment_twitter: entry.twitter_handle,
          confidence: entry.confidence,
          matched_coach_id: null,
          matched_coach_name: null,
          matched_school: null,
          current_twitter: null,
          action: 'no_match',
        })
        continue
      }

      const matchedName = `${match.first_name} ${match.last_name}`

      if (!entry.twitter_handle) {
        results.push({
          enrichment_name: enrichName,
          enrichment_twitter: null,
          confidence: entry.confidence,
          matched_coach_id: match.id,
          matched_coach_name: matchedName,
          matched_school: match.school,
          current_twitter: match.twitter,
          action: 'skip_no_handle',
        })
        continue
      }

      if (match.twitter) {
        results.push({
          enrichment_name: enrichName,
          enrichment_twitter: entry.twitter_handle,
          confidence: entry.confidence,
          matched_coach_id: match.id,
          matched_coach_name: matchedName,
          matched_school: match.school,
          current_twitter: match.twitter,
          action: 'skip_has_twitter',
        })
        continue
      }

      // Coach exists, no twitter, we have a handle → update
      results.push({
        enrichment_name: enrichName,
        enrichment_twitter: entry.twitter_handle,
        confidence: entry.confidence,
        matched_coach_id: match.id,
        matched_coach_name: matchedName,
        matched_school: match.school,
        current_twitter: null,
        action: 'update',
      })

      updates.push({
        id: match.id,
        twitter: entry.twitter_handle.replace('@', ''),
      })
    }

    // Apply updates if requested
    let applied = 0
    if (apply && updates.length > 0) {
      for (const u of updates) {
        const { error: updateError } = await supabase
          .from('coaches')
          .update({ twitter: u.twitter })
          .eq('id', u.id)

        if (!updateError) applied++
      }
    }

    return NextResponse.json({
      school,
      total_enrichment: enrichmentData.length,
      total_db_coaches: dbCoaches?.length || 0,
      matched: results.filter((r) => r.action !== 'no_match').length,
      to_update: updates.length,
      applied,
      results,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Import failed', details: String(err) },
      { status: 500 }
    )
  }
}
