'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { US_STATES, ROLE_COLORS } from '@/lib/constants'
import { sanitizeName, sanitizeOrgName, sanitizeCity, sanitizeGeneric } from '@/lib/utils/sanitize'

interface CoachForm {
  school_name: string
  first_name: string
  last_name: string
  city: string
  state: string
  sport_type: 'football'
  title: string
  school_enrollment: number | null
  conference: string
}

const initialForm: CoachForm = {
  school_name: '',
  first_name: '',
  last_name: '',
  city: '',
  state: '',
  sport_type: 'football', // Always football - focused on HS football recruiting
  title: '',
  school_enrollment: null,
  conference: '',
}

const titleOptions = [
  'Head Coach',
  'Offensive Coordinator',
  'Defensive Coordinator',
  'Recruiting Coordinator',
  'Program Director',
  'Special Teams Coordinator',
  'Quarterbacks Coach',
  'Running Backs Coach',
  'Wide Receivers Coach',
  'Offensive Line Coach',
  'Defensive Line Coach',
  'Linebackers Coach',
  'Secondary Coach',
  'Strength & Conditioning',
  'Athletic Director',
  'Assistant Coach',
  'Volunteer Coach',
]

export default function CoachOnboardingPage() {
  const [form, setForm] = useState<CoachForm>(initialForm)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const totalSteps = 2
  const color = ROLE_COLORS.coach

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

  const updateField = (field: keyof CoachForm, value: string | number | null) => {
    // Apply appropriate sanitization based on field type
    let sanitizedValue = value
    if (typeof value === 'string') {
      switch (field) {
        case 'first_name':
        case 'last_name':
          sanitizedValue = sanitizeName(value)
          break
        case 'school_name':
          sanitizedValue = sanitizeOrgName(value)
          break
        case 'city':
          sanitizedValue = sanitizeCity(value)
          break
        case 'conference':
          sanitizedValue = sanitizeGeneric(value)
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

      // Insert HS coach record
      const { error: coachError } = await supabase
        .from('hs_coaches')
        .insert({
          profile_id: profile.id,
          school_name: form.school_name,
          first_name: form.first_name,
          last_name: form.last_name,
          city: form.city || null,
          state: form.state || null,
          sport_type: form.sport_type || null,
          title: form.title || null,
          school_enrollment: form.school_enrollment,
          conference: form.conference || null,
        })

      if (coachError) throw coachError

      // Mark onboarding complete
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('user_id', session.user.id)

      if (updateError) throw updateError

      router.push('/dashboard/coach')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
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
              High School Program
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Set up your program</h1>
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
              <h2 className="text-lg font-semibold text-white mb-4">School Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  value={form.school_name}
                  onChange={(e) => updateField('school_name', e.target.value)}
                  placeholder="Lincoln High School"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select state</option>
                    {US_STATES.map(state => (
                      <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    School Enrollment
                  </label>
                  <input
                    type="number"
                    value={form.school_enrollment || ''}
                    onChange={(e) => updateField('school_enrollment', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="1500"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Conference</label>
                  <input
                    type="text"
                    value={form.conference}
                    onChange={(e) => updateField('conference', e.target.value)}
                    placeholder="District 5A"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Your Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
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
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Title
                </label>
                <select
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select title</option>
                  {titleOptions.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
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
              disabled={isLoading || (step === 1 && !form.school_name) || (step === 2 && (!form.first_name || !form.last_name))}
              className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === totalSteps ? (
                'Complete Setup'
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
