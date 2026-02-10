# HS Portal One - Claude Constitution
# ====================================
# This file tells every fresh Claude instance how to behave.
# Claude reads this FIRST before doing anything.
# ====================================

## Project Overview
**High School Portal 1** - A multi-tenant college football recruiting platform connecting:
- Athletes (blue accent #3b82f6)
- High School Programs (gold accent #d4af37)
- Clubs (purple accent #9333ea)

...with **3,423 verified college coaches** stored in Supabase.

---

## CRITICAL DATABASE RULE

```
⚠️ ALWAYS query `tier1_coaches` view (3,423 verified coaches)
⚠️ NEVER query `coaches` table directly (contains 5,233 with bad data)
```

**Supabase URL**: `https://jilvjnqnihseykwzvpzp.supabase.co`

---

## Tech Stack (LOCKED - Do Not Change)

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 14.2.x |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS | 3.4.x |
| Database | Supabase | PostgreSQL |
| Auth | Supabase Auth | - |
| Payments | Stripe | - |
| Maps | Leaflet.js | - |
| Data Fetching | TanStack Query | v5 |
| Forms | React Hook Form + Zod | - |
| Icons | Lucide React | - |
| Toasts | Sonner | - |

---

## Design System (MEMORIZE)

### Colors
```
Background:     #0a0a0f
Card:           #12141a
Card Hover:     #1a1d24
Border:         #2a2d35
Text Primary:   #ffffff
Text Secondary: #a0a0a0

Athlete:        #3b82f6 (blue)
High School:    #d4af37 (gold)
Club:           #9333ea (purple)
Coach Accent:   #c41e3a (EA Sports red)
```

### Component Patterns
- Dark theme ONLY (no light mode)
- Cards have subtle borders (#2a2d35)
- Hover states lighten background slightly
- Use Lucide icons consistently
- Toasts via Sonner (bottom-right)

---

## File Structure

```
hs-portal-one/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   ├── coaches/
│   │   └── page.tsx            # Coach directory
│   ├── dashboard/
│   │   ├── athlete/page.tsx
│   │   ├── highschool/page.tsx
│   │   └── club/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── api/
│       └── webhooks/stripe/route.ts
├── components/
│   ├── ui/                     # Base components (Button, Input, Card, etc.)
│   ├── coaches/                # Coach-specific components
│   ├── layout/                 # Navbar, Footer, Sidebar
│   └── providers/              # React Query, Auth providers
├── hooks/
│   ├── use-coaches.ts
│   ├── use-user.ts
│   ├── use-favorites.ts
│   └── use-subscription.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   └── utils.ts                # cn() helper, formatters
├── types/
│   ├── database.ts             # Supabase generated types
│   ├── coach.ts
│   └── user.ts
└── memory/                     # Infinite Memory Loop
    ├── context.md              # The Goal (read-only)
    ├── todo.md                 # The Map (task checkboxes)
    ├── progress.txt            # The Diary (session notes)
    └── agents.md               # Long-term memory (learned rules)
```

---

## Import Patterns (ALWAYS USE)

```typescript
// Use @ alias for all imports
import { Button } from '@/components/ui/button'
import { useCoaches } from '@/hooks/use-coaches'
import { cn } from '@/lib/utils'
import type { Coach } from '@/types/coach'
import { createClient } from '@/lib/supabase/client'
```

---

## Component Rules

1. **Client Components**: Add `'use client'` directive if component has:
   - useState, useEffect, or any hooks
   - Event handlers (onClick, onChange, etc.)
   - Browser APIs

2. **Server Components**: Default for pages/layouts that just render data

3. **Naming**:
   - Components: PascalCase (`CoachCard.tsx`)
   - Hooks: camelCase with `use` prefix (`use-coaches.ts`)
   - Utils: camelCase (`formatDate.ts`)

---

## Database Tables

### `tier1_coaches` (VIEW - USE THIS)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| first_name | text | Coach first name |
| last_name | text | Coach last name |
| email | text | Email (may be null) |
| phone | text | Phone (may be null) |
| title | text | Position title |
| school | text | School name |
| state | text | State code |
| division | text | NCAA division |
| conference | text | Athletic conference |
| created_at | timestamp | Record creation |

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (matches auth.users) |
| email | text | User email |
| user_type | text | 'athlete' \| 'highschool' \| 'club' |
| subscription_tier | text | 'free' \| 'starter' \| 'pro' \| 'elite' |
| created_at | timestamp | Record creation |

### `favorites`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to users |
| coach_id | uuid | Foreign key to tier1_coaches |
| created_at | timestamp | When favorited |

---

## Your Behavior

### When Starting a Session:
1. Read `memory/context.md` (understand the project)
2. Read `memory/todo.md` (find unchecked tasks)
3. Read `memory/progress.txt` (see what's been done)
4. Read `memory/agents.md` (check learned rules)
5. Pick ONE unchecked task
6. Execute it completely
7. Update `todo.md` (check off task)
8. Write to `progress.txt` (leave notes for next instance)
9. If you learn a new rule, add it to `agents.md`

### Code Quality:
- TypeScript strict mode (no `any` types)
- Handle loading and error states
- Use proper Supabase types
- Follow existing patterns in codebase

### When Stuck:
- Check `SPEC.md` for copy-paste code
- Check `agents.md` for known gotchas
- If truly stuck, write detailed notes in `progress.txt` and mark task as BLOCKED

---

## Quick Reference

```typescript
// Supabase query pattern
const { data, error } = await supabase
  .from('tier1_coaches')  // ✅ ALWAYS use tier1_coaches
  .select('*')
  .limit(50)

// NEVER do this:
// .from('coaches')  // ❌ WRONG - has bad data
```

---

## Where to Find Things

| Need | File |
|------|------|
| Complete technical spec | `SPEC.md` |
| Copy-paste components | `SPEC.md` |
| Task list | `memory/todo.md` |
| Previous session notes | `memory/progress.txt` |
| Learned rules | `memory/agents.md` |
| School coordinates | `school-coordinates.ts` |
