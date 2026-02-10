-- =====================================================
-- HS Portal One - Recruiting Schema V2
-- MODIFIED: Works with existing 8,783 coaches table
-- =====================================================

-- 1. ADD VERIFICATION COLUMNS TO EXISTING COACHES TABLE
-- =====================================================
ALTER TABLE coaches
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verification_source TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS position_group TEXT,
ADD COLUMN IF NOT EXISTS is_recruiting_coordinator BOOLEAN DEFAULT false;

-- Index for verification queries
CREATE INDEX IF NOT EXISTS idx_coaches_last_verified ON coaches(last_verified_at);
CREATE INDEX IF NOT EXISTS idx_coaches_active ON coaches(is_active);


-- 2. COLLEGE PROGRAMS TABLE (links to existing coaches)
-- =====================================================
CREATE TABLE IF NOT EXISTS college_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name TEXT NOT NULL,
  short_name TEXT,
  mascot TEXT,

  -- Location
  city TEXT,
  state TEXT,

  -- Classification
  division TEXT NOT NULL,                -- 'FBS', 'FCS', 'D2', 'D3', 'NAIA', 'JUCO'
  conference TEXT,
  subdivision TEXT,                      -- 'Power 4', 'Group of 5', etc.

  -- Branding
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  logo_url TEXT,

  -- URLs for scraping
  athletics_url TEXT,
  roster_url TEXT,
  staff_url TEXT,                        -- THIS IS WHERE ROBOT SCOUTS SCRAPE

  -- Robot Scouts - Data Freshness
  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,
  roster_last_scraped_at TIMESTAMPTZ,
  staff_last_scraped_at TIMESTAMPTZ,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  priority_tier INTEGER DEFAULT 3,       -- 1=daily, 2=every 3 days, 3=weekly
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(name)
);

CREATE INDEX IF NOT EXISTS idx_programs_division ON college_programs(division);
CREATE INDEX IF NOT EXISTS idx_programs_conference ON college_programs(conference);
CREATE INDEX IF NOT EXISTS idx_programs_state ON college_programs(state);
CREATE INDEX IF NOT EXISTS idx_programs_priority ON college_programs(priority_tier);


-- 3. LINK COACHES TO PROGRAMS
-- =====================================================
-- Add program_id to existing coaches table if not exists
ALTER TABLE coaches
ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_coaches_program ON coaches(program_id);


-- 4. ROSTER NEEDS (what positions programs need)
-- =====================================================
CREATE TABLE IF NOT EXISTS roster_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES college_programs(id) ON DELETE CASCADE,

  recruiting_class INTEGER NOT NULL,     -- 2025, 2026, 2027
  position TEXT NOT NULL,
  need_level TEXT DEFAULT 'medium',      -- 'critical', 'high', 'medium', 'low', 'filled'
  spots_available INTEGER DEFAULT 1,
  spots_committed INTEGER DEFAULT 0,
  notes TEXT,

  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(program_id, recruiting_class, position)
);

CREATE INDEX IF NOT EXISTS idx_roster_needs_program ON roster_needs(program_id);
CREATE INDEX IF NOT EXISTS idx_roster_needs_class ON roster_needs(recruiting_class);


