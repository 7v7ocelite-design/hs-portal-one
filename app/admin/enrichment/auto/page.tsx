'use client'

import { useState } from 'react'
import {
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Twitter,
  Zap,
  ArrowRight,
  SkipForward,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════
   AUTO-ENRICHMENT IMPORT

   Loads pre-searched Twitter handle data, matches
   against Supabase coaches, and applies updates.
   ═══════════════════════════════════════════════════ */

// Hardcoded batch 1 data from web search
import enrichmentData from '@/../scripts/enrichment-results/twitter-handles-batch1.json'

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

interface SchoolResult {
  school: string
  total_enrichment: number
  total_db_coaches: number
  matched: number
  to_update: number
  applied: number
  results: MatchResult[]
}

export default function AutoEnrichmentPage() {
  const schools = Object.keys(enrichmentData.results)
  const [processing, setProcessing] = useState(false)
  const [currentSchool, setCurrentSchool] = useState<string | null>(null)
  const [schoolResults, setSchoolResults] = useState<Record<string, SchoolResult>>({})
  const [applyMode, setApplyMode] = useState(false)

  // Preview match for a school (dry run)
  const previewSchool = async (school: string) => {
    setCurrentSchool(school)
    setProcessing(true)
    try {
      const coaches = (enrichmentData.results as Record<string, Array<{
        first_name: string
        last_name: string
        title: string
        twitter_handle: string | null
        confidence: string
      }>>)[school]

      const res = await fetch('/api/enrichment/auto-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school, coaches, apply: false }),
      })
      const data = await res.json()
      setSchoolResults((prev) => ({ ...prev, [school]: data }))
    } catch (err) {
      alert('Error: ' + String(err))
    } finally {
      setProcessing(false)
    }
  }

  // Apply updates for a school
  const applySchool = async (school: string) => {
    setProcessing(true)
    try {
      const coaches = (enrichmentData.results as Record<string, Array<{
        first_name: string
        last_name: string
        title: string
        twitter_handle: string | null
        confidence: string
      }>>)[school]

      const res = await fetch('/api/enrichment/auto-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school, coaches, apply: true }),
      })
      const data = await res.json()
      setSchoolResults((prev) => ({ ...prev, [school]: data }))
    } catch (err) {
      alert('Error: ' + String(err))
    } finally {
      setProcessing(false)
    }
  }

  // Run all schools
  const runAll = async (apply: boolean) => {
    setApplyMode(apply)
    for (const school of schools) {
      setCurrentSchool(school)
      setProcessing(true)
      try {
        const coaches = (enrichmentData.results as Record<string, Array<{
          first_name: string
          last_name: string
          title: string
          twitter_handle: string | null
          confidence: string
        }>>)[school]

        const res = await fetch('/api/enrichment/auto-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ school, coaches, apply }),
        })
        const data = await res.json()
        setSchoolResults((prev) => ({ ...prev, [school]: data }))
      } catch (err) {
        console.error(`Error for ${school}:`, err)
      }
    }
    setProcessing(false)
    setCurrentSchool(null)
  }

  // Stats
  const totalCoachesSearched = Object.values(enrichmentData.results).flat().length
  const totalWithHandle = Object.values(enrichmentData.results)
    .flat()
    .filter((c: { twitter_handle: string | null }) => c.twitter_handle).length

  const totalApplied = Object.values(schoolResults).reduce((sum, r) => sum + (r.applied || 0), 0)
  const totalToUpdate = Object.values(schoolResults).reduce((sum, r) => sum + (r.to_update || 0), 0)

  const actionColor = {
    update: 'text-green-500',
    skip_has_twitter: 'text-[#1da1f2]',
    skip_no_handle: 'text-[#555]',
    no_match: 'text-[#c41e3a]',
  }

  const actionIcon = {
    update: <ArrowRight className="h-3.5 w-3.5" />,
    skip_has_twitter: <CheckCircle className="h-3.5 w-3.5" />,
    skip_no_handle: <SkipForward className="h-3.5 w-3.5" />,
    no_match: <XCircle className="h-3.5 w-3.5" />,
  }

  const actionLabel = {
    update: 'Will Update',
    skip_has_twitter: 'Already Has Twitter',
    skip_no_handle: 'No Handle Found',
    no_match: 'No DB Match',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-[#2a2d35] bg-[#12141a]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-bold italic uppercase tracking-wide">
            <span className="text-[#c41e3a]">Auto</span> Enrichment Import
          </h1>
          <p className="mt-1 text-sm text-[#a0a0a0]">
            {totalCoachesSearched} coaches searched across {schools.length} schools •{' '}
            {totalWithHandle} Twitter handles found
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-5 gap-3">
          {[
            { label: 'Schools', value: schools.length, color: '#3b82f6' },
            { label: 'Coaches Searched', value: totalCoachesSearched, color: '#ffffff' },
            { label: 'Handles Found', value: totalWithHandle, color: '#1da1f2' },
            { label: 'To Update', value: totalToUpdate, color: '#22c55e' },
            { label: 'Applied', value: totalApplied, color: '#c41e3a' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-[#2a2d35] bg-[#12141a] p-3 text-center">
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="mt-0.5 text-[10px] text-[#a0a0a0] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => runAll(false)}
            disabled={processing}
            className="flex items-center gap-2 rounded bg-[#3b82f6] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#2563eb] disabled:opacity-50 transition-colors"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            {processing && !applyMode ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Preview All (Dry Run)
          </button>
          <button
            onClick={() => runAll(true)}
            disabled={processing}
            className="flex items-center gap-2 rounded bg-[#c41e3a] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a01830] disabled:opacity-50 transition-colors"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            {processing && applyMode ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Apply All to Supabase
          </button>
          <a
            href="/admin/enrichment/batch"
            className="ml-auto rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white transition-colors"
          >
            ← Batch Queue
          </a>
        </div>

        {/* School Cards */}
        <div className="space-y-4">
          {schools.map((school) => {
            const coaches = (enrichmentData.results as Record<string, Array<{
              first_name: string
              last_name: string
              title: string
              twitter_handle: string | null
              confidence: string
            }>>)[school]
            const result = schoolResults[school]
            const isProcessing = processing && currentSchool === school

            return (
              <div key={school} className="rounded-lg border border-[#2a2d35] bg-[#12141a]">
                {/* School header */}
                <div className="flex items-center justify-between border-b border-[#2a2d35] px-5 py-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-lg">{school}</h3>
                    <span className="text-xs text-[#a0a0a0]">
                      {coaches.length} coaches • {coaches.filter((c) => c.twitter_handle).length} handles
                    </span>
                    {result && (
                      <span className="rounded bg-green-900/30 px-2 py-0.5 text-xs text-green-400">
                        {result.matched} matched • {result.to_update} to update • {result.applied} applied
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin text-[#c41e3a]" />}
                    {!result && (
                      <button
                        onClick={() => previewSchool(school)}
                        disabled={processing}
                        className="rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-1 text-xs text-[#a0a0a0] hover:text-white disabled:opacity-50 transition-colors"
                      >
                        Preview
                      </button>
                    )}
                    {result && result.to_update > 0 && result.applied === 0 && (
                      <button
                        onClick={() => applySchool(school)}
                        disabled={processing}
                        className="rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        Apply {result.to_update} Updates
                      </button>
                    )}
                    {result && result.applied > 0 && (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle className="h-3.5 w-3.5" /> {result.applied} Applied
                      </span>
                    )}
                  </div>
                </div>

                {/* Results table */}
                {result && (
                  <div className="divide-y divide-[#1a1d24] max-h-[400px] overflow-y-auto">
                    {result.results.map((r, i) => (
                      <div key={i} className="flex items-center gap-4 px-5 py-2 text-sm">
                        <div className={`flex items-center gap-1.5 w-28 ${actionColor[r.action]}`}>
                          {actionIcon[r.action]}
                          <span className="text-xs">{actionLabel[r.action]}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-white">{r.enrichment_name}</span>
                          {r.matched_coach_name && r.matched_coach_name !== r.enrichment_name && (
                            <span className="ml-2 text-xs text-[#555]">→ {r.matched_coach_name}</span>
                          )}
                        </div>
                        <div className="w-40">
                          {r.enrichment_twitter ? (
                            <span className="text-[#1da1f2] text-xs">@{r.enrichment_twitter}</span>
                          ) : (
                            <span className="text-[#333] text-xs">—</span>
                          )}
                        </div>
                        <div className="w-20">
                          <span className={`text-xs ${
                            r.confidence === 'high' ? 'text-green-500' :
                            r.confidence === 'medium' ? 'text-yellow-500' : 'text-[#555]'
                          }`}>
                            {r.confidence}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Compact coach list when no results yet */}
                {!result && (
                  <div className="px-5 py-3 flex flex-wrap gap-2">
                    {coaches.map((c, i) => (
                      <span
                        key={i}
                        className={`rounded px-2 py-0.5 text-xs ${
                          c.twitter_handle
                            ? 'bg-[#1da1f2]/10 text-[#1da1f2]'
                            : 'bg-[#1a1d24] text-[#555]'
                        }`}
                      >
                        {c.first_name} {c.last_name}
                        {c.twitter_handle && <Twitter className="inline h-2.5 w-2.5 ml-1" />}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
