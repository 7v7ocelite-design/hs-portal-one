'use client'

import { Mail, Twitter, ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Coach } from '@/types/coach'

interface EaCoachTableProps {
  coaches: Coach[]
  isLoading: boolean
  totalCount: number
  filteredCount: number
  onCoachClick?: (coach: Coach) => void
  onSchoolClick?: (schoolName: string) => void
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

export function EaCoachTable({
  coaches,
  isLoading,
  totalCount,
  filteredCount,
  onCoachClick,
  onSchoolClick,
  hasMore,
  isLoadingMore,
  onLoadMore
}: EaCoachTableProps) {
  const getDivisionCode = (division: string): string => {
    const codes: Record<string, string> = {
      'FBS': 'I-A',
      'FCS': 'I-AA',
      'D2': 'II',
      'D3': 'III',
      'NAIA': 'NAIA',
      'JUCO': 'JC',
    }
    return codes[division] || division
  }

  const progressPercent = totalCount > 0 ? (filteredCount / totalCount) * 100 : 0

  return (
    <div className="ea-panel flex-1 flex flex-col min-h-0">
      {/* Panel Header */}
      <div className="ea-panel-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-white/20 clip-angular-sm">
            <span className="text-ea-red font-black text-sm italic">AIC</span>
          </div>
          <span className="text-base font-black tracking-wider">COACH DATABASE</span>
        </div>

        {/* Coach Counter */}
        <div className="ea-targets-bar">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-bold tracking-wider">SHOWING:</span>
            <span className="text-white font-black text-lg">{filteredCount.toLocaleString()}</span>
            <span className="text-gray-500">of</span>
            <span className="text-gray-400 font-bold">{totalCount.toLocaleString()}</span>
            <span className="text-xs text-gray-500">coaches</span>
          </div>
          <div className="ea-targets-progress">
            <div
              className="ea-targets-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#1a1a1a]">
        {/* Column Headers - Dark */}
        <div className="grid grid-cols-[2fr_1fr_2fr_0.5fr_1fr_0.5fr_0.6fr] gap-1 px-4 py-3 ea-table-header text-xs font-black text-gray-300 tracking-wider uppercase">
          <div>NAME</div>
          <div>POS</div>
          <div>SCHOOL</div>
          <div>ST</div>
          <div>DIVISION</div>
          <div>DIV</div>
          <div className="text-center">CONTACT</div>
        </div>

        {/* Table Body - WHITE ROWS */}
        <div className="flex-1 overflow-y-auto ea-scrollbar">
          {isLoading ? (
            // Loading skeleton with white background
            <div className="space-y-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'grid grid-cols-[2fr_1fr_2fr_0.5fr_1fr_0.5fr_0.6fr] gap-1 px-4 py-3',
                    i % 2 === 0 ? 'bg-white' : 'bg-[#f5f5f5]'
                  )}
                >
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          ) : coaches.length === 0 ? (
            <div className="flex items-center justify-center h-48 bg-white text-gray-500">
              No coaches found matching your criteria
            </div>
          ) : (
            <div className="space-y-0">
              {coaches.map((coach, index) => (
                <div
                  key={coach.id}
                  onClick={() => onCoachClick?.(coach)}
                  className={cn(
                    'grid grid-cols-[2fr_1fr_2fr_0.5fr_1fr_0.5fr_0.6fr] gap-1 px-4 py-2.5 items-center',
                    'ea-table-row cursor-pointer',
                    index % 2 === 0 ? 'ea-table-row-white' : 'ea-table-row-gray'
                  )}
                >
                  {/* Name - BLACK TEXT */}
                  <div className="font-bold text-black text-sm truncate hover:text-ea-red transition-colors">
                    {coach.first_name} {coach.last_name}
                  </div>

                  {/* Position */}
                  <div className="text-gray-700 text-sm truncate font-medium" title={coach.position_title || undefined}>
                    {coach.position_title || '—'}
                  </div>

                  {/* School - Clickable */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSchoolClick?.(coach.school_name)
                    }}
                    className="text-gray-800 text-sm truncate text-left hover:text-ea-red hover:underline transition-colors"
                  >
                    {coach.school_name}
                  </button>

                  {/* State */}
                  <div className="text-gray-600 text-sm font-semibold">
                    {coach.state || '—'}
                  </div>

                  {/* Division */}
                  <div className="text-gray-700 text-sm">
                    {coach.division_level}
                  </div>

                  {/* Div Code - RED */}
                  <div className="text-ea-red font-black text-sm">
                    {getDivisionCode(coach.division_level)}
                  </div>

                  {/* Contact Icons */}
                  <div className="flex items-center justify-center gap-1">
                    {coach.email && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(coach.email!)
                        }}
                        className="p-1.5 hover:bg-ea-red/20 rounded transition-colors"
                        title={`Copy: ${coach.email}`}
                      >
                        <Mail className="w-4 h-4 text-gray-600 hover:text-ea-red" />
                      </button>
                    )}
                    {coach.twitter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`https://twitter.com/${coach.twitter}`, '_blank')
                        }}
                        className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                        title={`@${coach.twitter}`}
                      >
                        <Twitter className="w-4 h-4 text-gray-600 hover:text-[#1DA1F2]" />
                      </button>
                    )}
                    {!coach.email && !coach.twitter && (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Dark with Load More */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border-t-2 border-ea-red flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Showing <span className="text-white font-bold">{coaches.length}</span> of <span className="text-ea-red font-bold">{filteredCount.toLocaleString()}</span> coaches
          </span>

          {hasMore && onLoadMore && (
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 text-sm text-ea-red hover:text-white transition-colors font-bold uppercase tracking-wider group disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </button>
          )}

          {!hasMore && coaches.length > 0 && (
            <span className="text-xs text-gray-600 font-medium">
              All coaches loaded
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
