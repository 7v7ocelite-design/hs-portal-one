# High School Portal 1 - Technical Specification
# ================================================
# Ralph reads this file for ALL technical decisions.
# Every question should be answered here BEFORE running the loop.
# If Ralph has to make a decision, the spec is incomplete.
# ================================================

## Project Overview

**Name:** High School Portal 1
**Purpose:** Multi-tenant college football recruiting platform
**Users:** Athletes, High School Programs, Clubs → connecting with College Coaches

---

## Tech Stack (FINAL - No Changes)

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 14.2.x (App Router) |
| Language | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | 3.4.x |
| Database | Supabase | Latest |
| Auth | Supabase Auth | Built-in |
| Payments | Stripe | 14.x |
| Maps | Leaflet.js | 1.9.x |
| React Query | TanStack Query | 5.x |
| Forms | React Hook Form | 7.x |
| Validation | Zod | 3.x |
| Icons | Lucide React | 0.400+ |
| Toasts | Sonner | 1.x |

---

## Package.json (EXACT - Copy This)

```json
{
  "name": "high-school-portal-1",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.15",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "@tanstack/react-query": "^5.56.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.8",
    "stripe": "^14.25.0",
    "@stripe/stripe-js": "^4.5.0",
    "lucide-react": "^0.441.0",
    "sonner": "^1.5.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.5.0",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/leaflet": "^1.9.12",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.45",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.15"
  }
}
```

---

## Folder Structure (EXACT)

```
/high-school-portal-1
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── athlete/page.tsx
│   │   ├── high-school/page.tsx
│   │   ├── club/page.tsx
│   │   └── layout.tsx
│   ├── coaches/
│   │   └── page.tsx
│   ├── map/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── onboarding/
│   │   ├── athlete/page.tsx
│   │   ├── high-school/page.tsx
│   │   └── club/page.tsx
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts
│   │   └── checkout/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── modal.tsx
│   │   ├── skeleton.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown.tsx
│   │   └── toggle.tsx
│   ├── coaches/
│   │   ├── coach-card.tsx
│   │   ├── coach-filters.tsx
│   │   ├── coach-grid.tsx
│   │   ├── coach-profile-modal.tsx
│   │   └── coach-search.tsx
│   ├── map/
│   │   ├── map-container.tsx
│   │   ├── school-marker.tsx
│   │   ├── school-popup.tsx
│   │   └── map-filters.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── sidebar.tsx
│   ├── forms/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── onboarding/
│   │       ├── athlete-form.tsx
│   │       ├── high-school-form.tsx
│   │       └── club-form.tsx
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── role-cards.tsx
│   │   ├── features.tsx
│   │   └── cta.tsx
│   └── dashboard/
│       ├── stats-card.tsx
│       ├── recent-activity.tsx
│       └── quick-actions.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe/
│   │   └── client.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── use-coaches.ts
│   ├── use-user.ts
│   ├── use-favorites.ts
│   └── use-subscription.ts
├── types/
│   ├── database.ts
│   ├── coach.ts
│   └── user.ts
├── data/
│   └── school-coordinates.ts
├── providers/
│   └── query-provider.tsx
├── middleware.ts
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── postcss.config.mjs
```

---

## Environment Variables (EXACT)

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://jilvjnqnihseykwzvpzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbHZqbnFuaWhzZXlrd3p2cHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODgzNDgsImV4cCI6MjA4MTA2NDM0OH0.0opKDN7FHfA--ROX0Bw9NRkls_JwbLXJKMIs37S4uyE

# Stripe (Replace with actual keys)
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
STRIPE_PRICE_ID_PREMIUM=price_REPLACE_ME
```

---

## TypeScript Config (EXACT)

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Next.js Config (EXACT)

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
```

---

## PostCSS Config (EXACT)

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

---

