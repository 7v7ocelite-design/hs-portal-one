'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { US_STATES, ROLE_COLORS } from '@/lib/constants'
import { sanitizeName, sanitizeOrgName, sanitizeCity, sanitizeUrl } from '@/lib/utils/sanitize'

interface ClubForm {
  club_name: string
  director_first_name: string
  director_last_name: string
  city: string
  state: string
  sport_type: '7on7'
  primary_color: string
  secondary_color: string
  website: string
  roster_count: number | null
}

const initialForm: ClubForm = {
  club_name: '',
  director_first_name: '',
  director_last_name: '',
  city: '',
  state: '',
  sport_type: '7on7', // Always 7-on-7 - focused on football recruiting showcases
  primary_color: '#f97316',
  secondary_color: '#000000',
  website: '',
  roster_count: null,
}

const colorPresets = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
]

export default function ClubOnboardingPage() {
  const [form, setForm] = useState<ClubForm>(initialForm)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const totalSteps = 2
  const color = ROLE_COLORS.club

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

  const updateField = (field: keyof ClubForm, value: string | number | null) => {
    // Apply appropriate sanitization based on field type
    let sanitizedValue = value
    if (typeof value === 'string') {
      switch (field) {
        case 'director_first_name':
        case 'director_last_name':
          sanitizedValue = sanitizeName(value)
          break
        case 'club_name':
          sanitizedValue = sanitizeOrgName(value)
          break
        case 'city':
          sanitizedValue = sanitizeCity(value)
          break
        case 'website':
          sanitizedValue = sanitizeUrl(value)
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

      // Insert club record
      const { error: clubError } = await supabase
        .from('clubs')
        .insert({
          profile_id: profile.id,
          club_name: form.club_name,
          director_first_name: form.director_first_name,
          director_last_name: form.director_last_name,
          city: form.city || null,
          state: form.state || null,
          sport_type: form.sport_type || null,
          primary_color: form.primary_color,
          secondary_color: form.secondary_color,
          website: form.website || null,
          roster_count: form.roster_count,
        })

      if (clubError) throw clubError

      // Mark onboarding complete
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('user_id', session.user.id)

      if (updateError) throw updateError

      router.push('/dashboard/club')
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
              Club / 7-on-7 Team
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Set up your club</h1>
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
              <h2 className="text-lg font-semibold text-white mb-4">Club Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Club Name *
                </label>
                <input
                  type="text"
                  value={form.club_name}
                  onChange={(e) => updateField('club_name', e.target.value)}
                  placeholder="Elite 7s"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-orange-500 focus:outline-none"
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
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select state</option>
                    {US_STATES.map(state => (
                      <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Club Colors
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 mb-2 block">Primary</span>
                    <div className="flex gap-2 flex-wrap">
                      {colorPresets.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateField('primary_color', c)}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            form.primary_color === c ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 mb-2 block">Secondary</span>
                    <div className="flex gap-2 flex-wrap">
                      {['#000000', '#ffffff', ...colorPresets.slice(0, 6)].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateField('secondary_color', c)}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            form.secondary_color === c ? 'border-white scale-110' : 'border-[#2a2d35]'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Director Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.director_first_name}
                    onChange={(e) => updateField('director_first_name', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={form.director_last_name}
                    onChange={(e) => updateField('director_last_name', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://yourclub.com"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Roster Size
                </label>
                <input
                  type="number"
                  value={form.roster_count || ''}
                  onChange={(e) => updateField('roster_count', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="25"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2d35] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-[#0a0a0f] rounded-lg border border-[#2a2d35]">
                <span className="text-xs text-gray-500 mb-2 block">Preview</span>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: form.primary_color,
                      color: form.secondary_color,
                    }}
                  >
                    {form.club_name?.substring(0, 2).toUpperCase() || 'CL'}
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {form.club_name || 'Your Club Name'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {form.city && form.state ? `${form.city}, ${form.state}` : 'Location'}
                    </div>
                  </div>
                </div>
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
              disabled={isLoading || (step === 1 && !form.club_name) || (step === 2 && (!form.director_first_name || !form.director_last_name))}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
