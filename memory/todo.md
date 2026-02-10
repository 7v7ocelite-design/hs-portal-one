# HS Portal One - Task List (The Map)
# ====================================
# [x] = Done, [ ] = Pending, [B] = Blocked (waiting on dependency)
# Last audited: 2026-02-05
# ====================================

## ✅ SESSION 2026-02-05 - Completed

- [x] Fix query to show all 8,783 coaches (was 1,000 limit)
- [x] Add RLS SELECT policy to coaches table
- [x] Change branding from "EA SPORTS" to "AIC"
- [x] Update tagline to "College Coach Database"
- [x] Add search bar to sidebar
- [x] Fix "TARGETS" display → "SHOWING X of Y coaches"
- [x] Create /admin/coaches page with edit UI
- [x] Add isAdmin prop to CoachModal (edit button only for admins)

---

## ✅ SESSION 2026-02-06 - Auth System Working!

- [x] Ran supabase-auth-setup.sql in Supabase
- [x] Fixed RLS infinite recursion bug in profiles table
- [x] Added temp UPDATE policy on coaches table
- [x] Admin edit functionality WORKING
- [x] Tested full signup → onboarding → database save flow
- [x] Verified athlete data saves correctly to database
- [ ] Protect /admin routes (redirect non-admins)
- [ ] User vs Admin dashboard separation

---

## Phase 1: Foundation

- [x] Initialize Next.js 14 with App Router and TypeScript strict mode
- [x] Configure Tailwind CSS with custom color tokens
- [x] Set up ESLint with Next.js recommended config
- [x] Create .env.local with Supabase credentials
- [x] Create lib/supabase/client.ts (browser client)
- [ ] Create lib/supabase/server.ts (server client)
- [ ] Create lib/supabase/middleware.ts (auth middleware)
- [ ] Create middleware.ts in root (route protection)
- [x] Create lib/utils.ts with cn() function
- [x] Create lib/constants.ts with colors, divisions, states, positions
- [x] Create types/database.ts with Database type
- [x] Create types/coach.ts with Coach and CoachFilters types
- [x] Create types/user.ts with User, AthleteProfile, Subscription types
- [x] Create providers/query-provider.tsx for TanStack Query
- [x] Create app/globals.css with dark theme styles
- [x] Create app/layout.tsx with QueryProvider and Toaster

## Phase 2: UI Components

- [x] Create components/ui/button.tsx
- [x] Create components/ui/input.tsx
- [ ] Create components/ui/label.tsx
- [x] Create components/ui/card.tsx
- [x] Create components/ui/badge.tsx
- [ ] Create components/ui/modal.tsx (generic reusable)
- [x] Create components/ui/skeleton.tsx
- [x] Create components/ui/toggle.tsx

## Phase 3: Layout Components

- [x] Create components/layout/navbar.tsx
- [x] Create components/layout/footer.tsx

## Phase 4: Data Hooks

- [x] Create hooks/use-coaches.ts (useCoaches, useCoachesPaginated)
- [ ] Create hooks/use-user.ts (useUser, useUpdateProfile)
- [ ] Create hooks/use-favorites.ts
- [ ] Create hooks/use-subscription.ts

## Phase 5: Coach Components ✅ COMPLETE

- [x] components/coaches/coach-card.tsx
- [x] components/coaches/coach-grid.tsx
- [x] components/coaches/ea-sidebar.tsx (with search)
- [x] components/coaches/coach-modal.tsx (with edit mode)
- [x] components/coaches/ea-coach-table.tsx
- [x] components/coaches/team-modal.tsx

## Phase 6: Pages (Partial)

- [x] app/page.tsx (landing page)
- [x] app/coaches/page.tsx (public coach database)
- [x] app/admin/coaches/page.tsx (admin with edit access)
- [x] app/(auth)/login/page.tsx
- [x] app/(auth)/signup/page.tsx
- [x] app/(auth)/layout.tsx
- [x] app/onboarding/page.tsx (role selection)
- [x] app/onboarding/athlete/page.tsx
- [x] app/onboarding/coach/page.tsx
- [x] app/onboarding/club/page.tsx