## Tailwind Config (EXACT)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: {
          DEFAULT: '#12141a',
          hover: '#1a1d24',
        },
        border: {
          DEFAULT: '#2a2d35',
          hover: '#3a3d45',
        },
        athlete: '#3b82f6',
        'high-school': '#d4af37',
        club: '#9333ea',
        'coach-accent': '#c41e3a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Global CSS (EXACT)

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --background: #0a0a0f;
  --card: #12141a;
  --card-hover: #1a1d24;
  --border: #2a2d35;
  --border-hover: #3a3d45;
  --athlete: #3b82f6;
  --high-school: #d4af37;
  --club: #9333ea;
  --coach-accent: #c41e3a;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: var(--background);
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--border-hover);
}

/* Leaflet dark mode overrides */
.leaflet-container {
  background: var(--background) !important;
}

.leaflet-popup-content-wrapper {
  background: var(--card) !important;
  color: white !important;
  border-radius: 8px !important;
}

.leaflet-popup-tip {
  background: var(--card) !important;
}
```

---

## Database Schema (Supabase)

### Existing Tables (DO NOT MODIFY)
- `coaches` - Raw coach data (5,233 records)
- `tier1_coaches` - VIEW of verified coaches (3,423 records) ← **ALWAYS USE THIS**

### tier1_coaches View Schema (READ ONLY)
```typescript
interface Tier1Coach {
  id: number
  first_name: string
  last_name: string
  school_name: string
  position_title: string
  division_level: 'FBS' | 'FCS' | 'D2' | 'D3' | 'NAIA' | 'JUCO'
  conference: string | null
  state: string | null
  email: string | null
  twitter: string | null
  phone: string | null
  created_at: string
}
```

### Tables to Create (Run in Supabase SQL Editor)

```sql
-- 1. User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('athlete', 'high_school', 'club')),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'athlete');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Athlete profiles
CREATE TABLE IF NOT EXISTS athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  grad_year INTEGER,
  position TEXT,
  height_inches INTEGER,
  weight_lbs INTEGER,
  gpa DECIMAL(3,2),
  forty_time DECIMAL(4,2),
  film_url TEXT,
  city TEXT,
  state TEXT,
  high_school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own athlete profile" ON athlete_profiles
  FOR ALL USING (auth.uid() = user_id);

-- 3. Organizations (high schools & clubs)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  org_type TEXT NOT NULL CHECK (org_type IN ('high_school', 'club')),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  conference TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own organization" ON organizations
  FOR ALL USING (auth.uid() = user_id);

-- 4. User favorites (saved coaches)
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coach_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- 5. Subscriptions (synced from Stripe)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'premium', 'canceled')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Coach view tracking (for free tier limits)
CREATE TABLE IF NOT EXISTS coach_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id INTEGER NOT NULL,
  viewed_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coach_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own views" ON coach_views
  FOR ALL USING (auth.uid() = user_id);

-- Index for daily view counting
CREATE INDEX idx_coach_views_user_date ON coach_views(user_id, viewed_at);
```

---

## TypeScript Types (EXACT)

```typescript
// types/database.ts
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
```

```typescript
// types/coach.ts
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
```

```typescript
// types/user.ts
export interface User {
  id: string
  email: string
  role: 'athlete' | 'high_school' | 'club'
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

export interface AthleteProfile {
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
}

export interface Organization {
  org_type: 'high_school' | 'club'
  name: string
  city: string | null
  state: string | null
  conference: string | null
  website: string | null
}

export interface Subscription {
  status: 'free' | 'premium' | 'canceled'
  current_period_end: string | null
}
```

---

## Utility Functions (EXACT)

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatHeight(inches: number | null): string {
  if (!inches) return '—'
  const feet = Math.floor(inches / 12)
  const remainingInches = inches % 12
  return `${feet}'${remainingInches}"`
}

export function formatWeight(lbs: number | null): string {
  if (!lbs) return '—'
  return `${lbs} lbs`
}

export function getInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.[0]?.toUpperCase() || ''
  const last = lastName?.[0]?.toUpperCase() || ''
  return `${first}${last}` || '?'
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

---

## Constants (EXACT)

