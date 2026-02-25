'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Home,
  Search,
  User,
  Settings,
  LogOut,
  Loader2,
  Menu,
  Target,
  X,
} from 'lucide-react'
import { ROLE_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface UserProfile {
  role: string
  onboarding_complete: boolean
  email?: string
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (profileData) {
        setProfile(profileData as UserProfile)
        if (!(profileData as UserProfile).onboarding_complete) {
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
          <span className="text-sm text-gray-500">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  const roleColor = profile?.role ? ROLE_COLORS[profile.role as keyof typeof ROLE_COLORS] : ROLE_COLORS.athlete

  const navItems = [
    { href: `/dashboard/${profile?.role || 'athlete'}`, label: 'Dashboard', icon: Home },
    { href: '/coaches', label: 'Find Coaches', icon: Search },
    { href: '/fit-finder', label: 'Fit Finder', icon: Target },
    { href: `/dashboard/${profile?.role || 'athlete'}/profile`, label: 'My Profile', icon: User },
    { href: `/dashboard/${profile?.role || 'athlete'}/settings`, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50',
        'w-64 bg-[#0d0f14] border-r border-white/[0.06]',
        'transform transition-transform duration-300 ease-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm transition-shadow"
              style={{ backgroundColor: roleColor.primary, boxShadow: `0 0 12px ${roleColor.primary}30` }}
            >
              P1
            </div>
            <div>
              <div className="font-bold text-white text-sm">HS Portal <span className="text-[#d4af37]">One</span></div>
              <div className="text-[10px] text-gray-600 uppercase tracking-widest">Recruiting Platform</div>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                )}
              >
                <item.icon className={cn('w-4 h-4', isActive && 'text-[#d4af37]')} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleColor.primary }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Info & Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: `${roleColor.primary}20`, color: roleColor.primary }}
            >
              {profile?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{profile?.email}</div>
              <div className="text-xs capitalize" style={{ color: roleColor.primary }}>
                {profile?.role || 'User'}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-300 hover:bg-white/[0.03] rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-bold text-white text-sm">
              HS Portal <span className="text-[#d4af37]">One</span>
            </div>
            <div className="w-9" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
