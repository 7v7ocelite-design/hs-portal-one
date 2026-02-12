'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Home,
  Search,
  User,
  Settings,
  LogOut,
  Loader2,
  Menu
} from 'lucide-react'
import { ROLE_COLORS } from '@/lib/constants'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface UserProfile {
  role: string
  onboarding_complete: boolean
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (profileData) {
        setProfile(profileData)

        // Redirect to onboarding if not complete
        if (!profileData.onboarding_complete) {
          router.push('/onboarding')
          return
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  const roleColor = profile?.role ? ROLE_COLORS[profile.role as keyof typeof ROLE_COLORS] : ROLE_COLORS.athlete

  const navItems = [
    { href: `/dashboard/${profile?.role || 'athlete'}`, label: 'Dashboard', icon: Home },
    { href: '/coaches', label: 'Find Coaches', icon: Search },
    { href: `/dashboard/${profile?.role || 'athlete'}/profile`, label: 'My Profile', icon: User },
    { href: `/dashboard/${profile?.role || 'athlete'}/settings`, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#12141a] border-r border-[#2a2d35]
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2d35]">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-white"
              style={{ backgroundColor: roleColor.primary }}
            >
              HS
            </div>
            <div>
              <div className="font-bold text-white">HS PORTAL</div>
              <div className="text-xs text-gray-500">Powered by AIC</div>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1a1c22] rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info & Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a2d35]">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: roleColor.primary }}
            >
              {profile?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{profile?.email}</div>
              <div
                className="text-xs capitalize"
                style={{ color: roleColor.primary }}
              >
                {profile?.role || 'User'}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1a1c22] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#12141a] border-b border-[#2a2d35] p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-bold text-white">HS PORTAL</div>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