```typescript
// lib/constants.ts
export const DIVISIONS = [
  { value: 'FBS', label: 'FBS (Division I)' },
  { value: 'FCS', label: 'FCS (Division I-AA)' },
  { value: 'D2', label: 'Division II' },
  { value: 'D3', label: 'Division III' },
  { value: 'NAIA', label: 'NAIA' },
  { value: 'JUCO', label: 'Junior College' },
] as const

export const POSITIONS = [
  'Head Coach',
  'Offensive Coordinator',
  'Defensive Coordinator',
  'Quarterbacks',
  'Running Backs',
  'Wide Receivers',
  'Tight Ends',
  'Offensive Line',
  'Defensive Line',
  'Linebackers',
  'Defensive Backs',
  'Special Teams',
  'Strength & Conditioning',
  'Recruiting Coordinator',
] as const

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
] as const

export const COLORS = {
  background: '#0a0a0f',
  card: '#12141a',
  cardHover: '#1a1d24',
  border: '#2a2d35',
  borderHover: '#3a3d45',
  athlete: '#3b82f6',
  highSchool: '#d4af37',
  club: '#9333ea',
  coachAccent: '#c41e3a',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
} as const

export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'Please sign in to continue',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_IN_USE: 'This email is already registered',
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  COACH_LOAD_ERROR: 'Unable to load coaches. Please try again.',
  FAVORITE_ERROR: 'Unable to save favorite. Please try again.',
  UPGRADE_REQUIRED: 'Upgrade to Premium to access this feature',
  DAILY_LIMIT: "You've reached your daily limit. Upgrade for unlimited access.",
} as const

export const FREE_TIER_LIMITS = {
  DAILY_COACH_VIEWS: 10,
  MAX_FAVORITES: 5,
  EMAIL_TEMPLATES: 2,
} as const

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '10 coach views per day',
      '5 saved favorites',
      'Basic map access',
      '2 email templates',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM,
    features: [
      'Unlimited coach views',
      'Unlimited favorites',
      'Full map access with filters',
      'All email templates',
      'Export contacts',
      'Priority support',
    ],
  },
} as const
```

---

## Supabase Client Setup (EXACT)

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
```

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/athlete', '/high-school', '/club', '/onboarding']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users from auth pages
  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/coaches'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

```typescript
// middleware.ts (root)
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## React Query Provider (EXACT)

```typescript
// providers/query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

---

## Data Fetching Hooks (EXACT)

```typescript
// hooks/use-coaches.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Coach, CoachFilters } from '@/types/coach'

export function useCoaches(filters: CoachFilters = {}) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['coaches', filters],
    queryFn: async (): Promise<Coach[]> => {
      let query = supabase
        .from('tier1_coaches')
        .select('*')
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

export function useCoach(id: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['coach', id],
    queryFn: async (): Promise<Coach | null> => {
      const { data, error } = await supabase
        .from('tier1_coaches')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Coach
    },
    enabled: !!id,
  })
}
```

```typescript
// hooks/use-user.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User, AthleteProfile, Organization } from '@/types/user'

export function useUser() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return profile as User | null
    },
  })
}

export function useUpdateProfile() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
```

```typescript
// hooks/use-favorites.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useFavorites() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_favorites')
        .select('coach_id')
        .eq('user_id', user.id)

      if (error) throw error
      return data.map(f => f.coach_id)
    },
  })
}

export function useToggleFavorite() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ coachId, isFavorited }: { coachId: number; isFavorited: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (isFavorited) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('coach_id', coachId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, coach_id: coachId })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
```

```typescript
// hooks/use-subscription.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Subscription } from '@/types/user'

export function useSubscription() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['subscription'],
    queryFn: async (): Promise<Subscription> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { status: 'free', current_period_end: null }

      const { data } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .single()

      return data || { status: 'free', current_period_end: null }
    },
  })
}

