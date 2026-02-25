'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  MapPin,
  Users,
  ChevronRight,
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Shield,
} from 'lucide-react'
import type { Coach } from '@/types/coach'

/* ═══════════════════════════════════════
   TEAM PROFILE CARD
   ═══════════════════════════════════════ */

interface EaTeamProfileCardProps {
  schoolName: string
  coaches: Coach[]
  onCoachClick: (coach: Coach) => void
  /** 1-5 prestige rating */
  prestige?: number
  /** e.g. "12-2" */
  overallRecord?: string
  /** e.g. "#4" */
  nationalRanking?: string
  /** Robot Scout last check timestamp */
  lastScouted?: string
  /** Whether changes were detected */
  changesDetected?: boolean
}

export function EaTeamProfileCard({
  schoolName,
  coaches,
  onCoachClick,
  prestige = 3,
  overallRecord,
  nationalRanking,
  lastScouted,
  changesDetected = false,
}: EaTeamProfileCardProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('Head Coach')

  // Filter and group coaches
  const schoolCoaches = useMemo(() => {
    return coaches.filter((c) => c.school_name === schoolName)
  }, [coaches, schoolName])

  const schoolInfo = schoolCoaches[0] || null

  const groupedCoaches = useMemo(() => {
    const groups: Record<string, Coach[]> = {
      'Head Coach': [],
      'Coordinators': [],
      'Position Coaches': [],
      'Other Staff': [],
    }

    schoolCoaches.forEach((coach) => {
      const title = coach.position_title?.toLowerCase() || ''
      if (title.includes('head coach')) {
        groups['Head Coach'].push(coach)
      } else if (title.includes('coordinator') || title === 'oc' || title === 'dc') {
        groups['Coordinators'].push(coach)
      } else if (
        title.includes('coach') ||
        title.includes('backs') ||
        title.includes('line') ||
        title.includes('receivers')
      ) {
        groups['Position Coaches'].push(coach)
      } else {
        groups['Other Staff'].push(coach)
      }
    })

    return groups
  }, [schoolCoaches])

  const getDivisionLabel = (division: string): string => {
    const labels: Record<string, string> = {
      FBS: 'NCAA Division I (FBS)',
      FCS: 'NCAA Division I (FCS)',
      D2: 'NCAA Division II',
      D3: 'NCAA Division III',
      NAIA: 'NAIA',
      JUCO: 'Junior College',
    }
    return labels[division] || division
  }

  return (
    <div className="ea-hud-card overflow-hidden">
      {/* ── Change Alert Banner ── */}
      <AnimatePresence>
        {changesDetected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ea-alert-banner px-4 py-2 flex items-center gap-2">
              <span className="glow-dot-red" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                New Changes Detected
              </span>
              <span className="text-[9px] text-white/60 ml-auto">via Robot Scout</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── School Header ── */}
      <div className="p-5 flex items-start gap-4" style={{
        background: 'linear-gradient(135deg, rgba(196, 30, 58, 0.08) 0%, transparent 60%)',
      }}>
        {/* Logo Placeholder */}
        <div className="w-20 h-20 bg-black/60 border-2 border-[#c41e3a]/40 clip-angular flex items-center justify-center shrink-0">
          <Building2 className="w-10 h-10 text-[#c41e3a]/60" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-wide truncate">
            {schoolName}
          </h2>

          {schoolInfo && (
            <>
              <div className="text-xs font-bold text-[#c41e3a] uppercase tracking-[0.15em] mt-0.5">
                {getDivisionLabel(schoolInfo.division_level)}
              </div>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                {schoolInfo.conference && (
                  <span className="font-semibold">{schoolInfo.conference}</span>
                )}
                {schoolInfo.state && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {schoolInfo.state}
                  </span>
                )}
              </div>
            </>
          )}

          {/* 5-Star Prestige Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i <= prestige ? 'ea-prestige-star fill-[#d4af37]' : 'ea-prestige-star-empty'
                }`}
              />
            ))}
            <span className="text-[10px] text-gray-600 ml-1 uppercase tracking-wider font-bold">
              Prestige
            </span>
          </div>
        </div>
      </div>

      {/* ── Season Stats (Brushed Metal) ── */}
      {(overallRecord || nationalRanking) && (
        <div className="brushed-metal mx-4 mb-4 p-4 clip-angular-sm">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-[#d4af37]" />
            Season Stats
          </div>
          <div className="grid grid-cols-2 gap-4">
            {overallRecord && (
              <div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold">Overall Record</div>
                <div className="scoreboard-num text-2xl text-white mt-0.5">{overallRecord}</div>
              </div>
            )}
            {nationalRanking && (
              <div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold">National Ranking</div>
                <div className="scoreboard-num text-2xl text-[#d4af37] mt-0.5">{nationalRanking}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Staff Count Bar ── */}
      <div className="mx-4 mb-3 flex items-center gap-2 p-2.5 bg-black/30 border border-[#c41e3a]/20 clip-angular-sm">
        <Users className="w-4 h-4 text-[#c41e3a]" />
        <span className="scoreboard-num text-sm text-white">{schoolCoaches.length}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
          Coaches in Database
        </span>
      </div>

      {/* ── Coaching Staff (Nested List) ── */}
      <div className="px-4 pb-2">
        <div className="border-t-2 border-[#c41e3a]/30 pt-3">
          <h3 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-[#c41e3a]" />
            Coaching Staff
          </h3>

          {Object.entries(groupedCoaches).map(([group, groupCoaches]) => {
            if (groupCoaches.length === 0) return null
            const isExpanded = expandedGroup === group

            return (
              <div key={group} className="mb-1">
                {/* Group header */}
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all clip-angular-sm"
                >
                  <span className="text-[10px] font-bold text-[#c41e3a] uppercase tracking-wider">
                    {group}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-600 font-bold">{groupCoaches.length}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                    </motion.div>
                  </div>
                </button>

                {/* Coach list */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2 py-1 space-y-0.5">
                        {groupCoaches.map((coach) => (
                          <button
                            key={coach.id}
                            onClick={() => onCoachClick(coach)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-transparent hover:bg-[#d4af37]/10 border-l-2 border-transparent hover:border-[#d4af37] transition-all group text-left"
                          >
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition-colors uppercase italic">
                                {coach.first_name} {coach.last_name}
                              </div>
                              <div className="text-[10px] text-gray-600">
                                {coach.position_title}
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Robot Scout Footer ── */}
      {lastScouted && (
        <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between"
          style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)' }}
        >
          <div className="flex items-center gap-2">
            <span className="glow-dot-green" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-gray-500 font-bold">
              Scout Bot Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{lastScouted}</span>
          </div>
        </div>
      )}
    </div>
  )
}
