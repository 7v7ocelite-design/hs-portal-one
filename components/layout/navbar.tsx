'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Target, MapPin, CreditCard, Radio } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/coaches', label: 'Coaches', icon: Search },
  { href: '/team-portal', label: 'Team Portal', icon: Radio },
  { href: '/fit-finder', label: 'Fit Finder', icon: Target },
  { href: '/map', label: 'Map', icon: MapPin },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#c41e3a] flex items-center justify-center group-hover:shadow-[0_0_12px_rgba(196,30,58,0.4)] transition-shadow">
              <span className="text-white font-black text-sm">P1</span>
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              HS Portal <span className="text-[#d4af37]">One</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.06]" />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#d4af37] to-[#c49b2f] text-black hover:from-[#e5c347] hover:to-[#d4af37] transition-all duration-200 shadow-[0_0_16px_rgba(212,175,55,0.25)] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)]"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-white/[0.08] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-white/[0.06] space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04]"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#d4af37] to-[#c49b2f] text-black hover:from-[#e5c347] hover:to-[#d4af37] transition-all">
                  Sign up free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
