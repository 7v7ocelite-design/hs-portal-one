'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { FOOTBALL_POSITIONS, GRADUATION_YEARS, US_STATES, ROLE_COLORS } from '@/lib/constants'
import {
  sanitizeName,
  sanitizeOrgName,
  sanitizeCity,
  sanitizePhone,
  sanitizeUrl,
  sanitizeHandle,
  sanitizeEmail,
  sanitizeGpa,
} from '@/lib/utils/sanitize'

interface AthleteForm {
  first_name: string
  last_name: string
  primary_position: string
  secondary_position: string
  graduation_year: number | null
  high_school: string
  city: string
  state: string
  height_feet: number | null
  height_inches: number | null
  weight_lbs: number | null
  gpa: string
  hudl_link: string
  twitter_handle: string
  phone: string
  parent_email: string
}

const initialForm: AthleteForm = {
  first_name: '',
  last_name: '',
  primary_position: '',
  secondary_position: '',
  graduation_year: null,
  high_school: '',
  city: '',
  state: '',
  height_feet: null,
  height_inches: null,
  weight_lbs: null,
  gpa: '',
  hudl_link: '',
  twitter_handle: '',
  phone: '',
  parent_email: '',
}

export default function AthleteOnboardingPage() {
  const [form, setForm] = useState<AthleteForm>(initialForm)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const totalSteps = 3
  const color = ROLE_COLORS.athlete

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [router, supabase])

  const updateField = (field: keyof AthleteForm, value: any) => {
    // Apply appropriate sanitization based on field type
    let sanitizedValue = value
    if (typeof value === 'string') {
      switch (field) {
        case 'first_name':
        case 'last_name':
          sanitizedValue = sanitizeName(value)
          break
        case 'high_school':
          sanitizedValue = sanitizeOrgName(value)
          break
        case 'city':
          sanitizedValue = sanitizeCity(value)
          break
        case 'phone':
          sanitizedValue = sanitizePhone(value)
          break
        case 'hudl_link':
          sanitizedValue = sanitizeUrl(value)
          break
        case 'twitter_handle':
          sanitizedValue = sanitizeHandle(value)
          break
        case 'parent_email':
          sanitizedValue = sanitizeEmail(value)
          break
        case 'gpa':
          sanitizedValue = sanitizeGpa(value)
          break
      }
    }
    setForm(prev => ({ ...prev, [field]: sanitizedValue }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      // Get profile ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (profileError) throw profileError

      // Insert athlete record
      const { error: athleteError } = await supabase
        .from('athletes')
        .insert({
          profile_id: profile.id,
          first_name: form.first_name,
          last_name: form.last_name,
          primary_position: form.primary_position || null,
          secondary_position: form.secondary_position || null,
          graduation_year: form.graduation_year,
          high_school: form.high_school || null,
          city: form.city || null,
          state: form.state || null,
          height_feet: form.height_feet,
          height_inches: form.height_inches,
          weight_lbs: form.weight_lbs,
          gpa: form.gpa ? parseFloat(form.gpa) : null,
          hudl_link: form.hudl_link || null,
          twitter_handle: form.twitter_handle || null,
          phone: form.phone || null,
          parent_email: form.parent_email || null,
        })

      if (athleteError) throw athleteError

      // Mark onboarding complete
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('user_id', session.user.id)

      if (updateError) throw updateError

      router.push('/dashboard/athlete')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: color.primary }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color.primary }}
            />
            <span className="text-sm font-medium" style={{ color: color.primary }}>
              Athlete Profile
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create your profile</h1>
          <p className="text-gray-400">Step {step} of {totalSteps}</p>

          {/* Progress bar */}
          <div className="mt-4 h-1 bg-[#2a2d35] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(step / totalSteps) * 100}%`,
                backgroundColor: color.primary,
              }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => updateField('last_name', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Graduation Year *
                </label>
                <select
                  value={form.graduation_year || ''}
                  onChange={(e) => updateField('graduation_year', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select year</option>
                  {GRADUATION_YEARS.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  High School
                </label>
                <input
                  type="text"
                  value={form.high_school}
                  onChange={(e) => updateField('high_school', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select state</option>
                    {US_STATES.map(state => (
                      <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Athletic Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Primary Position
                  </label>
                  <select
                    value={form.primary_position}
                    onChange={(e) => updateField('primary_position', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select position</option>
                    {FOOTBALL_POSITIONS.map(pos => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Secondary Position
                  </label>
                  <select
                    value={form.secondary_position}
                    onChange={(e) => updateField('secondary_position', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select position</option>
                    {FOOTBALL_POSITIONS.map(pos => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Height (ft)</label>
                  <select
                    value={form.height_feet || ''}
                    onChange={(e) => updateField('height_feet', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Ft</option>
                    {[4, 5, 6, 7].map(ft => (
                      <option key={ft} value={ft}>{ft}'</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Height (in)</label>
                  <select
                    value={form.height_inches || ''}
                    onChange={(e) => updateField('height_inches', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">In</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inch => (
                      <option key={inch} value={inch}>{inch}"</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    value={form.weight_lbs || ''}
                    onChange={(e) => updateField('weight_lbs', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="180"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">GPA</label>
                <input
                  type="text"
                  value={form.gpa}
                  onChange={(e) => updateField('gpa', e.target.value)}
                  placeholder="3.5"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Contact & Links</h2>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Hudl Profile URL
                </label>
                <input
                  type="url"
                  value={form.hudl_link}
                  onChange={(e) => updateField('hudl_link', e.target.value)}
                  placeholder="https://hudl.com/profile/..."
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Twitter Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={form.twitter_handle}
                    onChange={(e) => updateField('twitter_handle', e.target.value.replace('@', ''))}
                    placeholder="username"
                    className="w-full pl-8 pr-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Parent/Guardian Email
                </label>
                <input
                  type="email"
                  value={form.parent_email}
                  onChange={(e) => updateField('parent_email', e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-[#2a2d35] text-gray-400 rounded-lg hover:bg-[#1a1c22] transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={step === totalSteps ? handleSubmit : () => setStep(step + 1)}
              disabled={isLoading || (step === 1 && (!form.first_name || !form.last_name))}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === totalSteps ? (
                'Complete Profile'
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
