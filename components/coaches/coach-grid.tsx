'use client'

import { motion } from 'framer-motion'
import { CoachCard } from './coach-card'
import { CoachCardSkeleton } from '@/components/ui/skeleton'
import type { Coach } from '@/types/coach'

interface CoachGridProps {
  coaches: Coach[]
  isLoading?: boolean
  favorites?: number[]
  onFavorite?: (id: number) => void
  onCoachClick?: (coach: Coach) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function CoachGrid({ coaches, isLoading, favorites = [], onFavorite, onCoachClick }: CoachGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <CoachCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (coaches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-400">No coaches found matching your criteria.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {coaches.map((coach) => (
        <motion.div key={coach.id} variants={itemVariants}>
          <CoachCard
            coach={coach}
            isFavorited={favorites.includes(coach.id)}
            onFavorite={onFavorite}
            onClick={() => onCoachClick?.(coach)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