export function useIsPremium() {
  const { data: subscription } = useSubscription()
  return subscription?.status === 'premium'
}
```

---

## UI Components (EXACT)

```typescript
// components/ui/button.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-coach-accent text-white hover:bg-coach-accent/90 focus-visible:ring-coach-accent': variant === 'primary',
            'bg-card text-white border border-border hover:bg-card-hover focus-visible:ring-border': variant === 'secondary',
            'text-white hover:bg-white/10 focus-visible:ring-white/20': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600': variant === 'danger',
            'h-8 px-3 text-sm gap-1.5': size === 'sm',
            'h-10 px-4 text-sm gap-2': size === 'md',
            'h-12 px-6 text-base gap-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
```

```typescript
// components/ui/input.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-card px-3 py-2 text-sm text-white',
            'placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border focus:ring-coach-accent',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
```

```typescript
// components/ui/label.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-sm font-medium text-gray-200', className)}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )
  }
)
Label.displayName = 'Label'
```

```typescript
// components/ui/card.tsx
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4',
        hover && 'transition-colors hover:border-border-hover hover:bg-card-hover',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold text-white', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-gray-400', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4 flex items-center gap-2', className)} {...props} />
}
```

```typescript
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-border', className)}
      {...props}
    />
  )
}

export function CoachCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-1" />
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-6 w-16 mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  )
}
```

```typescript
// components/ui/badge.tsx
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
```

```typescript
// components/ui/modal.tsx
'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={cn(
          'relative w-full max-w-lg rounded-lg border border-border bg-card p-6',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        {title && (
          <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        )}

        {children}
      </div>
    </div>
  )
}
```

```typescript
// components/ui/toggle.tsx
'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-coach-accent',
          checked ? 'bg-coach-accent' : 'bg-border'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
            'translate-y-0.5',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  )
}
```

---

## Coach Components (EXACT)

```typescript
// components/coaches/coach-card.tsx
'use client'

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
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-lg border border-border bg-card p-4',
        'transition-all duration-200 hover:border-coach-accent/50 hover:bg-card-hover',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Favorite button */}
      {onFavorite && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-1.5 rounded hover:bg-white/10 transition-colors"
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-colors',
              isFavorited ? 'fill-coach-accent text-coach-accent' : 'text-gray-500 hover:text-gray-300'
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
            className="p-2 rounded hover:bg-white/10 transition-colors group"
            title="Copy email"
          >
            <Mail className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        )}
        {coach.twitter && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.open(`https://twitter.com/${coach.twitter}`, '_blank')
            }}
            className="p-2 rounded hover:bg-white/10 transition-colors group"
            title="Open Twitter"
          >
            <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        )}
        {coach.phone && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(coach.phone!)
            }}
            className="p-2 rounded hover:bg-white/10 transition-colors group"
            title="Copy phone"
          >
            <Phone className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
```

```typescript
// components/coaches/coach-grid.tsx
'use client'

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
      <div className="text-center py-12">
        <p className="text-gray-400">No coaches found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {coaches.map((coach) => (
        <CoachCard
          key={coach.id}
          coach={coach}
          isFavorited={favorites.includes(coach.id)}
          onFavorite={onFavorite}
          onClick={() => onCoachClick?.(coach)}
        />
      ))}
    </div>
  )
}
```

```typescript
// components/coaches/coach-filters.tsx
'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { DIVISIONS, US_STATES, POSITIONS } from '@/lib/constants'
import type { CoachFilters } from '@/types/coach'

interface CoachFiltersProps {
  filters: CoachFilters
  onChange: (filters: CoachFilters) => void
  coachCount?: number
}

