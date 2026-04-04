'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Download,
  Search,
  Twitter,
  Mail,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════
   BATCH ENRICHMENT - SCHOOL-BY-SCHOOL QUEUE

   Loops through all schools, shows progress,
   and lets you enrich coaches per school.
   ═══════════════════════════════════════════════════ */

interface SchoolStats {
  school: string
  total: number
  has_twitter: number
  has_email: number
  has_phone: number
  missing_twitter: number
  missing_email: number
  completeness: number
}

interface Summary {
  total_schools: number
  total_coaches: number
  total_with_twitter: number
  total_with_email: number
  twitter_coverage: number
  email_coverage: number
}

interface CoachRow {
  id: number
  first_name: string
  last_name: string
  school: string
  title: string
  division: string
  conference: string | null
  email: string | null
  twitter: string | null
  phone: string | null
}

interface EnrichmentUpdate {
  id: number
  twitter?: string
  email?: string
  title?: string
  verified_at?: string
}

type QueueStatus = 'idle' | 'running' | 'paused' | 'done'

export default function BatchEnrichmentPage() {
  // School list & summary
  const [schools, setSchools] = useState<SchoolStats[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)

  // Queue state
  const [queueStatus, setQueueStatus] = useState<QueueStatus>('idle')
  const [currentSchoolIdx, setCurrentSchoolIdx] = useState(0)
  const [currentCoaches, setCurrentCoaches] = useState<CoachRow[]>([])
  const [processedSchools, setProcessedSchools] = useState<Set<string>>(new Set())
  const [enrichmentLog, setEnrichmentLog] = useState<string[]>([])
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null)

  // Edit state for current school's coaches
  const [edits, setEdits] = useState<Record<number, Partial<EnrichmentUpdate>>>({})
  const [saving, setSaving] = useState(false)

  // Search filter
  const [searchFilter, setSearchFilter] = useState('')

  const queueRef = useRef<QueueStatus>('idle')
  const logEndRef = useRef<HTMLDivElement>(null)

  // Filtered schools
  const filteredSchools = schools.filter((s) =>
    s.school.toLowerCase().includes(searchFilter.toLowerCase())
  )

  // Load school stats
  const loadSchools = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/enrichment/batch')
      const data = await res.json()
      if (data.error) {
        addLog(`❌ Error loading schools: ${data.error}`)
        return
      }
      setSchools(data.schools || [])
      setSummary(data.summary || null)
      addLog(`📊 Loaded ${data.summary?.total_schools} schools, ${data.summary?.total_coaches} coaches`)
    } catch (err) {
      addLog(`❌ Failed to load: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSchools()
  }, [loadSchools])

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [enrichmentLog])

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setEnrichmentLog((prev) => [...prev, `[${timestamp}] ${msg}`])
  }

  // Load coaches for a specific school
  const loadSchoolCoaches = async (school: string) => {
    try {
      const res = await fetch('/api/enrichment/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school, onlyMissing: false }),
      })
      const data = await res.json()
      if (data.error) {
        addLog(`❌ ${school}: ${data.error}`)
        return []
      }
      addLog(`🏫 ${school}: ${data.count} coaches (${data.missing_twitter} missing Twitter, ${data.missing_email} missing email)`)
      return data.coaches as CoachRow[]
    } catch (err) {
      addLog(`❌ ${school}: ${String(err)}`)
      return []
    }
  }

  // Save edits for current batch
  const saveCurrentEdits = async () => {
    const updates = Object.entries(edits)
      .filter(([, edit]) => edit.twitter || edit.email || edit.title)
      .map(([id, edit]) => ({
        id: Number(id),
        ...edit,
        verified_at: new Date().toISOString(),
      }))

    if (!updates.length) return

    setSaving(true)
    try {
      const res = await fetch('/api/enrichment/run', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      const data = await res.json()
      addLog(`💾 Saved ${data.updated} updates for current batch`)
    } catch (err) {
      addLog(`❌ Save failed: ${String(err)}`)
    } finally {
      setSaving(false)
      setEdits({})
    }
  }

  // Process next school in queue
  const processNextSchool = async () => {
    if (queueRef.current !== 'running') return
    if (currentSchoolIdx >= filteredSchools.length) {
      setQueueStatus('done')
      queueRef.current = 'done'
      addLog('✅ All schools processed!')
      return
    }

    const school = filteredSchools[currentSchoolIdx]
    addLog(`▶️ Processing: ${school.school}`)

    const coaches = await loadSchoolCoaches(school.school)
    setCurrentCoaches(coaches)
    setExpandedSchool(school.school)

    // Mark as processed
    setProcessedSchools((prev) => new Set([...prev, school.school]))
    setCurrentSchoolIdx((prev) => prev + 1)

    // Pause for user to review/edit before auto-advancing
    setQueueStatus('paused')
    queueRef.current = 'paused'
    addLog(`⏸ Paused at ${school.school} — review coaches, edit, then Resume to continue`)
  }

  // Queue controls
  const startQueue = () => {
    setQueueStatus('running')
    queueRef.current = 'running'
    addLog('🚀 Queue started')
    processNextSchool()
  }

  const resumeQueue = async () => {
    // Save any pending edits first
    await saveCurrentEdits()
    setQueueStatus('running')
    queueRef.current = 'running'
    processNextSchool()
  }

  const pauseQueue = () => {
    setQueueStatus('paused')
    queueRef.current = 'paused'
    addLog('⏸ Queue paused')
  }

  const skipSchool = () => {
    addLog(`⏭ Skipped: ${filteredSchools[currentSchoolIdx - 1]?.school || 'current'}`)
    setCurrentCoaches([])
    setEdits({})
    setQueueStatus('running')
    queueRef.current = 'running'
    processNextSchool()
  }

  const jumpToSchool = async (school: string) => {
    const idx = filteredSchools.findIndex((s) => s.school === school)
    if (idx >= 0) {
      setCurrentSchoolIdx(idx + 1)
      const coaches = await loadSchoolCoaches(school)
      setCurrentCoaches(coaches)
      setExpandedSchool(school)
      setProcessedSchools((prev) => new Set([...prev, school]))
      addLog(`📍 Jumped to: ${school}`)
    }
  }

  // Update edit for a coach
  const updateEdit = (id: number, field: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  // Export full enrichment log
  const exportLog = () => {
    const blob = new Blob([enrichmentLog.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enrichment-log-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const editCount = Object.entries(edits).filter(
    ([, e]) => e.twitter || e.email || e.title
  ).length

  const progressPercent = schools.length
    ? Math.round((processedSchools.size / schools.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-[#2a2d35] bg-[#12141a]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold italic uppercase tracking-wide">
                <span className="text-[#c41e3a]">Batch</span> Enrichment Queue
              </h1>
              <p className="mt-1 text-sm text-[#a0a0a0]">
                Process all {summary?.total_coaches || 0} coaches across{' '}
                {summary?.total_schools || 0} schools
              </p>
            </div>
            <a
              href="/admin/enrichment"
              className="rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
            >
              ← Single Coach Mode
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Global Stats */}
        {summary && (
          <div className="mb-6 grid grid-cols-6 gap-3">
            {[
              { label: 'Schools', value: summary.total_schools, color: '#3b82f6' },
              { label: 'Coaches', value: summary.total_coaches, color: '#ffffff' },
              { label: 'Has Twitter', value: summary.total_with_twitter, color: '#1da1f2' },
              { label: 'Twitter %', value: `${summary.twitter_coverage}%`, color: summary.twitter_coverage > 50 ? '#22c55e' : '#c41e3a' },
              { label: 'Has Email', value: summary.total_with_email, color: '#22c55e' },
              { label: 'Email %', value: `${summary.email_coverage}%`, color: summary.email_coverage > 50 ? '#22c55e' : '#c41e3a' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-[#2a2d35] bg-[#12141a] p-3 text-center">
                <div className="text-xl font-bold" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="mt-0.5 text-[10px] text-[#a0a0a0] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6 rounded-lg border border-[#2a2d35] bg-[#12141a] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#a0a0a0]">
              Queue Progress: {processedSchools.size} / {schools.length} schools
            </span>
            <span className="text-sm font-mono text-[#c41e3a]">{progressPercent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#1a1d24]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#c41e3a] to-[#ff4444] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Queue Controls */}
        <div className="mb-6 flex items-center gap-3">
          {queueStatus === 'idle' && (
            <button
              onClick={startQueue}
              disabled={loading || schools.length === 0}
              className="flex items-center gap-2 rounded bg-[#c41e3a] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a01830] disabled:opacity-50 transition-colors"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              <Play className="h-4 w-4" /> Start Queue
            </button>
          )}
          {queueStatus === 'paused' && (
            <>
              <button
                onClick={resumeQueue}
                className="flex items-center gap-2 rounded bg-green-600 px-5 py-2.5 text-sm font-bold uppercase text-white hover:bg-green-700 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {editCount > 0 ? `Save ${editCount} & Resume` : 'Resume'}
              </button>
              <button
                onClick={skipSchool}
                className="flex items-center gap-2 rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white transition-colors"
              >
                <SkipForward className="h-4 w-4" /> Skip
              </button>
            </>
          )}
          {queueStatus === 'running' && (
            <button
              onClick={pauseQueue}
              className="flex items-center gap-2 rounded bg-yellow-600 px-5 py-2.5 text-sm font-bold uppercase text-white hover:bg-yellow-700 transition-colors"
            >
              <Pause className="h-4 w-4" /> Pause
            </button>
          )}
          {queueStatus === 'done' && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="font-bold uppercase">Complete</span>
            </div>
          )}

          <button
            onClick={loadSchools}
            disabled={loading}
            className="flex items-center gap-2 rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>

          <button
            onClick={exportLog}
            className="flex items-center gap-2 rounded border border-[#2a2d35] bg-[#12141a] px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white transition-colors ml-auto"
          >
            <Download className="h-4 w-4" /> Export Log
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: School Queue List */}
          <div className="col-span-1">
            <div className="mb-3">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter schools..."
                className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-[#c41e3a] focus:outline-none"
              />
            </div>
            <div className="max-h-[600px] overflow-y-auto space-y-1 rounded-lg border border-[#2a2d35] bg-[#12141a] p-2">
              {filteredSchools.map((s) => {
                const isProcessed = processedSchools.has(s.school)
                const isCurrent = expandedSchool === s.school
                return (
                  <div
                    key={s.school}
                    onClick={() => jumpToSchool(s.school)}
                    className={`flex items-center justify-between rounded px-3 py-2 text-sm cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-[#c41e3a]/20 border border-[#c41e3a]/40'
                        : isProcessed
                        ? 'bg-green-900/10 hover:bg-[#1a1d24]'
                        : 'hover:bg-[#1a1d24]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isProcessed ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-[#2a2d35] shrink-0" />
                      )}
                      <span className="truncate text-white">{s.school}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#a0a0a0]">{s.total}</span>
                      <div
                        className="h-1.5 w-12 rounded-full bg-[#1a1d24] overflow-hidden"
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#c41e3a] to-green-500"
                          style={{ width: `${s.completeness}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#555] w-8 text-right">
                        {s.completeness}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Current School Coaches */}
          <div className="col-span-2">
            {currentCoaches.length > 0 ? (
              <div className="rounded-lg border border-[#2a2d35] bg-[#12141a]">
                <div className="border-b border-[#2a2d35] px-5 py-3 flex items-center justify-between">
                  <h3 className="font-bold text-white">
                    <Zap className="inline h-4 w-4 text-[#c41e3a] mr-1" />
                    {expandedSchool} — {currentCoaches.length} coaches
                  </h3>
                  {editCount > 0 && (
                    <span className="text-xs text-green-500">{editCount} edits pending</span>
                  )}
                </div>
                <div className="max-h-[550px] overflow-y-auto divide-y divide-[#1a1d24]">
                  {currentCoaches.map((coach) => {
                    const edit = edits[coach.id] || {}
                    return (
                      <div key={coach.id} className="px-5 py-3 hover:bg-[#0a0a0f]/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-white">
                              {coach.first_name} {coach.last_name}
                            </span>
                            <span className="ml-2 text-sm text-[#a0a0a0]">{coach.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {coach.twitter ? (
                              <span className="text-xs text-[#1da1f2]">@{coach.twitter}</span>
                            ) : (
                              <span className="text-xs text-[#c41e3a]">No Twitter</span>
                            )}
                            {coach.email ? (
                              <Mail className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Mail className="h-3.5 w-3.5 text-[#333]" />
                            )}
                          </div>
                        </div>
                        {/* Inline edit fields */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Twitter handle"
                              value={edit.twitter || ''}
                              onChange={(e) => updateEdit(coach.id, 'twitter', e.target.value)}
                              className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-2 py-1 text-xs text-white placeholder:text-[#333] focus:border-[#1da1f2] focus:outline-none"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Email"
                              value={edit.email || ''}
                              onChange={(e) => updateEdit(coach.id, 'email', e.target.value)}
                              className="w-full rounded border border-[#2a2d35] bg-[#0a0a0f] px-2 py-1 text-xs text-white placeholder:text-[#333] focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(
                              `"${coach.first_name} ${coach.last_name}" "${coach.school}" football coach twitter`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3b82f6] hover:text-white transition-colors"
                          >
                            <Search className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-[#2a2d35] bg-[#12141a]">
                <div className="text-center">
                  <Zap className="mx-auto h-10 w-10 text-[#2a2d35]" />
                  <p className="mt-3 text-[#a0a0a0]">
                    {queueStatus === 'idle'
                      ? 'Start the queue or click a school to begin'
                      : 'Loading next school...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-6 rounded-lg border border-[#2a2d35] bg-[#12141a]">
          <div className="border-b border-[#2a2d35] px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-wide text-[#a0a0a0]">
              Activity Log
            </span>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-4 font-mono text-xs text-[#a0a0a0] space-y-0.5">
            {enrichmentLog.length === 0 && (
              <div className="text-[#333]">Waiting for activity...</div>
            )}
            {enrichmentLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
