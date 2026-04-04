#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   COACH ENRICHMENT SCRIPT

   Uses web search to verify coaches and find Twitter/X handles.
   Outputs a JSON file with updates ready to push to Supabase.

   Usage: npx tsx scripts/enrich-coaches.ts [--school "Alabama"] [--limit 10] [--dry-run]
   ═══════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// ── Config ──────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jilvjnqnihseykwzvpzp.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

interface Coach {
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

interface EnrichmentResult {
  coach_id: number
  coach_name: string
  school: string
  current_title: string
  verified: boolean
  confidence: 'high' | 'medium' | 'low'
  found_title?: string
  found_twitter?: string
  found_email?: string
  notes: string
  search_url?: string
}

// ── Parse CLI args ──────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2)
  const opts: { school?: string; limit: number; dryRun: boolean; offset: number } = {
    limit: 10,
    dryRun: false,
    offset: 0,
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--school' && args[i + 1]) opts.school = args[++i]
    if (args[i] === '--limit' && args[i + 1]) opts.limit = parseInt(args[++i])
    if (args[i] === '--offset' && args[i + 1]) opts.offset = parseInt(args[++i])
    if (args[i] === '--dry-run') opts.dryRun = true
  }

  return opts
}

// ── Fetch coaches from Supabase ─────────────────────────
async function fetchCoaches(opts: ReturnType<typeof parseArgs>): Promise<Coach[]> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  let query = supabase.from('tier1_coaches').select('*')

  if (opts.school) {
    query = query.ilike('school', `%${opts.school}%`)
  }

  query = query
    .range(opts.offset, opts.offset + opts.limit - 1)
    .order('school')

  const { data, error } = await query

  if (error) {
    console.error('❌ Supabase error:', error.message)
    process.exit(1)
  }

  return (data || []) as Coach[]
}

// ── Write results ───────────────────────────────────────
function writeResults(results: EnrichmentResult[], filename: string) {
  const outDir = path.join(process.cwd(), 'scripts', 'enrichment-results')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const outPath = path.join(outDir, filename)
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2))
  console.log(`\n📁 Results saved to: ${outPath}`)
  return outPath
}

// ── Main ────────────────────────────────────────────────
async function main() {
  const opts = parseArgs()

  console.log('🏈 Coach Enrichment Script')
  console.log('─'.repeat(50))
  console.log(`School filter: ${opts.school || 'ALL'}`)
  console.log(`Limit: ${opts.limit} | Offset: ${opts.offset}`)
  console.log(`Dry run: ${opts.dryRun}`)
  console.log('─'.repeat(50))

  // 1. Fetch coaches
  console.log('\n📡 Fetching coaches from tier1_coaches...')
  const coaches = await fetchCoaches(opts)
  console.log(`Found ${coaches.length} coaches`)

  if (!coaches.length) {
    console.log('No coaches to process.')
    return
  }

  // 2. Show what we'd search for
  console.log('\n🔍 Coaches to enrich:')
  coaches.forEach((c, i) => {
    const twitter = c.twitter ? `@${c.twitter}` : '❌ no twitter'
    const email = c.email ? '✅ has email' : '❌ no email'
    console.log(`  ${i + 1}. ${c.first_name} ${c.last_name} — ${c.title} @ ${c.school} [${twitter}] [${email}]`)
  })

  // 3. Output the list for manual/automated enrichment
  const results: EnrichmentResult[] = coaches.map((c) => ({
    coach_id: c.id,
    coach_name: `${c.first_name} ${c.last_name}`,
    school: c.school,
    current_title: c.title,
    verified: false,
    confidence: 'low' as const,
    found_twitter: c.twitter || undefined,
    found_email: c.email || undefined,
    notes: 'Awaiting web search verification',
  }))

  // Save the batch file
  const timestamp = new Date().toISOString().slice(0, 10)
  const school = opts.school?.replace(/\s+/g, '-').toLowerCase() || 'batch'
  const filename = `enrich-${school}-${timestamp}.json`
  writeResults(results, filename)

  // Summary
  const noTwitter = coaches.filter((c) => !c.twitter).length
  const noEmail = coaches.filter((c) => !c.email).length
  console.log(`\n📊 Summary:`)
  console.log(`  Total: ${coaches.length}`)
  console.log(`  Missing Twitter: ${noTwitter}`)
  console.log(`  Missing Email: ${noEmail}`)
}

main().catch(console.error)
