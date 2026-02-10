import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'athlete' | 'high-school' | 'club' | 'coach'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        {
          'bg-border text-gray-300': variant === 'default',
          'bg-athlete/20 text-athlete': variant === 'athlete',
          'bg-high-school/20 text-high-school': variant === 'high-school',
          'bg-club/20 text-club': variant === 'club',
          'bg-coach-accent/20 text-coach-accent': variant === 'coach',
        },
        className
      )}
      {...props}
    />
  )
}
