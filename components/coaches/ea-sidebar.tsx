'use client'

import { ChevronDown, RotateCcw, Search } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { DIVISIONS, US_STATES, CONFERENCES } from '@/lib/constants'
import type { CoachFilters } from '@/types/coach'

const POSITIONS = [
  { value: '', label: 'All Positions' },
  { value: 'Head Coach', label: 'Head Coach' },
  { value: 'Offensive Coordinator', label: 'Offensive Coordinator' },
  { value: 'Defensive Coordinator', label: 'Defensive Coordinator' },
  { value: 'Quarterbacks', label: 'Quarterbacks Coach' },
  { value: 'Running Backs', label: 'Running Backs Coach' },
  { value: 'Wide Receivers', label: 'Wide Receivers Coach' },
  { value: 'Tight Ends', label: 'Tight Ends Coach' },
  { value: 'Offensive Line', label: 'Offensive Line Coach' },
  { value: 'Defensive Line', label: 'Defensive Line Coach' },
  { value: 'Linebackers', label: 'Linebackers Coach' },
  { value: 'Defensive Backs', label: 'Defensive Backs Coach' },
  { value: 'Secondary', label: 'Secondary Coach' },
  { value: 'Special Teams', label: 'Special Teams Coach' },
  { value: 'Recruiting', label: 'Recruiting Coordinator' },
  { value: 'Strength', label: 'Strength & Conditioning' },
  { value: 'Assistant', label: 'Assistant Coach' },
]

interface EaSidebarProps {
  filters: CoachFilters
  onFilterChange: (key: keyof CoachFilters, value: string | boolean | undefined) => void
  onExport: () => void
  onExportCsv: () => void
  onClearFilters: () => void
  totalCoaches: number
  filteredCount: number
}

export function EaSidebar({
  filters,
  onFilterChange,
  onExport,
  onExportCsv,
  onClearFilters,
  totalCoaches,
  filteredCount
}: EaSidebarProps) {
  const hasActiveFilters = !!(
    filters.search ||
    filters.position ||
    filters.division ||
    filters.state ||
    filters.conference ||
    filters.hasTwitter ||
    filters.hasEmail
  )

  return (
    <div className="ea-panel w-[300px] shrink-0 ea-glow overflow-y-auto">
      {/* Panel Header */}
      <div className="ea-panel-header flex items-center justify-between">
        <span className="text-sm font-black tracking-wider">FILTER COACHES</span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
            title="Clear all filters"
          >
            <RotateCcw className="w-3 h-3" />
            RESET
          </button>
        )}
      </div>

      {/* Panel Content */}
      <div className="p-5 space-y-4">
        {/* Search Bar */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 tracking-widest uppercase">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Name, school, or position..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value || undefined)}
              className="ea-select pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Position Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 tracking-widest uppercase">Position</label>
          <div className="relative">
            <select
              value={filters.position || ''}
              onChange={(e) => onFilterChange('position', e.target.value || undefined)}
              className="ea-select"
            >
              {POSITIONS.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ea-red pointer-events-none" />
          </div>
        </div>

        {/* Division Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 tracking-widest uppercase">Division</label>
          <div className="relative">
            <select
              value={filters.division || ''}
              onChange={(e) => onFilterChange('division', e.target.value || undefined)}
              className="ea-select"
            >
              <option value="">All Divisions</option>
              {DIVISIONS.map((div) => (
                <option key={div.value} value={div.value}>
                  {div.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ea-red pointer-events-none" />
          </div>
        </div>

        {/* Conference Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 tracking-widest uppercase">Conference</label>
          <div className="relative">
            <select
              value={filters.conference || ''}
              onChange={(e) => onFilterChange('conference', e.target.value || undefined)}
              className="ea-select"
            >
              <option value="">All Conferences</option>
              {CONFERENCES.map((conf) => (
                <option key={conf.value} value={conf.value}>
                  {conf.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ea-red pointer-events-none" />
          </div>
        </div>

        {/* State Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 tracking-widest uppercase">State</label>
          <div className="relative">
            <select
              value={filters.state || ''}
              onChange={(e) => onFilterChange('state', e.target.value || undefined)}
              className="ea-select"
            >
              <option value="">All States</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ea-red pointer-events-none" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-ea-red/40 my-4" />

        {/* Contact Filters */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 tracking-widest uppercase">Contact Info</label>
          <div className="space-y-3 mt-3">
            <Toggle
              label="Has Twitter"
              checked={filters.hasTwitter || false}
              onChange={(checked) => onFilterChange('hasTwitter', checked || undefined)}
            />
            <Toggle
              label="Has Email"
              checked={filters.hasEmail || false}
              onChange={(checked) => onFilterChange('hasEmail', checked || undefined)}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-ea-red/40 my-4" />

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onExport}
            className="ea-button-secondary w-full"
          >
            COPY TO CLIPBOARD
          </button>

          <button
            onClick={onExportCsv}
            className="ea-button-gold w-full"
          >
            EXPORT CSV
          </button>
        </div>

        {/* Stats Box */}
        <div className="mt-4 p-4 bg-black/60 border-2 border-ea-red/50 clip-angular-sm ea-pulse">
          <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Filtered Results</div>
          <div className="text-3xl font-black text-ea-red mt-1">{filteredCount.toLocaleString()}</div>
          <div className="text-xs text-gray-600 mt-1">of {totalCoaches.toLocaleString()} coaches</div>
        </div>
      </div>
    </div>
  )
}