export function CoachFiltersPanel({ filters, onChange, coachCount }: CoachFiltersProps) {
  const updateFilter = <K extends keyof CoachFilters>(key: K, value: CoachFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="w-64 shrink-0 space-y-6">
      {/* Search */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search coaches..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Division */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">Division</label>
        <select
          value={filters.division || ''}
          onChange={(e) => updateFilter('division', e.target.value || undefined)}
          className="w-full h-10 rounded-lg border border-border bg-card px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-coach-accent"
        >
          <option value="">All Divisions</option>
          {DIVISIONS.map((div) => (
            <option key={div.value} value={div.value}>{div.label}</option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">State</label>
        <select
          value={filters.state || ''}
          onChange={(e) => updateFilter('state', e.target.value || undefined)}
          className="w-full h-10 rounded-lg border border-border bg-card px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-coach-accent"
        >
          <option value="">All States</option>
          {US_STATES.map((state) => (
            <option key={state.value} value={state.value}>{state.label}</option>
          ))}
        </select>
      </div>

      {/* Position */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">Position</label>
        <select
          value={filters.position || ''}
          onChange={(e) => updateFilter('position', e.target.value || undefined)}
          className="w-full h-10 rounded-lg border border-border bg-card px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-coach-accent"
        >
          <option value="">All Positions</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      {/* Contact toggles */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-200 block">Contact Info</label>
        <Toggle
          checked={filters.hasEmail || false}
          onChange={(checked) => updateFilter('hasEmail', checked || undefined)}
          label="Has Email"
        />
        <Toggle
          checked={filters.hasTwitter || false}
          onChange={(checked) => updateFilter('hasTwitter', checked || undefined)}
          label="Has Twitter"
        />
      </div>

      {/* Coach count */}
      {typeof coachCount === 'number' && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">{coachCount.toLocaleString()}</span> coaches found
          </p>
        </div>
      )}
    </div>
  )
}
```

```typescript
// components/coaches/coach-profile-modal.tsx
'use client'

import { Mail, Twitter, Phone, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Coach } from '@/types/coach'

interface CoachProfileModalProps {
  coach: Coach | null
  isOpen: boolean
  onClose: () => void
}

export function CoachProfileModal({ coach, isOpen, onClose }: CoachProfileModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!coach) return null

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-white">
            {coach.first_name} {coach.last_name}
          </h2>
          <p className="text-gray-400">{coach.position_title}</p>
        </div>

        {/* School info */}
        <div className="p-4 rounded-lg bg-background border border-border">
          <p className="text-white font-medium">{coach.school_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="coach">{coach.division_level}</Badge>
            {coach.conference && (
              <span className="text-sm text-gray-400">{coach.conference}</span>
            )}
          </div>
          {coach.state && (
            <p className="text-sm text-gray-500 mt-1">{coach.state}</p>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-200">Contact Information</h3>

          {coach.email && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">{coach.email}</span>
              </div>
              <button
                onClick={() => copyToClipboard(coach.email!, 'email')}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
              >
                {copiedField === 'email' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          )}

          {coach.twitter && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <Twitter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">@{coach.twitter}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(coach.twitter!, 'twitter')}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors"
                >
                  {copiedField === 'twitter' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <a
                  href={`https://twitter.com/${coach.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>
          )}

          {coach.phone && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">{coach.phone}</span>
              </div>
              <button
                onClick={() => copyToClipboard(coach.phone!, 'phone')}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
              >
                {copiedField === 'phone' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          )}

          {!coach.email && !coach.twitter && !coach.phone && (
            <p className="text-sm text-gray-500">No contact information available.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
```

---

## Layout Components (EXACT)

```typescript
// components/layout/navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/coaches', label: 'Coaches' },
  { href: '/map', label: 'Map' },
  { href: '/pricing', label: 'Pricing' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-coach-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">HS</span>
            </div>
            <span className="font-semibold text-white hidden sm:block">Portal</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-card text-white'
                    : 'text-gray-400 hover:text-white hover:bg-card'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href={`/${user.role.replace('_', '-')}`}>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-card"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm font-medium',
                  pathname === link.href
                    ? 'bg-card text-white'
                    : 'text-gray-400 hover:text-white hover:bg-card'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <>
                  <Link
                    href={`/${user.role.replace('_', '-')}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-card"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-card"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-card"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
```

```typescript
// components/layout/footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-coach-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">HS</span>
            </div>
            <span className="text-sm text-gray-400">High School Portal 1</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/coaches" className="text-sm text-gray-400 hover:text-white transition-colors">
              Coaches
            </Link>
            <Link href="/map" className="text-sm text-gray-400 hover:text-white transition-colors">
              Map
            </Link>
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HS Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

## Root Layout (EXACT)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/query-provider'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'High School Portal 1 - College Football Recruiting',
  description: 'Connect with college football coaches. Find contact information for 3,400+ verified coaches across FBS, FCS, and Division II.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#12141a',
                border: '1px solid #2a2d35',
                color: '#ffffff',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  )
}
```

---

## Coaches Page (EXACT)

```typescript
// app/coaches/page.tsx
'use client'

import { useState } from 'react'
import { CoachGrid } from '@/components/coaches/coach-grid'
import { CoachFiltersPanel } from '@/components/coaches/coach-filters'
import { CoachProfileModal } from '@/components/coaches/coach-profile-modal'
import { useCoaches } from '@/hooks/use-coaches'
import { useFavorites, useToggleFavorite } from '@/hooks/use-favorites'
import type { Coach, CoachFilters } from '@/types/coach'

export default function CoachesPage() {
  const [filters, setFilters] = useState<CoachFilters>({})
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)

  const { data: coaches = [], isLoading } = useCoaches(filters)
  const { data: favorites = [] } = useFavorites()
  const toggleFavorite = useToggleFavorite()

  const handleFavorite = (coachId: number) => {
    toggleFavorite.mutate({
      coachId,
      isFavorited: favorites.includes(coachId),
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Coach Database</h1>
        <p className="text-gray-400 mt-1">
          Browse and connect with college football coaches
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <CoachFiltersPanel
          filters={filters}
          onChange={setFilters}
          coachCount={coaches.length}
        />

        {/* Coach grid */}
        <div className="flex-1">
          <CoachGrid
            coaches={coaches}
            isLoading={isLoading}
            favorites={favorites}
            onFavorite={handleFavorite}
            onCoachClick={setSelectedCoach}
          />
        </div>
      </div>

      {/* Coach profile modal */}
      <CoachProfileModal
        coach={selectedCoach}
        isOpen={!!selectedCoach}
        onClose={() => setSelectedCoach(null)}
      />
    </div>
  )
}
```

---

## Git Commit Message Format

```
type(scope): description

Types: feat, fix, style, refactor, test, docs, chore
Scope: auth, coaches, map, dashboard, payments, ui, layout

Examples:
feat(coaches): add CoachCard component with contact icons
feat(auth): implement login form with validation
fix(coaches): resolve filter not updating results
style(ui): update button hover states
refactor(hooks): extract coach fetching to custom hook
docs: update README with setup instructions
chore: update dependencies
```

---

## Testing Checklist (Run After Each Task)

```bash
# Must pass before committing
npm run build        # No build errors
npm run lint         # No lint errors

# Manual checks
# 1. Page loads without console errors
# 2. Mobile view works (375px width)
# 3. Dark theme is consistent
# 4. All links navigate correctly
# 5. Forms validate properly
# 6. Data loads from Supabase
```

---

## Questions Ralph Should NEVER Have to Ask

| Question | Answer |
|----------|--------|
| What auth library? | Supabase Auth |
| What folder structure? | See Folder Structure section |
| What colors? | See Constants (COLORS object) |
| How to fetch coaches? | Use `useCoaches` hook from `hooks/use-coaches.ts` |
| What database schema? | See Database Schema section |
| How to handle payments? | See Stripe setup (to be added) |
| What error messages? | See Constants (ERROR_MESSAGES object) |
| What component library? | Custom components in `components/ui/` |
| How to style components? | Tailwind CSS with custom colors |
| What icon library? | Lucide React |
| What toast library? | Sonner |
| How to handle forms? | React Hook Form + Zod |
| What data fetching? | TanStack Query with custom hooks |

**If Ralph needs to ask a question, this spec is incomplete. Add the answer here.**
