'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  LayoutGrid,
  List,
  Radio,
  Building2,
  ChevronLeft,
  Users,
  Filter,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import type { Coach } from '@/types/coach'
import { EaCoachCardHud } from '@/components/coaches/ea-coach-card-hud'
import { EaTeamProfileCard } from '@/components/coaches/ea-team-profile-card'
import { EaRobotScout } from '@/components/coaches/ea-robot-scout'

type ViewMode = 'database' | 'team'

/* ── Sample prestige data ── */
const PRESTIGE_MAP: Record<string, { prestige: number; record: string; ranking: string }> = {
  Alabama: { prestige: 5, record: '12-2', ranking: '#4' },
  'Ohio State': { prestige: 5, record: '13-1', ranking: '#2' },
  Georgia: { prestige: 5, record: '14-1', ranking: '#1' },
  Clemson: { prestige: 4, record: '10-3', ranking: '#12' },
  'Texas A&M': { prestige: 4, record: '9-4', ranking: '#18' },
  Michigan: { prestige: 5, record: '11-2', ranking: '#6' },
  LSU: { prestige: 4, record: '10-3', ranking: '#14' },
  Oregon: { prestige: 4, record: '12-2', ranking: '#5' },
  'Penn State': { prestige: 4, record: '11-2', ranking: '#8' },
  'Notre Dame': { prestige: 4, record: '10-3', ranking: '#10' },
}

