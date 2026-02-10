export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'athlete' | 'high_school' | 'club'
          first_name: string | null
          last_name: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'athlete' | 'high_school' | 'club'
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          avatar_url?: string | null
        }
        Update: {
          role?: 'athlete' | 'high_school' | 'club'
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      athlete_profiles: {
        Row: {
          id: string
          user_id: string
          grad_year: number | null
          position: string | null
          height_inches: number | null
          weight_lbs: number | null
          gpa: number | null
          forty_time: number | null
          film_url: string | null
          city: string | null
          state: string | null
          high_school: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          grad_year?: number | null
          position?: string | null
          height_inches?: number | null
          weight_lbs?: number | null
          gpa?: number | null
          forty_time?: number | null
          film_url?: string | null
          city?: string | null
          state?: string | null
          high_school?: string | null
        }
        Update: Partial<Omit<Database['public']['Tables']['athlete_profiles']['Insert'], 'user_id'>>
      }
      organizations: {
        Row: {
          id: string
          user_id: string
          org_type: 'high_school' | 'club'
          name: string
          city: string | null
          state: string | null
          conference: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          org_type: 'high_school' | 'club'
          name: string
          city?: string | null
          state?: string | null
          conference?: string | null
          website?: string | null
        }
        Update: Partial<Omit<Database['public']['Tables']['organizations']['Insert'], 'user_id'>>
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          coach_id: number
          created_at: string
        }
        Insert: {
          user_id: string
          coach_id: number
        }
        Update: never
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'free' | 'premium' | 'canceled'
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'free' | 'premium' | 'canceled'
          current_period_end?: string | null
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
    }
    Views: {
      tier1_coaches: {
        Row: {
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
      }
    }
  }
}
