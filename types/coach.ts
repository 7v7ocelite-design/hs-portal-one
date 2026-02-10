export interface Coach {
  id: number
  first_name: string
  last_name: string
  school_name: string
  position_title: string
  division_level: string
  conference: string | null
  state: string | null
  email: string | null
  twitter: string | null
  phone: string | null
  created_at: string
}

export interface CoachFilters {
  division?: string
  state?: string
  position?: string
  conference?: string
  hasEmail?: boolean
  hasTwitter?: boolean
  search?: string
}

export type Division = 'FBS' | 'FCS' | 'D2' | 'D3' | 'NAIA' | 'JUCO'