---

## ✅ SESSION 2026-02-05 - Auth System Built

### Completed:
- [x] Create supabase-auth-setup.sql (all tables, triggers, RLS)
- [x] Create types/user.ts
- [x] Create app/(auth)/login/page.tsx
- [x] Create app/(auth)/signup/page.tsx
- [x] Create app/onboarding/page.tsx (role selection)
- [x] Create app/onboarding/athlete/page.tsx
- [x] Create app/onboarding/coach/page.tsx
- [x] Create app/onboarding/club/page.tsx
- [x] Add ROLE_COLORS, FOOTBALL_POSITIONS, GRADUATION_YEARS to constants

### Pending:
- [x] **USER ACTION: Run supabase-auth-setup.sql in Supabase** ✅ DONE
- [ ] Create lib/supabase/server.ts
- [ ] Create hooks/use-user.ts
- [ ] Create middleware.ts for route protection
- [ ] Create dashboard pages (/dashboard/athlete, /dashboard/coach, /dashboard/club)
- [ ] Add secure RLS UPDATE policy for admins (replace temp policy)
- [x] Test: signup → onboarding → dashboard flow ✅ WORKING

---

## Phase 7: Map Feature

- [x] school-coordinates.ts (exists at root)
- [ ] components/map/map-container.tsx
- [ ] components/map/school-marker.tsx
- [ ] app/map/page.tsx

## Phase 8: User Dashboards

- [ ] app/(dashboard)/layout.tsx
- [ ] app/(dashboard)/athlete/page.tsx
- [ ] app/(dashboard)/high-school/page.tsx
- [ ] app/(dashboard)/club/page.tsx

## Phase 9: Admin Dashboard

- [ ] app/admin/layout.tsx
- [ ] app/admin/dashboard/page.tsx
- [ ] app/admin/users/page.tsx

## Phase 10: Payments (Stripe)

- [ ] lib/stripe/client.ts
- [ ] app/pricing/page.tsx
- [ ] app/api/checkout/route.ts
- [ ] app/api/webhooks/stripe/route.ts

## Phase 11: Polish & QA

- [ ] Loading states
- [ ] Error boundaries
- [ ] Mobile responsive (375px)
- [ ] npm run build (fix errors)
- [ ] npm run lint (fix warnings)

---

## 🐛 KNOWN DATA ISSUES (Fix via Admin after Auth)

| Coach | Issue | Fix |
|-------|-------|-----|
| Jovon Hubbard | Name in POS column | Change to "Assistant GM" |
| Patrick Allen | "1" in SCHOOL | Fix school name |
| "Recruiting" | Title as name | Find real name |
| "Dir" | Truncated | Find full name |
| 174 coaches | NULL state | Infer from school |

---

# Summary
- **Done**: Coach database UI (8,783 coaches), search, filters, admin page, auth system, onboarding
- **Done**: Admin edits WORKING (temp RLS policy)
- **Next**: Dashboard pages, then Robot Scouts
- **Estimated remaining**: ~35 tasks across 6 phases

---

## 🗺️ MASTER BUILD ORDER (2026-02-06)

### Phase 1: NOW (Close the loop)
- [ ] Run SQL: Add verification columns to coaches table
- [ ] Build /dashboard/athlete page (welcome + profile display)
- [ ] Build /dashboard/coach page (HS program dashboard)
- [ ] Build /dashboard/club page (club/7on7 dashboard)
- [ ] Quick test coach + club onboarding
- [ ] Add route protection middleware
- [ ] Add freshness badge component to coach cards

### Phase 2: NEXT (Data infrastructure + Robot Scouts)
- [ ] Set up Visualping account (free tier)
- [ ] Add first 10-25 priority schools to monitor
- [ ] Create /api/scouts/alert webhook endpoint
- [ ] Build verification_queue table for pending reviews
- [ ] Add "Pending Review" section to admin dashboard
- [ ] CrewAI scraping agents for roster/coaching data
- [ ] Finalize rosters/schools/transfers schema

