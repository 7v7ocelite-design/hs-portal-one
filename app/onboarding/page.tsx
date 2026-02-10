'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, School, Users, Loader2, ArrowRight } from 'lucide-react'
import { ROLE_COLORS } from '@/lib/constants'

type UserRole = 'athlete' | 'coach' | 'club'

interface RoleOption {
  id: UserRole
  title: string
  description: string
  icon: React.ReactNode
  color: typeof ROLE_COLORS.athlete
}

const roleOptions: RoleOption[] = [
  {
    id: 'athlete',
    title: 'Individual Athlete',
    description: 'Create your recruiting profile and connect with college coaches',
    icon: <User className="w-8 h-8" />,
    color: ROLE_COLORS.athlete,
  },
  {
    id: 'coach',
    title: 'High School Program',
    description: 'Manage your team roster and help your athletes get recruited',
    icon: <School className="w-8 h-8" />,
    color: ROLE_COLORS.coach,
  },
  {
    id: 'club',
    title: 'Club / 7-on-7 Team',
    description: 'Showcase your program and connect players with opportunities',
    icon: <Users className="w-8 h-8" />,
    color: ROLE_COLORS.club,
  },
]

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Check if already onboarded
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete, role')
        .eq('user_id', session.user.id)
        .single()

      if (profile?.onboarding_complete && profile?.role) {
        router.push(`/dashboard/${profile.role}`)
        return
      }

      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      // Update profile with selected role
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('user_id', session.user.id)

      if (error) throw error

      // Navigate to role-specific onboarding
      router.push(`/onboarding/${selectedRole}`)
    } catch (err: any) {
      console.error('Error updating role:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to HS Portal</h1>
          <p className="text-gray-400">Select your account type to get started</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4 mb-8">
          {roleOptions.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                selectedRole === role.id
                  ? `border-[${role.color.primary}] bg-[${role.color.primary}]/10`
                  : 'border-[#2a2d35] bg-[#12141a] hover:border-[#3a3d45]'
              }`}
              style={{
                borderColor: selectedRole === role.id ? role.color.primary : undefined,
                backgroundColor: selectedRole === role.id ? `${role.color.primary}10` : undefined,
              }}
            >
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${role.color.primary}20`, color: role.color.primary }}
              >
                {role.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{role.title}</h3>
                <p className="text-gray-400 text-sm">{role.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedRole === role.id ? 'border-transparent' : 'border-[#3a3d45]'
                }`}
                style={{
                  backgroundColor: selectedRole === role.id ? role.color.primary : 'transparent',
                  borderColor: selectedRole === role.id ? role.color.primary : undefined,
                }}
              >
                {selectedRole === role.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