export default function TeamPortalPage() {
  const supabase = createClient()

  const [viewMode, setViewMode] = useState<ViewMode>('database')
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [divisionFilter, setDivisionFilter] = useState('')

  // Fetch coaches
  const { data: coaches = [], isLoading } = useQuery({
    queryKey: ['coaches-portal'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tier1_coaches')
        .select('*')
        .limit(500)
      if (error) throw error
      return (data || []) as Coach[]
    },
  })

  // Get unique schools
  const schools = useMemo(() => {
    const schoolMap = new Map<string, { name: string; division: string; state: string | null; coachCount: number }>()
    coaches.forEach((c) => {
      const existing = schoolMap.get(c.school_name)
      if (existing) {
        existing.coachCount++
      } else {
        schoolMap.set(c.school_name, {
          name: c.school_name,
          division: c.division_level,
          state: c.state,
          coachCount: 1,
        })
      }
    })
    return Array.from(schoolMap.values()).sort((a, b) => b.coachCount - a.coachCount)
  }, [coaches])

  // Filtered coaches for database view
  const filteredCoaches = useMemo(() => {
    let result = coaches
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          c.school_name.toLowerCase().includes(q) ||
          c.position_title.toLowerCase().includes(q)
      )
    }
    if (divisionFilter) {
      result = result.filter((c) => c.division_level === divisionFilter)
    }
    return result.slice(0, 50)
  }, [coaches, searchQuery, divisionFilter])

  // Filtered schools
  const filteredSchools = useMemo(() => {
    if (!searchQuery) return schools.slice(0, 30)
    const q = searchQuery.toLowerCase()
    return schools.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 30)
  }, [schools, searchQuery])

  const handleCoachClick = useCallback((coach: Coach) => {
    setSelectedCoach(coach)
  }, [])

  const handleSchoolClick = useCallback((schoolName: string) => {
    setSelectedSchool(schoolName)
    setViewMode('team')
  }, [])

  return (
    <div className="ea-hero-stadium min-h-screen">
      {/* ── Top Bar ── */}
      <div className="relative z-10 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c41e3a] clip-angular-sm flex items-center justify-center">
              <span className="text-white font-black text-xs">P1</span>
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-wider">
                Coach & Team Portal
              </h1>
              <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em]">
                EA Sports × HS Portal One
              </p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/[0.06] p-0.5 clip-angular-sm">
            <button
              onClick={() => { setViewMode('database'); setSelectedSchool(null) }}
              className={`ea-btn-skew py-1.5 px-3 text-[9px] ${
                viewMode === 'database' ? 'ea-btn-skew-red' : 'ea-btn-skew-dark'
              }`}
            >
              <List className="w-3 h-3" />
              <span>Database</span>
            </button>
            <button
              onClick={() => setViewMode('team')}
              className={`ea-btn-skew py-1.5 px-3 text-[9px] ${
                viewMode === 'team' ? 'ea-btn-skew-red' : 'ea-btn-skew-dark'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Teams</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search coaches, schools, positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#c41e3a]/20 text-white text-sm font-semibold clip-angular-sm placeholder:text-gray-600 focus:outline-none focus:border-[#c41e3a]/50 focus:shadow-[0_0_15px_rgba(196,30,58,0.2)] transition-all"
            />
          </div>
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="ea-select w-40 h-[42px]"
          >
            <option value="">All Divisions</option>
            <option value="FBS">D1 FBS</option>
            <option value="FCS">D1 FCS</option>
            <option value="D2">Division II</option>
            <option value="D3">Division III</option>
            <option value="NAIA">NAIA</option>
            <option value="JUCO">JUCO</option>
          </select>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {/* ════════════════ DATABASE VIEW ════════════════ */}
          {viewMode === 'database' && !selectedSchool && (
            <motion.div
              key="database"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Coach List (3 cols) */}
              <div className="lg:col-span-3 space-y-3">
                <div className="ea-header-bar flex items-center justify-between">
                  <span className="text-white flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    Coach Database
                  </span>
                  <span className="text-[10px] text-white/40 normal-case tracking-normal font-normal">
                    {filteredCoaches.length} of {coaches.length} coaches
                  </span>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="ea-hud-card h-24 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCoaches.map((coach) => (
                      <EaCoachCardHud
                        key={coach.id}
                        coach={coach}
                        onClick={() => handleSchoolClick(coach.school_name)}
                        onFavorite={() => {}}
                      />
                    ))}
                    {filteredCoaches.length === 0 && (
                      <div className="ea-hud-card p-8 text-center">
                        <Search className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          No coaches match your search
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Robot Scout Sidebar (1 col) */}
              <div className="space-y-4">
                <EaRobotScout />
              </div>
            </motion.div>
          )}

          {/* ════════════════ TEAM VIEW (no school selected) ════════════════ */}
          {viewMode === 'team' && !selectedSchool && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="ea-header-bar mb-4 flex items-center justify-between">
                <span className="text-white flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  Team Directory
                </span>
                <span className="text-[10px] text-white/40 normal-case tracking-normal font-normal">
                  {filteredSchools.length} programs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchools.map((school) => {
                  const prestigeData = PRESTIGE_MAP[school.name]
                  return (
                    <button
                      key={school.name}
                      onClick={() => setSelectedSchool(school.name)}
                      className="ea-landing-panel p-4 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black/60 border border-[#c41e3a]/30 clip-angular-sm flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6 text-[#c41e3a]/50" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-white uppercase italic truncate group-hover:text-[#d4af37] transition-colors">
                            {school.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="ea-badge text-white text-[7px] py-0 px-1">{school.division}</span>
                            <span className="text-[10px] text-gray-600">{school.state}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-semibold">
                            {school.coachCount} coaches
                          </span>
                        </div>
                      </div>
                      {prestigeData && (
                        <div className="mt-2 flex items-center gap-3 pt-2 border-t border-white/[0.04]">
                          <span className="scoreboard-num text-xs text-white">{prestigeData.record}</span>
                          <span className="scoreboard-num text-xs text-[#d4af37]">{prestigeData.ranking}</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ════════════════ TEAM PROFILE VIEW ════════════════ */}
          {selectedSchool && (
            <motion.div
              key={`team-${selectedSchool}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back button */}
              <button
                onClick={() => setSelectedSchool(null)}
                className="ea-btn-skew ea-btn-skew-dark mb-4 text-[10px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to {viewMode === 'team' ? 'Teams' : 'Database'}</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Team Profile (2 cols) */}
                <div className="lg:col-span-2">
                  <EaTeamProfileCard
                    schoolName={selectedSchool}
                    coaches={coaches}
                    onCoachClick={handleCoachClick}
                    prestige={PRESTIGE_MAP[selectedSchool]?.prestige || 3}
                    overallRecord={PRESTIGE_MAP[selectedSchool]?.record}
                    nationalRanking={PRESTIGE_MAP[selectedSchool]?.ranking}
                    lastScouted="5 mins ago"
                    changesDetected={selectedSchool === 'Alabama' || selectedSchool === 'Ohio State'}
                  />
                </div>

                {/* Robot Scout + Selected Coach (1 col) */}
                <div className="space-y-4">
                  {/* Selected Coach detail */}
                  <AnimatePresence>
                    {selectedCoach && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">
                            Selected Coach
                          </span>
                          <button
                            onClick={() => setSelectedCoach(null)}
                            className="text-[9px] text-[#c41e3a] font-bold uppercase hover:text-white transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        <EaCoachCardHud
                          coach={selectedCoach}
                          onFavorite={() => {}}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <EaRobotScout
                    schoolsMonitored={1}
                    lastFullScan="5 mins ago"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
