'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  User,
  MapPin,
  GraduationCap,
  Trophy,
  Mail,
  Phone,
  Twitter,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { ROLE_COLORS } from '@/lib/constants'

interface AthleteData {
  first_name: string
  last_name: string
  primary_position: string
  secondary_position: string | null
  graduation_year: number
  high_school: string | null
  city: string | null
  state: string | null
  height_feet: number | null
  height_inches: number | null
  weight_lbs: number | null
  gpa: number | null
  hudl_link: string | null
  twitter_handle: string | null
  phone: string | null
  parent_email: string | null
}

export default function AthleteDashboard() {
  const [athlete, setAthlete] = useState<AthleteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const color = ROLE_COLORS.athlete

  useEffect(() => {
    const fetchAthlete = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile) return

      // Get athlete data
      const { data: athleteData } = await supabase
        .from('athletes')
        .select('*')
        .eq('profile_id', profile.id)
        .single()

      if (athleteData) {
        setAthlete(athleteData)
      }

      setIsLoading(false)
    }

    fetchAthlete()
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

  const profileCompletion = athlete ? calculateProfileCompletion(athlete) : 0

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {athlete?.first_name || 'Athlete'}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Here&apos;s your recruiting dashboard</p>
        </div>
        <Link
          href="/coaches"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: color.primary }}
        >
          <Search className="w-4 h-4" />
          Find Coaches
        </Link>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Profile Completion</h2>
          <span className="text-2xl font-bold" style={{ color: color.primary }}>
            {profileCompletion}%
          </span>
        </div>
        <div className="h-2 bg-[#2a2d35] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${profileCompletion}%`,
              backgroundColor: color.primary,
            }}
          />
        </div>
        {profileCompletion < 100 && (
          <p className="text-gray-400 text-sm mt-3">
            Complete your profile to increase visibility to college coaches
          </p>
        )}
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: color.primary }} />
            Profile Overview
          </h2>

          <div className="space-y-4">
            {/* Name & Position */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: color.primary }}
              >
                {athlete?.first_name?.charAt(0)}{athlete?.last_name?.charAt(0)}
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {athlete?.first_name} {athlete?.last_name}
                </div>
                <div className="text-gray-400">
                  {athlete?.primary_position}
                  {athlete?.secondary_position && ` / ${athlete.secondary_position}`}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a2d35]">
              <div className="flex items-center gap-2 text-gray-400">
                <GraduationCap className="w-4 h-4" />
                <span>Class of {athlete?.graduation_year}</span>
              </div>
              {athlete?.high_school && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Trophy className="w-4 h-4" />
                  <span>{athlete.high_school}</span>
                </div>
              )}
              {athlete?.city && athlete?.state && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{athlete.city}, {athlete.state}</span>
                </div>
              )}
              {athlete?.height_feet && (
                <div className="text-gray-400">
                  {athlete.height_feet}&apos;{athlete.height_inches || 0}&quot; • {athlete.weight_lbs || '---'} lbs
                </div>
              )}
            </div>

            {/* GPA */}
            {athlete?.gpa && (
              <div className="pt-4 border-t border-[#2a2d35]">
                <span className="text-gray-500 text-sm">GPA</span>
                <div className="text-white font-bold text-lg">{athlete.gpa.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Contact & Links */}
        <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Contact & Links</h2>

          <div className="space-y-3">
            {athlete?.phone ? (
              <div className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-white">{athlete.phone}</span>
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg border border-dashed border-[#2a2d35]">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-500">Add phone number</span>
                <AlertCircle className="w-4 h-4 text-yellow-500 ml-auto" />
              </div>
            )}

            {athlete?.parent_email ? (
              <div className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg">
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-white truncate">{athlete.parent_email}</span>
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg border border-dashed border-[#2a2d35]">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-500">Add parent email (NCAA required)</span>
                <AlertCircle className="w-4 h-4 text-yellow-500 ml-auto" />
              </div>
            )}

            {athlete?.twitter_handle ? (
              <a
                href={`https://twitter.com/${athlete.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1c22] transition-colors"
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <span className="text-white">@{athlete.twitter_handle}</span>
                <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg border border-dashed border-[#2a2d35]">
                <Twitter className="w-5 h-5 text-gray-500" />
                <span className="text-gray-500">Add Twitter handle</span>
              </div>
            )}

            {athlete?.hudl_link ? (
              <a
                href={athlete.hudl_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1c22] transition-colors"
              >
                <div className="w-5 h-5 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  H
                </div>
                <span className="text-white">Hudl Profile</span>
                <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg border border-dashed border-[#2a2d35]">
                <div className="w-5 h-5 bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center">
                  H
                </div>
                <span className="text-gray-500">Add Hudl profile link</span>
                <AlertCircle className="w-4 h-4 text-yellow-500 ml-auto" />
              </div>
            )}
          </div>
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
            <div className="text-white font-medium">Search Coaches</div>
            <div className="text-gray-500 text-sm">Browse 8,783+ coaches</div>
          </Link>
          <Link
            href={`/dashboard/athlete/profile`}
            className="p-4 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1c22] transition-colors text-center"
          >
            <User className="w-8 h-8 mx-auto mb-2" style={{ color: color.primary }} />
            <div className="text-white font-medium">Edit Profile</div>
            <div className="text-gray-500 text-sm">Update your info</div>
          </Link>
          <div className="p-4 bg-[#0a0a0f] rounded-lg text-center opacity-50">
            <Mail className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <div className="text-gray-400 font-medium">Message Coaches</div>
            <div className="text-gray-500 text-sm">Coming soon</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateProfileCompletion(athlete: AthleteData): number {
  const fields = [
    athlete.first_name,
    athlete.last_name,
    athlete.primary_position,
    athlete.graduation_year,
    athlete.high_school,
    athlete.city,
    athlete.state,
    athlete.height_feet,
    athlete.weight_lbs,
    athlete.gpa,
    athlete.hudl_link,
    athlete.twitter_handle,
    athlete.phone,
    athlete.parent_email,
  ]

  const completed = fields.filter(f => f !== null && f !== '' && f !== undefined).length
  return Math.round((completed / fields.length) * 100)
}
