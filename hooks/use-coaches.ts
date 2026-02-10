import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Coach, CoachFilters } from '@/types/coach'

const PAGE_SIZE = 50

export function useCoaches(filters: CoachFilters = {}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['coaches', filters],
    queryFn: async (): Promise<Coach[]> => {
      let query = supabase
        .from('coaches')
        .select('*')
        .range(0, 9999)   // Override Supabase's 1,000 row default
        .order('school_name')

      if (filters.division) {
        query = query.eq('division_level', filters.division)
      }
      if (filters.state) {
        query = query.eq('state', filters.state)
      }
      if (filters.position) {
        query = query.ilike('position_title', `%${filters.position}%`)
      }
      if (filters.conference) {
        query = query.eq('conference', filters.conference)
      }
      if (filters.hasEmail) {
        query = query.not('email', 'is', null)
      }
      if (filters.hasTwitter) {
        query = query.not('twitter', 'is', null)
      }
      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,school_name.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query

      if (error) throw error
      return data as Coach[]
    },
  })
}

export function useCoachesPaginated(filters: CoachFilters = {}) {
  const supabase = createClient()

  return useInfiniteQuery({
    queryKey: ['coaches-paginated', filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ coaches: Coach[]; nextPage: number | null; total: number }> => {
      let countQuery = supabase
        .from('coaches')
        .select('*', { count: 'exact', head: true })

      let query = supabase
        .from('coaches')
        .select('*')
        .order('school_name')
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)

      // Apply filters to both queries
      if (filters.division) {
        query = query.eq('division_level', filters.division)
        countQuery = countQuery.eq('division_level', filters.division)
      }
      if (filters.state) {
        query = query.eq('state', filters.state)
        countQuery = countQuery.eq('state', filters.state)
      }
      if (filters.position) {
        query = query.ilike('position_title', `%${filters.position}%`)
        countQuery = countQuery.ilike('position_title', `%${filters.position}%`)
      }
      if (filters.conference) {
        query = query.eq('conference', filters.conference)
        countQuery = countQuery.eq('conference', filters.conference)
      }
      if (filters.hasEmail) {
        query = query.not('email', 'is', null)
        countQuery = countQuery.not('email', 'is', null)
      }
      if (filters.hasTwitter) {
        query = query.not('twitter', 'is', null)
        countQuery = countQuery.not('twitter', 'is', null)
      }
      if (filters.search) {
        const searchFilter = `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,school_name.ilike.%${filters.search}%`
        query = query.or(searchFilter)
        countQuery = countQuery.or(searchFilter)
      }

      const [{ data, error }, { count }] = await Promise.all([
        query,
        countQuery
      ])

      if (error) throw error

      const total = count || 0
      const hasMore = (pageParam + 1) * PAGE_SIZE < total

      return {
        coaches: data as Coach[],
        nextPage: hasMore ? pageParam + 1 : null,
        total
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  })
}

export function useCoach(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['coach', id],
    queryFn: async (): Promise<Coach | null> => {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Coach
    },
    enabled: !!id,
  })
}
