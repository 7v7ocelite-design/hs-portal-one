export type UserRole = 'athlete' | 'coach' | 'club'

export interface Profile {
  id: string
  user_id: string
  role: UserRole | null
  email: string | null
  onboarding_complete: boolean
  subscription_tier: string
  stripe_customer_id: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Athlete {
  id: string
  profile_id: string
  first_name: string
  last_name: string
  primary_position: string
  secondary_position: string | null
  graduation_year: number
  high_school: string
  city: string
  state: string
  height_feet: number | null
  height_inches: number | null
  weight_lbs: number | null
  gpa: number | null
  hudl_link: string | null
  twitter_handle: string | null
  phone: string | null
  parent_email: string | null
  created_at: string
}

export interface HSCoach {
  id: string
  profile_id: string
  school_name: string
  first_name: string
  last_name: string
  city: string
  state: string
  sport_type: 'football' | 'flag_football' | 'both'
  title: string | null
  school_enrollment: number | null
  conference: string | null
  created_at: string
}

export interface Club {
  id: string
  profile_id: string
  club_name: string
  director_first_name: string
  director_last_name: string
  city: string
  state: string
  sport_type: '7on7' | 'flag_football' | 'both'
  primary_color: string | null
  secondary_color: string | null
  website: string | null
  roster_count: number | null
  created_at: string
}

// Form data types for onboarding
export interface AthleteFormData {
  first_name: string
  last_name: string
  primary_position: string
  secondary_position?: string
  graduation_year: number
  high_school: string
  city: string
  state: string
  height_feet?: number
  height_inches?: number
  weight_lbs?: number
  gpa?: number
  hudl_link?: string
  twitter_handle?: string
  phone?: string
  parent_email?: string
}

export interface HSCoachFormData {
  school_name: string
  first_name: string
  last_name: string
  city: string
  state: string
  sport_type: 'football' | 'flag_football' | 'both'
  title?: string
  school_enrollment?: number
  conference?: string
}

export interface ClubFormData {
  club_name: string
  director_first_name: string
  director_last_name: string
  city: string
  state: string
  sport_type: '7on7' | 'flag_football' | 'both'
  primary_color?: string
  secondary_color?: string
  website?: string
  roster_count?: number
}
