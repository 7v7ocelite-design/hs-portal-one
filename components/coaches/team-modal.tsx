'use client'

import { useEffect, useMemo } from 'react'
import { X, Building2, MapPin, Users, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Coach } from '@/types/coach'

interface TeamModalProps {
  schoolName: string | null
  isOpen: boolean
  onClose: () => void
  coaches: Coach[]
  onCoachClick: (coach: Coach) => void
}

export function TeamModal({ schoolName, isOpen, onClose, coaches, onCoachClick }: TeamModalProps) {
  // ============================================
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  // ============================================

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Filter coaches for this school - MUST be before conditional return
  const schoolCoaches = useMemo(() => {
    if (!schoolName) return []
    return coaches.filter(c => c.school_name === schoolName)
  }, [coaches, schoolName])

  // Get school info from first coach
  const schoolInfo = useMemo(() => {
    return schoolCoaches[0] || null
  }, [schoolCoaches])

  // Group coaches by position type - MUST be before conditional return
  const groupedCoaches = useMemo(() => {
    const groups: Record<string, Coach[]> = {
      'Head Coach': [],
      'Coordinators': [],
      'Position Coaches': [],
      'Other Staff': [],
    }

    schoolCoaches.forEach(coach => {
      const title = coach.position_title?.toLowerCase() || ''
      if (title.includes('head coach')) {
        groups['Head Coach'].push(coach)
      } else if (title.includes('coordinator')) {
        groups['Coordinators'].push(coach)
      } else if (title.includes('coach') || title.includes('backs') || title.includes('line') || title.includes('receivers')) {
        groups['Position Coaches'].push(coach)
      } else {
        groups['Other Staff'].push(coach)
      }
    })

    return groups
  }, [schoolCoaches])

  // ============================================
  // CONDITIONAL RETURNS GO HERE - AFTER ALL HOOKS
  // ============================================

  if (!isOpen || !schoolName) return null

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getDivisionLabel = (division: string): string => {
    const labels: Record<string, string> = {
      'FBS': 'NCAA Division I (FBS)',
      'FCS': 'NCAA Division I (FCS)',
      'D2': 'NCAA Division II',
      'D3': 'NCAA Division III',
      'NAIA': 'NAIA',
      'JUCO': 'Junior College',
    }
    return labels[division] || division
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] ea-panel ea-glow animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header */}
        <div className="ea-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-white/20 clip-angular-sm">
              <Building2 className="w-5 h-5 text-ea-red" />
            </div>
            <span className="text-sm font-black tracking-wider">TEAM PROFILE</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto ea-scrollbar">
          <div className="p-6 space-y-6">
            {/* School Info */}
            <div className="flex items-start gap-4">
              {/* Logo Placeholder */}
              <div className="w-20 h-20 bg-black/60 border-2 border-ea-red/50 clip-angular flex items-center justify-center shrink-0">
                <Building2 className="w-10 h-10 text-ea-red/60" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white">
                  {schoolName}
                </h2>
                {schoolInfo && (
                  <>
                    <p className="text-ea-red font-bold uppercase tracking-wider text-sm">
                      {getDivisionLabel(schoolInfo.division_level)}
                    </p>
                    {schoolInfo.conference && (
                      <p className="text-gray-400 text-sm">{schoolInfo.conference}</p>
                    )}
                    {schoolInfo.state && (
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        {schoolInfo.state}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Staff Count */}
            <div className="flex items-center gap-2 p-3 bg-black/40 border border-ea-red/30 clip-angular-sm">
              <Users className="w-5 h-5 text-ea-red" />
              <span className="text-white font-bold">{schoolCoaches.length}</span>
              <span className="text-gray-400">coaches in database</span>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-ea-red/40" />

            {/* Coaching Staff */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase">
                Coaching Staff
              </h3>

              {Object.entries(groupedCoaches).map(([group, groupCoaches]) => {
                if (groupCoaches.length === 0) return null
                return (
                  <div key={group} className="space-y-2">
                    <h4 className="text-xs font-bold text-ea-red uppercase tracking-wider">
                      {group}
                    </h4>
                    <div className="space-y-1">
                      {groupCoaches.map((coach) => (
                        <button
                          key={coach.id}
                          onClick={() => {
                            onClose()
                            onCoachClick(coach)
                          }}
                          className={cn(
                            'w-full flex items-center justify-between p-3',
                            'bg-white/5 hover:bg-[#d4af37] border border-white/10 hover:border-[#d4af37]',
                            'transition-all clip-angular-sm group'
                          )}
                        >
                          <div className="text-left">
                            <div className="text-white font-bold text-sm group-hover:text-black transition-colors">
                              {coach.first_name} {coach.last_name}
                            </div>
                            <div className="text-gray-500 text-xs group-hover:text-black/70">
                              {coach.position_title}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {schoolCoaches.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  No coaches found in database for this school
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-ea-red bg-black/60">
          <button
            onClick={onClose}
            className="ea-button-secondary w-full"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
