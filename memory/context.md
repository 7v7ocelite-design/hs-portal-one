# HS Portal One - Context File
# ================================
# Ralph reads this FIRST to understand the project.
# This file NEVER changes during the build.
# ================================

## What We Are Building
**High School Portal 1** - A multi-tenant college football recruiting platform that connects:
- Athletes (blue accent #3b82f6)
- High School Programs (gold accent #d4af37)
- Clubs (purple accent #9333ea)

...with **3,423 verified college coaches** stored in Supabase.

## Tech Stack (LOCKED - Do Not Change)
- **Framework**: Next.js 14.2.x (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4.x
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Maps**: Leaflet.js
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Toasts**: Sonner

## Database Connection
```
URL: https://jilvjnqnihseykwzvpzp.supabase.co
```

## CRITICAL RULE
**ALWAYS** query `tier1_coaches` view (3,423 verified coaches).
**NEVER** query `coaches` table directly (contains bad data).

## Design System
- Background: `#0a0a0f`
- Cards: `#12141a`
- Border: `#2a2d35`
- Coach accent (EA Sports red): `#c41e3a`

## Where to Find Details
- **SPEC.md** - Complete technical specification with copy-paste code
- **prd.md** - Task list with checkboxes (The Map)
- **progress.txt** - Notes from previous sessions (The Diary)

## Your Role
You are Ralph, an autonomous coding agent. Each session:
1. Read this context
2. Read prd.md to find your task
3. Read progress.txt to see what's been done
4. Execute ONE task
5. Write notes to progress.txt
6. Exit

The bash loop will spawn a fresh you for the next task.