-- 5. OFFERS (tracking offers to athletes)
-- =====================================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  program_id UUID REFERENCES college_programs(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,

  offer_date DATE,
  offer_type TEXT DEFAULT 'scholarship',
  is_committable BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  committed_at TIMESTAMPTZ,

  official_visit_date DATE,
  unofficial_visit_dates DATE[],
  notes TEXT,
  source TEXT,

  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(athlete_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_athlete ON offers(athlete_id);
CREATE INDEX IF NOT EXISTS idx_offers_program ON offers(program_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);


-- 6. TRANSFER PORTAL
-- =====================================================
CREATE TABLE IF NOT EXISTS transfer_portal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT,
  graduation_year INTEGER,
  eligibility_remaining INTEGER,

  origin_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  origin_school_name TEXT,

  entry_date DATE NOT NULL,
  status TEXT DEFAULT 'in_portal',

  destination_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  destination_school_name TEXT,
  committed_date DATE,

  stats_summary TEXT,
  hudl_link TEXT,
  twitter_handle TEXT,
  source TEXT,
  source_url TEXT,

  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transfer_portal_status ON transfer_portal(status);
CREATE INDEX IF NOT EXISTS idx_transfer_portal_position ON transfer_portal(position);


-- 7. STAFF CHANGES (coaching carousel)
-- =====================================================
CREATE TABLE IF NOT EXISTS staff_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  coach_name TEXT NOT NULL,

  change_type TEXT NOT NULL,             -- 'hire', 'departure', 'promotion', 'title_change'

  from_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  from_school_name TEXT,
  from_title TEXT,

  to_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  to_school_name TEXT,
  to_title TEXT,

  announced_date DATE,
  effective_date DATE,
  notes TEXT,
  source TEXT,
  source_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_changes_date ON staff_changes(announced_date);


-- 8. WATCHLIST
-- =====================================================
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,

  notes TEXT,
  priority TEXT DEFAULT 'medium',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(profile_id, athlete_id)
);


-- 9. ALERT SUBSCRIPTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  alert_type TEXT NOT NULL,
  program_ids UUID[],
  position_filter TEXT[],
  state_filter TEXT[],
  class_filter INTEGER[],

  is_active BOOLEAN DEFAULT true,
  delivery_method TEXT DEFAULT 'in_app',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE college_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_portal ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read for reference data
CREATE POLICY "Public read college_programs" ON college_programs FOR SELECT USING (true);
CREATE POLICY "Public read roster_needs" ON roster_needs FOR SELECT USING (true);
CREATE POLICY "Public read transfer_portal" ON transfer_portal FOR SELECT USING (true);
CREATE POLICY "Public read staff_changes" ON staff_changes FOR SELECT USING (true);

-- Offers: Athletes see own, coaches see all
CREATE POLICY "Athletes see own offers" ON offers FOR SELECT USING (
  athlete_id IN (
    SELECT a.id FROM athletes a
    JOIN profiles p ON a.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Coaches see all offers" ON offers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('coach', 'club')
  )
);

-- User-scoped data
CREATE POLICY "Users manage own watchlist" ON watchlist FOR ALL USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users manage own alerts" ON alert_subscriptions FOR ALL USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Admin write access
CREATE POLICY "Admin write college_programs" ON college_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admin write roster_needs" ON roster_needs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admin write offers" ON offers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admin write transfer_portal" ON transfer_portal FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admin write staff_changes" ON staff_changes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
);


-- =====================================================
-- DROP TEMP RLS POLICY ON COACHES
-- =====================================================
DROP POLICY IF EXISTS "Temp allow all updates" ON coaches;


-- =====================================================
-- SEED TOP 10 PROGRAMS (Tier 1)
-- =====================================================
INSERT INTO college_programs (name, short_name, mascot, city, state, division, conference, subdivision, primary_color, secondary_color, priority_tier)
VALUES
  ('University of Texas', 'Texas', 'Longhorns', 'Austin', 'TX', 'FBS', 'SEC', 'Power 4', '#BF5700', '#FFFFFF', 1),
  ('Texas A&M University', 'Texas A&M', 'Aggies', 'College Station', 'TX', 'FBS', 'SEC', 'Power 4', '#500000', '#FFFFFF', 1),
  ('University of Oklahoma', 'Oklahoma', 'Sooners', 'Norman', 'OK', 'FBS', 'SEC', 'Power 4', '#841617', '#FFFFFF', 1),
  ('Louisiana State University', 'LSU', 'Tigers', 'Baton Rouge', 'LA', 'FBS', 'SEC', 'Power 4', '#461D7C', '#FDD023', 1),
  ('University of Alabama', 'Alabama', 'Crimson Tide', 'Tuscaloosa', 'AL', 'FBS', 'SEC', 'Power 4', '#9E1B32', '#FFFFFF', 1),
  ('University of Georgia', 'Georgia', 'Bulldogs', 'Athens', 'GA', 'FBS', 'SEC', 'Power 4', '#BA0C2F', '#000000', 1),
  ('Ohio State University', 'Ohio State', 'Buckeyes', 'Columbus', 'OH', 'FBS', 'Big Ten', 'Power 4', '#BB0000', '#666666', 1),
  ('University of Southern California', 'USC', 'Trojans', 'Los Angeles', 'CA', 'FBS', 'Big Ten', 'Power 4', '#990000', '#FFC72C', 1),
  ('University of Oregon', 'Oregon', 'Ducks', 'Eugene', 'OR', 'FBS', 'Big Ten', 'Power 4', '#154733', '#FEE123', 1),
  ('Clemson University', 'Clemson', 'Tigers', 'Clemson', 'SC', 'FBS', 'ACC', 'Power 4', '#F56600', '#522D80', 1)
ON CONFLICT (name) DO NOTHING;


-- =====================================================
-- DONE! Changes summary:
-- =====================================================
-- ✅ Added verification columns to existing coaches table
-- ✅ Added program_id to link coaches → programs
-- ✅ Created college_programs table
-- ✅ Created supporting tables (offers, transfers, etc.)
-- ✅ Dropped temp RLS policy on coaches
-- ✅ Seeded 10 Tier 1 programs
--
-- NEXT: Link your 8,783 coaches to programs via program_id
-- NEXT: Add staff_url to programs for Robot Scouts
-- =====================================================
