'use client'

import { useState, useMemo, useCallback } from 'react'
import { EaSidebar } from '@/components/coaches/ea-sidebar'
import { EaCoachTable } from '@/components/coaches/ea-coach-table'
import { CoachModal } from '@/components/coaches/coach-modal'
import { TeamModal } from '@/components/coaches/team-modal'
import { useCoaches, useCoachesPaginated } from '@/hooks/use-coaches'
import { Shield } from 'lucide-react'
import type { CoachFilters, Coach } from '@/types/coach'

export default function AdminCoachesPage() {
  const [filters, setFilters] = useState<CoachFilters>({})
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)

  const { data: allCoaches = [], isLoading: isLoadingAll } = useCoaches({})

  const {
    data: paginatedData,
    isLoading: isLoadingPaginated,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useCoachesPaginated(filters)

  // Flatten paginated results
  const filteredCoaches = useMemo(() =>
    paginatedData?.pages.flatMap(page => page.coaches) || [],
    [paginatedData]
  )

  const filteredTotal = paginatedData?.pages[0]?.total || 0
  const isLoading = isLoadingAll || isLoadingPaginated

  const handleFilterChange = (key: keyof CoachFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const handleSearch = () => {
    // Filters are applied automatically via useCoaches
  }

  // Copy to clipboard as formatted text
  const handleExport = useCallback(() => {
    const text = filteredCoaches.map(c =>
      `${c.first_name} ${c.last_name} - ${c.position_title}\n${c.school_name} (${c.division_level})\n${c.email || 'No email'} | ${c.twitter ? '@' + c.twitter : 'No Twitter'}`
    ).join('\n\n---\n\n')

    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied ${filteredCoaches.length} coaches to clipboard!`)
    })
  }, [filteredCoaches])

  // Download as CSV file
  const handleExportCsv = useCallback(() => {
    const escapeCSV = (str: string | null | undefined) => {
      if (!str) return ''
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const header = 'First Name,Last Name,Position,School,State,Division,Conference,Email,Twitter,Phone\n'
    const csv = filteredCoaches.map(c =>
      [
        escapeCSV(c.first_name),
        escapeCSV(c.last_name),
        escapeCSV(c.position_title),
        escapeCSV(c.school_name),
        escapeCSV(c.state),
        escapeCSV(c.division_level),
        escapeCSV(c.conference),
        escapeCSV(c.email),
        escapeCSV(c.twitter),
        escapeCSV(c.phone)
      ].join(',')
    ).join('\n')

    const blob = new Blob([header + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coaches_export_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [filteredCoaches])

  const handleCoachClick = useCallback((coach: Coach) => {
    setSelectedCoach(coach)
  }, [])

  const handleSchoolClick = useCallback((schoolName: string) => {
    setSelectedSchool(schoolName)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="ea-stadium-bg min-h-screen">
      {/* Admin Header */}
      <header className="px-6 py-6 border-b border-ea-red/30">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ea-red flex items-center justify-center clip-angular">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="ea-title text-3xl md:text-4xl text-white">
                ADMIN PORTAL
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Coach Database Management. Edit, Update, Manage.
              </p>
            </div>
          </div>

          {/* Admin Badge */}
          <div className="hidden md:flex items-center gap-3">
            <div className="px-4 py-2 bg-ea-red/20 border border-ea-red clip-angular-sm">
              <span className="text-ea-red font-black">ADMIN MODE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="max-w-[1600px] mx-auto flex gap-6 h-[calc(100vh-180px)]">
          {/* Left Sidebar */}
          <EaSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            onExportCsv={handleExportCsv}
            onClearFilters={handleClearFilters}
            totalCoaches={allCoaches.length}
            filteredCount={filteredTotal}
          />

          {/* Right Panel - Coach Table */}
          <EaCoachTable
            coaches={filteredCoaches}
            isLoading={isLoading}
            totalCount={allCoaches.length}
            filteredCount={filteredTotal}
            onCoachClick={handleCoachClick}
            onSchoolClick={handleSchoolClick}
            hasMore={hasNextPage}
            isLoadingMore={isFetchingNextPage}
            onLoadMore={handleLoadMore}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-ea-red/20">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-xs text-gray-500">
          <span>© 2026 High School Portal 1. Admin Portal.</span>
          <div className="flex items-center gap-4">
            <span>Managing {allCoaches.length.toLocaleString()} coaches</span>
            <span className="text-ea-red">•</span>
            <span className="text-ea-red font-bold">ADMIN ACCESS</span>
          </div>
        </div>
      </footer>

      {/* Coach Profile Modal - WITH ADMIN EDIT ACCESS */}
      <CoachModal
        coach={selectedCoach}
        isOpen={!!selectedCoach}
        onClose={() => setSelectedCoach(null)}
        onSchoolClick={(school) => {
          setSelectedCoach(null)
          setSelectedSchool(school)
        }}
        isAdmin={true}  // Enable editing for admin
      />

      {/* Team Modal */}
      <TeamModal
        schoolName={selectedSchool}
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        coaches={allCoaches}
        onCoachClick={(coach) => {
          setSelectedSchool(null)
          setSelectedCoach(coach)
        }}
      />
    </div>
  )
}
