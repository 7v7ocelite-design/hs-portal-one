'use client'

import { motion } from 'framer-motion'
import { Mail, Twitter, Heart, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Coach } from '@/types/coach'

interface CoachCardProps {
  coach: Coach
  isFavorited?: boolean
  onFavorite?: (id: number) => void
  onClick?: () => void
}

export function CoachCard({ coach, isFavorited, onFavorite, onClick }: CoachCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavorite?.(coach.id)
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'relative rounded-xl p-4',
        'bg-white/5 backdrop-blur-md border border-white/10',
        'transition-all duration-300',
        'hover:border-portal-gold/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Favorite button */}
      {onFavorite && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-all duration-200',
              isFavorited ? 'fill-portal-gold text-portal-gold' : 'text-gray-500 hover:text-portal-gold'
            )}
          />
        </button>
      )}

      {/* Name */}
      <h3 className="text-white font-semibold pr-8">
        {coach.first_name} {coach.last_name}
      </h3>

      {/* School */}
      <p className="text-gray-400 text-sm mt-0.5">{coach.school_name}</p>

      {/* Position */}
      <p className="text-gray-500 text-sm">{coach.position_title}</p>

      {/* Division badge */}
      <Badge variant="coach" className="mt-2">
        {coach.division_level}
      </Badge>

      {/* Contact icons */}
      <div className="flex items-center gap-1 mt-3">
        {coach.email && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(coach.email!)
            }}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
            title="Copy email"
          >
            <Mail className="w-4 h-4 text-gray-400 group-hover:text-portal-gold transition-colors" />
          </button>
        )}
        {coach.twitter && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.open(`https://twitter.com/${coach.twitter}`, '_blank')
            }}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
            title="Open Twitter"
          >
            <Twitter className="w-4 h-4 text-gray-400 group-hover:text-portal-gold transition-colors" />
          </button>
        )}
        {coach.phone && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(coach.phone!)
            }}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
            title="Copy phone"
          >
            <Phone className="w-4 h-4 text-gray-400 group-hover:text-portal-gold transition-colors" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