### Priority Schools for Robot Scouts:
| Tier | Schools |
|------|---------|
| 1 (SEC) | Alabama, Auburn, Georgia, LSU, Texas, Oklahoma |
| 2 (Big Ten) | Ohio State, Michigan, Penn State, USC |
| 3 (Big 12) | Colorado, Arizona, Utah, Kansas State |
| 4 (ACC) | Clemson, Florida State, Miami, NC State |

### Phase 3: THEN (UI Polish with v0 by Vercel)
- [ ] Recruiting dashboard redesign (v0 prompts)
- [ ] Coach profiles enhanced view
- [ ] Advanced search/filter
- [ ] Transfer alerts system
- [ ] Mobile-first responsive design

### v0 UI Components to Generate:
| Component | Description |
|-----------|-------------|
| DashboardLayout | Sidebar + header + main content area |
| CoachCard | Enhanced card with freshness badge |
| AthleteProfile | Full profile view with stats |
| SearchFilters | Advanced filter panel |
| TransferAlert | Alert card for coaching changes |
| FreshnessBadge | 🟢🟡🔴 verification status |

### Phase 4: LAST (Launch prep)
- [ ] Stripe payments
- [ ] Mobile optimization
- [ ] Re-enable email confirmation
- [ ] Remove temp RLS policies
- [ ] Production deploy

---

## 🤖 ROBOT SCOUTS (Data Freshness)

### Tools to Evaluate:
- Visualping (visual diff monitoring)
- Sken.io (visual monitoring)
- ChangeTower (keyword monitoring)
- Wachete (keyword monitoring)
- Distill.io (webhooks support)

### Integration Plan:
1. Start with email alerts (manual verification)
2. Add webhook API endpoint: POST /api/scouts/update
3. Auto-update last_verified_at on coach records
4. Display freshness badges in UI:
   - 🟢 Verified today
   - 🟡 Verified this week
   - 🔴 Needs verification (30+ days)

### Schema Addition:
```sql
ALTER TABLE coaches ADD COLUMN last_verified_at timestamptz;
ALTER TABLE coaches ADD COLUMN verification_source text;
```

---

## 🎨 DESIGN SYSTEM (v0 + Tailwind)

### Role Colors (Finalized):
| Role | Color | Hex | Tailwind |
|------|-------|-----|----------|
| Athlete | Blue | #3b82f6 | blue-500 |
| HS Coach | Green | #22c55e | green-500 |
| Club | Orange | #f97316 | orange-500 |

### Freshness Badge Colors:
| Status | Color | Hex | Meaning |
|--------|-------|-----|---------|
| LIVE | Green | #22c55e | Verified < 24 hours |
| RECENT | Yellow | #eab308 | Verified < 7 days |
| AGING | Orange | #f97316 | Verified < 30 days |
| STALE | Red | #ef4444 | Verified > 30 days |

### Base Colors:
| Element | Hex |
|---------|-----|
| Background | #0a0a0f |
| Card | #12141a |
| Border | #2a2d35 |
| Text Primary | #ffffff |
| Text Secondary | #9ca3af |

### Typography:
- Headings: Inter (bold/black)
- Body: Inter (regular)
- Monospace: JetBrains Mono (stats, data)

### Component Style:
- Dark mode only (EA Sports aesthetic)
- Rounded corners: rounded-lg (8px)
- Cards: subtle border + glow on hover
- Buttons: solid with hover state
- Inputs: dark bg, subtle border, colored focus ring

### Dashboard Layout:
```
┌────────────────────────────────────────────────────┐
│  HEADER (Logo + Search + User Menu)                │
├──────────┬─────────────────────────────────────────┤
│          │                                         │
│  SIDEBAR │          MAIN CONTENT                   │
│  (Nav)   │                                         │
│          │                                         │
│          │                                         │
│          │                                         │
├──────────┴─────────────────────────────────────────┤
│  FOOTER (Powered by AIC)                           │
└────────────────────────────────────────────────────┘
```
