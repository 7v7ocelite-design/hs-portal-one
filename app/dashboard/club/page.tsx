'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Users,
  MapPin,
  Trophy,
  Search,
  Settings,
  Globe,
  UserPlus
} from 'lucide-react'
import { ROLE_COLORS } from '@/lib/constants'

interface ClubData {
  club_name: string
  director_first_name: string
  director_last_name: string
  city: string | null
  state: string | null
  sport_type: string | null
  primary_color: string | null
  secondary_color: string | null
  website: string | null
  roster_count: number | null
}

export default function ClubDashboard() {
  const [club, setClub] = useState<ClubData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const color = ROLE_COLORS.club

  useEffect(() => {
    const fetchClub = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile) return

      // Get club data
      const { data: clubData } = await supabase
        .from('clubs')
        .select('*')
        .eq('profile_id', profile.id)
        .single()

      if (clubData) {
        setClub(clubData)
      }

      setIsLoading(false)
    }

    fetchClub()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#1a1c22] rounded w-1/3" />
        <div className="h-48 bg-[#1a1c22] rounded" />
        <div className="h-32 bg-[#1a1c22] rounded" />
      </div>
    )
  }

  const getSportLabel = (sport: string | null) => {
    if (!sport) return '7-on-7'
    const labels: Record<string, string> = {
      '7on7': '7-on-7',
      flag_football: 'Flag Football',
      both: '7-on-7 & Flag Football',
    }
    return labels[sport] || sport
  }

  const clubColor = club?.primary_color || color.primary

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400 mt-1">Manage your club and connect with college coaches</p>
        </div>
        <Link
          href="/coaches"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: clubColor }}
        >
          <Search className="w-4 h-4" />
          Find College Coaches
        </Link>
      </div>

      {/* Club Card */}
      <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
            style={{
              backgroundColor: clubColor,
              color: club?.secondary_color || '#ffffff',
            }}
          >
            {club?.club_name?.substring(0, 2).toUpperCase() || 'CL'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{club?.club_name}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
              {club?.city && club?.state && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {club.city}, {club.state}
                </div>
              )}
              {club?.sport_type && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {getSportLabel(club.sport_type)}
                </div>
              )}
              {club?.roster_count && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {club.roster_count} athletes
                </div>
              )}
            </div>
            {club?.website && (
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-2 text-sm hover:underline"
                style={{ color: clubColor }}
              >
                <Globe className="w-4 h-4" />
                {club.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Director Info */}
        <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Director Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Name</span>
              <span className="text-white font-medium">
                {club?.director_first_name} {club?.director_last_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sport</span>
              <span className="text-white font-medium">{getSportLabel(club?.sport_type)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Club Colors</span>
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded border border-[#2a2d35]"
                  style={{ backgroundColor: club?.primary_color || '#f97316' }}
                />
                <div
                  className="w-6 h-6 rounded border border-[#2a2d35]"
                  style={{ backgroundColor: club?.secondary_color || '#000000' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Club Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-white">{club?.roster_count || 0}</div>
              <div className="text-gray-500 text-sm">Roster Size</div>
            </div>
            <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-gray-500 text-sm">College Commits</div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4 text-center">
            Add athletes to track their recruiting progress
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/coaches"
            className="p-4 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1c22] transition-colors text-center"
          >
            <Search className="w-8 h-8 mx-auto mb-2" style={{ color: clubColor }} />
            <div className="text-white font-medium">Search College Coaches</div>
            <div className="text-gray-500 text-sm">Find contacts for your athletes</div>
          </Link>
          <div className="p-4 bg-[#0a0a0f] rounded-lg text-center opacity-50">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <div className="text-gray-400 font-medium">Manage Roster</div>
            <div className="text-gray-500 text-sm">Coming soon</div>
          </div>
          <Link
            href={`/dashboard/club/settings`}
            className="p-4 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1c22] transition-colors text-center"
          >
            <Settings className="w-8 h-8 mx-auto mb-2" style={{ color: clubColor }} />
            <div className="text-white font-medium">Club Settings</div>
            <div className="text-gray-500 text-sm">Update your info</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
