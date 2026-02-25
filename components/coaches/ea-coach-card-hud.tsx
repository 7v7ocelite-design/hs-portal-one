'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Heart,
  User,
  Shield,
} from 'lucide-react'
import type { Coach } from '@/types/coach'

interface EaCoachCardHudProps {
  coach: Coach
  isFavorited?: boolean
  onFavorite?: (id: number) => void
  onClick?: () => void
}

export function EaCoachCardHud({
  coach,
  isFavorited,
  onFavorite,
  onClick,
}: EaCoachCardHudProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showComposeModal, setShowComposeModal] = useState(false)

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }, [])

  // Determine verification status
  const isVerified2026 = true // In production, check against real data
  const statusColor = isVerified2026 ? 'green' : 'yellow'
  const statusLabel = isVerified2026 ? '2026 Staff Verified' : '2025 Staff – Update Pending'
  const statusDotClass = isVerified2026 ? 'glow-dot-green' : 'glow-dot-yellow'

  const initials = `${coach.first_name?.charAt(0) || ''}${coach.last_name?.charAt(0) || ''}`

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.15 },
        }}
        className="ea-hud-card ea-coach-card-h overflow-hidden group"
      >
        {/* Left: Avatar / Photo Area */}
        <div
          className="w-24 sm:w-28 shrink-0 flex flex-col items-center justify-center gap-2 p-3 relative"
          style={{
            background: 'linear-gradient(180deg, rgba(196, 30, 58, 0.15) 0%, rgba(196, 30, 58, 0.05) 100%)',
            borderRight: '2px solid rgba(196, 30, 58, 0.3)',
          }}
        >
          {/* Avatar */}
          <div className="w-14 h-14 bg-black/60 border-2 border-[#c41e3a]/40 clip-angular flex items-center justify-center">
            <span className="text-lg font-black text-[#c41e3a]/80">{initials}</span>
          </div>

          {/* Status dot */}
          <div className="flex items-center gap-1.5">
            <span className={statusDotClass} />
            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold leading-tight">
              {isVerified2026 ? 'Verified' : 'Pending'}
            </span>
          </div>

          {/* Favorite button */}
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFavorite(coach.id)
              }}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-all ${
                  isFavorited ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-600 hover:text-[#d4af37]'
                }`}
              />
            </button>
          )}
        </div>

        {/* Center: Coach Info */}
        <div
          className="flex-1 p-4 flex flex-col justify-center min-w-0 cursor-pointer"
          onClick={onClick}
        >
          {/* Name */}
          <h3 className="text-base sm:text-lg font-black text-white uppercase italic tracking-wide truncate">
            {coach.first_name} {coach.last_name}
          </h3>

          {/* Position */}
          <div className="text-xs font-bold text-[#c41e3a] uppercase tracking-[0.15em] mt-0.5 truncate">
            {coach.position_title}
          </div>

          {/* School + Division */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-gray-400 font-semibold truncate max-w-[180px]">
              {coach.school_name}
            </span>
            <span className="ea-badge text-white text-[8px] py-0.5 px-1.5">
              {coach.division_level}
            </span>
            {coach.conference && (
              <span className="text-[10px] text-gray-600 truncate">
                {coach.conference}
              </span>
            )}
          </div>

          {/* Status badge (full) */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className={statusDotClass} />
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{
              color: statusColor === 'green' ? '#22c55e' : '#eab308'
            }}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="w-28 sm:w-36 shrink-0 flex flex-col gap-1.5 p-3 justify-center"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 100%)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Email button */}
          {coach.email ? (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowComposeModal(true)
                }}
                className="ea-btn-skew ea-btn-skew-dark flex-1 py-1.5 text-[9px] justify-center"
                title="Compose email"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyToClipboard(coach.email!, 'email')
                }}
                className="ea-btn-skew ea-btn-skew-dark py-1.5 px-2"
                title="Copy email"
              >
                {copiedField === 'email' ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          ) : (
            <div className="ea-btn-skew ea-btn-skew-dark py-1.5 text-[9px] opacity-30 cursor-not-allowed justify-center">
              <Mail className="w-3 h-3" />
              <span>No Email</span>
            </div>
          )}

          {/* Twitter button */}
          {coach.twitter ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://twitter.com/${coach.twitter}`, '_blank')
              }}
              className="ea-btn-skew ea-btn-skew-dark py-1.5 text-[9px] justify-center w-full"
              title="Open Twitter"
            >
              <span className="font-black text-[10px]">𝕏</span>
              <span>@{coach.twitter.length > 10 ? coach.twitter.slice(0, 10) + '…' : coach.twitter}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-50" />
            </button>
          ) : (
            <div className="ea-btn-skew ea-btn-skew-dark py-1.5 text-[9px] opacity-30 cursor-not-allowed justify-center">
              <span className="font-black text-[10px]">𝕏</span>
              <span>No Twitter</span>
            </div>
          )}

          {/* Phone button */}
          {coach.phone ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(coach.phone!, 'phone')
              }}
              className="ea-btn-skew ea-btn-skew-dark py-1.5 text-[9px] justify-center w-full"
              title="Copy phone"
            >
              <Phone className="w-3 h-3" />
              <span>{copiedField === 'phone' ? 'Copied!' : 'Copy Phone'}</span>
            </button>
          ) : (
            <div className="ea-btn-skew ea-btn-skew-dark py-1.5 text-[9px] opacity-30 cursor-not-allowed justify-center">
              <Phone className="w-3 h-3" />
              <span>No Phone</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Email Compose Modal */}
      <AnimatePresence>
        {showComposeModal && coach.email && (
          <ComposeModal
            email={coach.email}
            coachName={`${coach.first_name} ${coach.last_name}`}
            onClose={() => setShowComposeModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Compose Modal ─── */
function ComposeModal({
  email,
  coachName,
  onClose,
}: {
  email: string
  coachName: string
  onClose: () => void
}) {
  const subject = encodeURIComponent(`Introduction – HS Portal One Athlete`)
  const body = encodeURIComponent(
    `Dear Coach ${coachName.split(' ').pop()},\n\nI am reaching out to express my interest in your program.\n\nThank you for your time.\n\nSincerely,\n[Your Name]`
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative ea-hud-card p-6 w-full max-w-md"
      >
        <div className="ea-header-bar -mx-6 -mt-6 mb-5 rounded-none">
          <span className="text-white flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Compose Email
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold">To</label>
            <div className="mt-1 p-2.5 bg-black/40 border border-[#c41e3a]/20 clip-angular-sm text-white text-sm font-semibold">
              {coachName} &lt;{email}&gt;
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href={`mailto:${email}?subject=${subject}&body=${body}`}
              className="ea-btn-skew ea-btn-skew-red flex-1 justify-center py-2.5"
              onClick={onClose}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open Mail Client</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(email)
                onClose()
              }}
              className="ea-btn-skew ea-btn-skew-dark py-2.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
