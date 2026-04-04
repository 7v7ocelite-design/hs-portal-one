'use client'

import { useState, useCallback } from 'react'
import { Search, Twitter, Mail, Phone, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, RefreshCw, Download, Upload } from 'lucide-react'

/* ═══════════════════════════════════════════════════
   COACH ENRICHMENT DASHBOARD

   Admin page for verifying coaches and enriching
   their contact data (Twitter, email, phone).
   ═══════════════════════════════════════════════════ */

interface CoachBatch {
  id: number
  first_name: string
  last_name: string
  full_name: string
  school: string
  title: string
  division: string
  conference: string | null
  state: string | null
  has_email: boolean
  has_twitter: boolean
  has_phone: boolean
  current_email: string | null
  current_twitter: string | null
}

interface EnrichmentEdit {
  twitter?: string
  email?: string
  phone?: string
  title?: string
  verified: boolean
}

export default function EnrichmentPage() {
  const [school, setSchool] = useState('')
  const [missingTwitterOnly, setMissingTwitterOnly] = useState(false)
  const [missingEmailOnly, setMissingEmailOnly] = useState(false)
  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)

  const [coaches, setCoaches] = useState<CoachBatch[]>([])
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<string | null>(null)

  // Edits map: coach_id -> field edits
  const [edits, setEdits] = useState<Record<number, EnrichmentEdit>>({})
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Fetch batch
  const fetchBatch = useCallback(async () => {
    setLoading(true)
    setSaveResult(null)
    try {
      const res = await fetch('/api/enrichment/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school: school || undefined,
          missingTwitterOnly,
          missingEmailOnly,
          limit,
          offset,
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
        return
      }
      setCoaches(data.coaches || [])
      setStats(data.stats || null)
      setEdits({})
    } catch (err) {
      alert('Failed to fetch: ' + String(err))
    } finally {
      setLoading(false)
    }
  }, [school, missingTwitterOnly, missingEmailOnly, limit, offset])

  // Update edit for a coach
  const updateEdit = (id: number, field: keyof EnrichmentEdit, value: string | boolean) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  // Save all edits to Supabase
  const saveEdits = async () => {
    const updates = Object.entries(edits)
      .filter(([, edit]) => edit.twitter || edit.email || edit.phone || edit.title)
      .map(([id, edit]) => ({
        id: Number(id),
        twitter: edit.twitter || undefined,
        email: edit.email || undefined,
        phone: edit.phone || undefined,
        title: edit.title || undefined,
        verified_at: edit.verified ? new Date().toISOString() : undefined,
      }))

    if (!updates.length) {
      setSaveResult('No changes to save.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/enrichment/run', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      const data = await res.json()
      setSaveResult(`✅ Updated ${data.updated} coaches. ${data.failed ? `❌ ${data.failed} failed.` : ''}`)
    } catch (err) {
      setSaveResult('❌ Save failed: ' + String(err))
    } finally {
      setSaving(false)
    }
  }

  // Export current batch + edits as JSON
  const exportBatch = () => {
    const exportData = coaches.map((c) => ({
      ...c,
      edits: edits[c.id] || {},
    }))
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enrichment-${school || 'batch'}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import edits from JSON
  const importEdits = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const data = JSON.parse(text)
        const newEdits: Record<number, EnrichmentEdit> = {}
        for (const item of data) {
          if (item.id && item.edits) {
            newEdits[item.id] = item.edits
          }
        }
        setEdits((prev) => ({ ...prev, ...newEdits }))
      } catch {
        alert('Invalid JSON file')
      }
    }
    input.click()
  }

  const editCount = Object.entries(edits).filter(
    ([, e]) => e.twitter || e.email || e.phone || e.title
  ).length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-[#2a2d35] bg-[#12141a]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-bold italic uppercase tracking-wide">
            <span className="text-[#c41e3a]">Coach</span> Enrichment Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#a0a0a0]">
            Verify coaches, find Twitter handles, update contact info
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Filters */}
        <div className="mb-6 rounded-lg border border-[#2a2d35] bg-[#12141a] p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1 block text-xs text-[#a0a0a0] uppercase tracking-wide">School</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Alabama, Ohio State..."
                className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-[#c41e3a] focus:outline-none"
              />
            </div>
            <div className="min-w-[100px]">
              <label className="mb-1 block text-xs text-[#a0a0a0] uppercase tracking-wide">Limit</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-2 text-sm text-white focus:border-[#c41e3a] focus:outline-none"
              />
            </div>
            <div className="min-w-[100px]">
              <label className="mb-1 block text-xs text-[#a0a0a0] uppercase tracking-wide">Offset</label>
              <input
                type="number"
                value={offset}
                onChange={(e) => setOffset(Number(e.target.value))}
                className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-2 text-sm text-white focus:border-[#c41e3a] focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#a0a0a0] cursor-pointer">
              <input
                type="checkbox"
                checked={missingTwitterOnly}
                onChange={(e) => setMissingTwitterOnly(e.target.checked)}
                className="accent-[#c41e3a]"
              />
              Missing Twitter only
            </label>
            <label className="flex items-center gap-2 text-sm text-[#a0a0a0] cursor-pointer">
              <input
                type="checkbox"
                checked={missingEmailOnly}
                onChange={(e) => setMissingEmailOnly(e.target.checked)}
                className="accent-[#c41e3a]"
              />
              Missing Email only
            </label>
            <button
              onClick={fetchBatch}
              disabled={loading}
              className="flex items-center gap-2 rounded bg-[#c41e3a] px-5 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a01830] disabled:opacity-50 transition-colors"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Pull Batch
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[
              { label: 'Total Coaches', value: stats.total, color: '#3b82f6' },
              { label: 'Missing Twitter', value: stats.missing_twitter, color: '#c41e3a' },
              { label: 'Missing Email', value: stats.missing_email, color: '#eab308' },
              { label: 'Missing Phone', value: stats.missing_phone, color: '#9333ea' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-[#2a2d35] bg-[#12141a] p-4 text-center"
              >
                <div className="text-2xl font-bold" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-[#a0a0a0] uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action Bar */}
        {coaches.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={saveEdits}
                disabled={saving || editCount === 0}
                className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm font-bold uppercase text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Save {editCount} Updates to Supabase
              </button>
              <button
                onClick={exportBatch}
                className="flex items-center gap-2 rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </button>
              <button
                onClick={importEdits}
                className="flex items-center gap-2 rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
              >
                <Upload className="h-4 w-4" />
                Import Edits
              </button>
            </div>
            {saveResult && (
              <span className="text-sm">{saveResult}</span>
            )}
          </div>
        )}

        {/* Coach List */}
        <div className="space-y-2">
          {coaches.map((coach) => {
            const edit = edits[coach.id] || {}
            const isExpanded = expandedId === coach.id
            const hasEdits = edit.twitter || edit.email || edit.phone || edit.title

            return (
              <div
                key={coach.id}
                className={`rounded-lg border bg-[#12141a] transition-colors ${
                  hasEdits ? 'border-green-600/50' : 'border-[#2a2d35]'
                }`}
              >
                {/* Row summary */}
                <div
                  className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-[#1a1d24] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : coach.id)}
                >
                  {/* Status indicators */}
                  <div className="flex items-center gap-2 min-w-[80px]">
                    <Twitter
                      className={`h-4 w-4 ${coach.has_twitter || edit.twitter ? 'text-[#1da1f2]' : 'text-[#333]'}`}
                    />
                    <Mail
                      className={`h-4 w-4 ${coach.has_email || edit.email ? 'text-green-500' : 'text-[#333]'}`}
                    />
                    <Phone
                      className={`h-4 w-4 ${coach.has_phone || edit.phone ? 'text-[#9333ea]' : 'text-[#333]'}`}
                    />
                  </div>

                  {/* Name & school */}
                  <div className="flex-1">
                    <span className="font-bold text-white">
                      {coach.first_name} {coach.last_name}
                    </span>
                    <span className="ml-2 text-sm text-[#a0a0a0]">
                      {coach.title} — {coach.school}
                    </span>
                  </div>

                  {/* Division badge */}
                  <span className="rounded bg-[#1a1d24] px-2 py-0.5 text-xs font-mono text-[#c41e3a]">
                    {coach.division}
                  </span>

                  {/* Expand chevron */}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#555]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#555]" />
                  )}
                </div>

                {/* Expanded edit form */}
                {isExpanded && (
                  <div className="border-t border-[#2a2d35] px-5 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Current data */}
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#a0a0a0]">
                          Current Data
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-[#555]">Twitter:</span>{' '}
                            {coach.current_twitter ? (
                              <a
                                href={`https://x.com/${coach.current_twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1da1f2] hover:underline"
                              >
                                @{coach.current_twitter}
                              </a>
                            ) : (
                              <span className="text-[#c41e3a]">Missing</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[#555]">Email:</span>{' '}
                            {coach.current_email || <span className="text-[#c41e3a]">Missing</span>}
                          </div>
                          <div>
                            <span className="text-[#555]">Title:</span> {coach.title}
                          </div>
                          <div>
                            <span className="text-[#555]">School:</span> {coach.school}
                          </div>
                          <div>
                            <span className="text-[#555]">Conference:</span>{' '}
                            {coach.conference || 'N/A'}
                          </div>
                        </div>

                        {/* Quick search link */}
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(
                            `"${coach.first_name} ${coach.last_name}" "${coach.school}" football coach twitter`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs text-[#3b82f6] hover:underline"
                        >
                          <Search className="h-3 w-3" />
                          Google this coach
                        </a>
                      </div>

                      {/* Edit fields */}
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-green-500">
                          Update Fields
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-xs text-[#a0a0a0]">Twitter Handle</label>
                            <input
                              type="text"
                              placeholder="@handle"
                              value={edit.twitter || ''}
                              onChange={(e) => updateEdit(coach.id, 'twitter', e.target.value)}
                              className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-1.5 text-sm text-white placeholder:text-[#444] focus:border-[#1da1f2] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-[#a0a0a0]">Email</label>
                            <input
                              type="email"
                              placeholder="coach@school.edu"
                              value={edit.email || ''}
                              onChange={(e) => updateEdit(coach.id, 'email', e.target.value)}
                              className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-1.5 text-sm text-white placeholder:text-[#444] focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-[#a0a0a0]">Phone</label>
                            <input
                              type="tel"
                              placeholder="(555) 123-4567"
                              value={edit.phone || ''}
                              onChange={(e) => updateEdit(coach.id, 'phone', e.target.value)}
                              className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-1.5 text-sm text-white placeholder:text-[#444] focus:border-[#9333ea] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-[#a0a0a0]">Updated Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Offensive Coordinator"
                              value={edit.title || ''}
                              onChange={(e) => updateEdit(coach.id, 'title', e.target.value)}
                              className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-1.5 text-sm text-white placeholder:text-[#444] focus:border-[#c41e3a] focus:outline-none"
                            />
                          </div>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={edit.verified || false}
                              onChange={(e) => updateEdit(coach.id, 'verified', e.target.checked)}
                              className="accent-green-500"
                            />
                            <span className="text-green-500">Mark as Verified</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {coaches.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => { setOffset(Math.max(0, offset - limit)); fetchBatch() }}
              disabled={offset === 0}
              className="rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2 text-sm text-[#a0a0a0] hover:text-white disabled:opacity-30 transition-colors"
            >
              ← Previous
            </button>
            <span className="text-sm text-[#a0a0a0]">
              Showing {offset + 1}–{offset + coaches.length}
            </span>
            <button
              onClick={() => { setOffset(offset + limit); fetchBatch() }}
              disabled={coaches.length < limit}
              className="rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2 text-sm text-[#a0a0a0] hover:text-white disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && coaches.length === 0 && (
          <div className="mt-20 text-center">
            <RefreshCw className="mx-auto h-12 w-12 text-[#2a2d35]" />
            <p className="mt-4 text-lg text-[#a0a0a0]">Pull a batch of coaches to start enriching</p>
            <p className="mt-1 text-sm text-[#555]">
              Filter by school, missing Twitter, or missing email
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
