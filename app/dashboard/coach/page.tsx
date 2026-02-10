'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  School,
  MapPin,
  Users,
  Search,
  Settings,
  Trophy,
  UserPlus
} from 'lucide-react'
import { ROLE_COLORS } from '@/lib/constants'

interface HSCoachData {
  school_name: string
  first_name: string
  last_name: string
  city: string | null
  state: string | null
  sport_type: string | null
  title: string | null
  school_enrollment: number | null
  conference: string | null
}

export default function CoachDashboard() {
  const [coach, setCoach] = useState<HSCoachData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const color = ROLE_COLORS.coach

  useEffect(() => {
    const fetchCoach = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile) return

      // Get HS coach data
      const { data: coachData } = await supabase
        .from('hs_coaches')
        .select('*')
        .eq('profile_id', profile.id)
        .single()

      if (coachData) {
        setCoach(coachData)
      }

      setIsLoading(false)
    }

    fetchCoach()
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
    if (!sport) return 'Football'
    const labels: Record<string, string> = {
      football: 'Football',
      flag_football: 'Flag Football',
      both: 'Football & Flag Football',
    }
    return labels[sport] || sport
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, Coach {coach?.last_name || ''}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Manage your program and connect with college coaches</p>
        </div>
        <Link
          href="/coaches"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: color.primary }}
        >
          <Search className="w-4 h-4" />
          Find College Coaches
        </Link>
      </div>

      {/* School Card */}
      <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color.primary}20` }}
          >
            <School className="w-8 h-8" style={{ color: color.primary }} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{coach?.school_name}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
              {coach?.city && coach?.state && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {coach.city}, {coach.state}
                </div>
              )}
              {coach?.sport_type && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {getSportLabel(coach.sport_type)}
                </div>
              )}
              {coach?.school_enrollment && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {coach.school_enrollment.toLocaleString()} students
                </div>
              )}
            </div>
            {coach?.conference && (
              <div className="mt-2 text-sm text-gray-500">
                Conference: {coach.conference}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coach Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Info */}
        <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Name</span>
              <span className="text-white font-medium">{coach?.first_name} {coach?.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Title</span>
              <span className="text-white font-medium">{coach?.title || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sport</span>
              <span className="text-white font-medium">{getSportLabel(coach?.sport_type)}</span>
            </div>
          </div>
        </div>

        {/* Stats Placeholder */}
        <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Program Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-gray-500 text-sm">Athletes</div>
            </div>
            <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-gray-500 text-sm">College Commits</div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4 text-center">
            Add athletes to your roster to track their recruiting
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
            <Search className="w-8 h-8 mx-auto mb-2" style={{ color: color.primary }} />
            <div className="text-white font-medium">Search College Coaches</div>
            <div className="text-gray-500 text-sm">Find contacts for your athletes</div>
          </Link>
          <div className="p-4 bg-[#0a0a0f] rounded-lg text-center opacity-50">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <div className="text-gray-400 font-medium">Add Athletes</div>
            <div className="text-gray-500 text-sm">Coming soon</div>
          </div>
          <Link
            href={`/dashboard/coach/settings`}
            className="p-4 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1c22] transition-colors text-center"
          >
            <Settings className="w-8 h-8 mx-auto mb-2" style={{ color: color.primary }} />
            <div className="text-white font-medium">Program Settings</div>
            <div className="text-gray-500 text-sm">Update your info</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
