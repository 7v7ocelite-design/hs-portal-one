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
  AlertCircle,
  Target,
  TrendingUp,
  ArrowRight,
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

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile) return

      const { data: athleteData } = await supabase
        .from('athletes')
        .select('*')
        .eq('profile_id', (profile as { id: string }).id)
        .single()

      if (athleteData) {
        setAthlete(athleteData as AthleteData)
      }

      setIsLoading(false)
    }

    fetchAthlete()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/[0.03] rounded-xl w-2/3" />
        <div className="h-32 bg-white/[0.03] rounded-2xl" />
        <div className="grid grid-cols-2 gap-5">
          <div className="h-64 bg-white/[0.03] rounded-2xl" />
          <div className="h-64 bg-white/[0.03] rounded-2xl" />
        </div>
      </div>
    )
  }

  const profileCompletion = athlete ? calculateProfileCompletion(athlete) : 0
  const completionColor = profileCompletion >= 80 ? '#22c55e' : profileCompletion >= 50 ? '#d4af37' : '#f97316'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {athlete?.first_name || 'Athlete'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Here&apos;s your recruiting dashboard</p>
        </div>
        <Link
          href="/coaches"
          className="group hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: color.primary, boxShadow: `0 0 16px ${color.primary}25` }}
        >
          <Search className="w-4 h-4" />
          Find Coaches
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Profile Completion - EA style */}
      <div className="ea-landing-panel p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Profile Completion</h2>
            {profileCompletion < 100 && (
              <p className="text-xs text-gray-500 mt-0.5">Complete your profile to increase visibility</p>
            )}
          </div>
          <span className="text-2xl font-bold scoreboard-num" style={{ color: completionColor }}>
            {profileCompletion}%
          </span>
        </div>
        <div className="ea-progress-bar">
          <div
            className="ea-progress-fill transition-all duration-700 ease-out"
            style={{ width: `${profileCompletion}%`, background: `linear-gradient(90deg, ${completionColor}, ${completionColor}cc)` }}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Overview */}
        <div className="ea-landing-panel p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2 section-header-stadium">
            <User className="w-4 h-4" style={{ color: color.primary }} />
            Profile
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: `${color.primary}20`, color: color.primary }}
              >
                {athlete?.first_name?.charAt(0)}{athlete?.last_name?.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {athlete?.first_name} {athlete?.last_name}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                    {athlete?.primary_position}
                  </span>
                  {athlete?.secondary_position && (
                    <span className="text-sm text-gray-500">/ {athlete.secondary_position}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-white/[0.06]">
              <InfoItem icon={<GraduationCap className="w-4 h-4" />} label="Class" value={`${athlete?.graduation_year}`} />
              {athlete?.high_school && (
                <InfoItem icon={<Trophy className="w-4 h-4" />} label="School" value={athlete.high_school} />
              )}
              {athlete?.city && athlete?.state && (
                <InfoItem icon={<MapPin className="w-4 h-4" />} label="Location" value={`${athlete.city}, ${athlete.state}`} />
              )}
              {athlete?.height_feet && (
                <InfoItem icon={<TrendingUp className="w-4 h-4" />} label="Measurables" value={`${athlete.height_feet}&apos;${athlete.height_inches || 0}&quot; / ${athlete.weight_lbs || '---'} lbs`} />
              )}
            </div>

            {athlete?.gpa && (
              <div className="pt-4 border-t border-white/[0.06]">
                <div className="text-xs text-gray-600 uppercase tracking-wider">GPA</div>
                <div className="text-white font-bold text-xl mt-0.5">{athlete.gpa.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Links */}
        <div className="ea-landing-panel p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 section-header-stadium">Contact & Links</h2>

          <div className="space-y-2.5">
            <ContactRow
              icon={<Phone className="w-4 h-4" />}
              value={athlete?.phone}
              placeholder="Add phone number"
              activeColor="#22c55e"
            />
            <ContactRow
              icon={<Mail className="w-4 h-4" />}
              value={athlete?.parent_email}
              placeholder="Add parent email (NCAA required)"
              activeColor="#22c55e"
            />
            <ContactRow
              icon={<Twitter className="w-4 h-4" />}
              value={athlete?.twitter_handle ? `@${athlete.twitter_handle}` : null}
              placeholder="Add Twitter handle"
              activeColor="#1DA1F2"
              href={athlete?.twitter_handle ? `https://twitter.com/${athlete.twitter_handle}` : undefined}
            />
            <ContactRow
              icon={<span className="w-4 h-4 bg-orange-500 rounded text-white text-[10px] font-bold flex items-center justify-center">H</span>}
              value={athlete?.hudl_link ? 'Hudl Profile' : null}
              placeholder="Add Hudl profile link"
              activeColor="#f97316"
              href={athlete?.hudl_link || undefined}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ActionCard
          href="/coaches"
          icon={<Search className="w-6 h-6" />}
          color={color.primary}
          title="Search Coaches"
          subtitle="3,423+ verified coaches"
          className="stat-broadcast"
        />
        <ActionCard
          href="/fit-finder"
          icon={<Target className="w-6 h-6" />}
          color="#d4af37"
          title="Fit Finder"
          subtitle="See where you match"
          className="stat-broadcast"
        />
        <ActionCard
          href={`/dashboard/athlete/profile`}
          icon={<User className="w-6 h-6" />}
          color="#9333ea"
          title="Edit Profile"
          subtitle="Update your info"
          className="stat-broadcast"
        />
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-gray-600 mt-0.5">{icon}</span>
      <div>
        <div className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</div>
        <div className="text-sm text-gray-300">{value}</div>
      </div>
    </div>
  )
}

function ContactRow({
  icon,
  value,
  placeholder,
  activeColor,
  href,
}: {
  icon: React.ReactNode
  value: string | null | undefined
  placeholder: string
  activeColor: string
  href?: string
}) {
  const inner = (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
      value
        ? 'bg-white/[0.03] hover:bg-white/[0.05]'
        : 'bg-white/[0.02] border border-dashed border-white/[0.06]'
    }`}>
      <span style={{ color: value ? activeColor : '#4b5563' }}>{icon}</span>
      <span className={value ? 'text-white text-sm' : 'text-gray-600 text-sm'}>{value || placeholder}</span>
      {value ? (
        href ? <ExternalLink className="w-3.5 h-3.5 text-gray-600 ml-auto" /> : <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 text-yellow-600 ml-auto" />
      )}
    </div>
  )

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  }
  return inner
}

function ActionCard({
  href,
  icon,
  color,
  title,
  subtitle,
  className,
}: {
  href: string
  icon: React.ReactNode
  color: string
  title: string
  subtitle: string
  className?: string
}) {
  return (
    <Link href={href} className={`ea-landing-panel p-5 text-center group ${className || ''}`}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div className="text-white font-semibold text-sm">{title}</div>
      <div className="text-gray-600 text-xs mt-0.5">{subtitle}</div>
    </Link>
  )
}

function calculateProfileCompletion(athlete: AthleteData): number {
  const fields = [
    athlete.first_name, athlete.last_name, athlete.primary_position,
    athlete.graduation_year, athlete.high_school, athlete.city,
    athlete.state, athlete.height_feet, athlete.weight_lbs,
    athlete.gpa, athlete.hudl_link, athlete.twitter_handle,
    athlete.phone, athlete.parent_email,
  ]
  const completed = fields.filter(f => f !== null && f !== '' && f !== undefined).length
  return Math.round((completed / fields.length) * 100)
}
