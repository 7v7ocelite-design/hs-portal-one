-- =====================================================
-- HS Portal One - Recruiting Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. COLLEGE PROGRAMS (schools doing the recruiting)
-- =====================================================
CREATE TABLE IF NOT EXISTS college_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name TEXT NOT NULL,                    -- "University of Texas"
  short_name TEXT,                       -- "Texas"
  mascot TEXT,                           -- "Longhorns"

  -- Location
  city TEXT,
  state TEXT,

  -- Classification
  division TEXT NOT NULL,                -- 'FBS', 'FCS', 'D2', 'D3', 'NAIA', 'JUCO'
  conference TEXT,                       -- 'SEC', 'Big 12', etc.
  subdivision TEXT,                      -- 'Power 4', 'Group of 5', etc.

  -- Branding
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  logo_url TEXT,

  -- Contact/Links
  athletics_url TEXT,                    -- Main athletics website
  roster_url TEXT,                       -- Direct link to football roster
  staff_url TEXT,                        -- Direct link to coaching staff page

  -- Robot Scouts - Data Freshness Tracking
  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,              -- 'manual', 'scraper', 'visualping'
  roster_last_scraped_at TIMESTAMPTZ,
  staff_last_scraped_at TIMESTAMPTZ,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  priority_tier INTEGER DEFAULT 3,       -- 1=high priority, 2=medium, 3=low (for scraping frequency)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_programs_division ON college_programs(division);
CREATE INDEX IF NOT EXISTS idx_programs_conference ON college_programs(conference);
CREATE INDEX IF NOT EXISTS idx_programs_state ON college_programs(state);
CREATE INDEX IF NOT EXISTS idx_programs_priority ON college_programs(priority_tier);


-- 2. COLLEGE COACHES (staff at college programs)
-- =====================================================
CREATE TABLE IF NOT EXISTS college_coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES college_programs(id) ON DELETE CASCADE,

  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,

  -- Role
  title TEXT NOT NULL,                   -- 'Head Coach', 'Offensive Coordinator', 'WR Coach', etc.
  position_group TEXT,                   -- 'offense', 'defense', 'special_teams', 'support'
  is_recruiting_coordinator BOOLEAN DEFAULT false,
  recruiting_area TEXT,                  -- Geographic area they recruit (e.g., 'Texas, Louisiana')

  -- Contact
  email TEXT,
  phone TEXT,
  twitter_handle TEXT,

  -- Tenure
  start_date DATE,
  previous_school TEXT,
  previous_title TEXT,

  -- Robot Scouts
  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_college_coaches_program ON college_coaches(program_id);
CREATE INDEX IF NOT EXISTS idx_college_coaches_title ON college_coaches(title);


-- 3. ROSTER NEEDS (what positions programs need by class)
-- =====================================================
CREATE TABLE IF NOT EXISTS roster_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES college_programs(id) ON DELETE CASCADE,

  recruiting_class INTEGER NOT NULL,     -- 2025, 2026, 2027
  position TEXT NOT NULL,                -- 'QB', 'WR', 'CB', etc.
  need_level TEXT DEFAULT 'medium',      -- 'critical', 'high', 'medium', 'low', 'filled'
  spots_available INTEGER DEFAULT 1,
  spots_committed INTEGER DEFAULT 0,

  notes TEXT,

  -- Robot Scouts
  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(program_id, recruiting_class, position)
);

CREATE INDEX IF NOT EXISTS idx_roster_needs_program ON roster_needs(program_id);
CREATE INDEX IF NOT EXISTS idx_roster_needs_class ON roster_needs(recruiting_class);
CREATE INDEX IF NOT EXISTS idx_roster_needs_position ON roster_needs(position);


-- 4. OFFERS (tracking offers to athletes)
-- =====================================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who's involved
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  program_id UUID REFERENCES college_programs(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES college_coaches(id) ON DELETE SET NULL,  -- Who extended the offer

  -- Offer Details
  offer_date DATE,
  offer_type TEXT DEFAULT 'scholarship',  -- 'scholarship', 'preferred_walk_on', 'walk_on', 'camp_invite'
  is_committable BOOLEAN DEFAULT true,

  -- Status
  status TEXT DEFAULT 'active',          -- 'active', 'committed', 'decommitted', 'expired', 'declined'
  committed_at TIMESTAMPTZ,

  -- Visit tracking
  official_visit_date DATE,
  unofficial_visit_dates DATE[],

  notes TEXT,
  source TEXT,                           -- Where we learned about this offer

  -- Robot Scouts
  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(athlete_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_athlete ON offers(athlete_id);
CREATE INDEX IF NOT EXISTS idx_offers_program ON offers(program_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);


-- 5. TRANSFER PORTAL
-- =====================================================
CREATE TABLE IF NOT EXISTS transfer_portal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Player Info (may or may not be linked to our athletes table)
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,

  -- If not in our system, store basic info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT,
  graduation_year INTEGER,
  eligibility_remaining INTEGER,         -- Years left

  -- Origin
  origin_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  origin_school_name TEXT,               -- Fallback if program not in our DB

  -- Portal Status
  entry_date DATE NOT NULL,
  status TEXT DEFAULT 'in_portal',       -- 'in_portal', 'committed', 'withdrawn', 'signed'

  -- Destination (if committed)
  destination_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  destination_school_name TEXT,
  committed_date DATE,

  -- Stats/Info
  stats_summary TEXT,                    -- Brief career stats
  hudl_link TEXT,
  twitter_handle TEXT,

  -- Source
  source TEXT,                           -- Where we found this info
  source_url TEXT,

  -- Robot Scouts
  last_verified_at TIMESTAMPTZ,
  verification_source TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transfer_portal_status ON transfer_portal(status);
CREATE INDEX IF NOT EXISTS idx_transfer_portal_position ON transfer_portal(position);
CREATE INDEX IF NOT EXISTS idx_transfer_portal_origin ON transfer_portal(origin_program_id);
CREATE INDEX IF NOT EXISTS idx_transfer_portal_entry_date ON transfer_portal(entry_date);


-- 6. STAFF CHANGES (coaching carousel tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS staff_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who
  coach_id UUID REFERENCES college_coaches(id) ON DELETE SET NULL,
  coach_name TEXT NOT NULL,              -- Denormalized for history

  -- Change Type
  change_type TEXT NOT NULL,             -- 'hire', 'departure', 'promotion', 'title_change'

  -- From
  from_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  from_school_name TEXT,
  from_title TEXT,

  -- To
  to_program_id UUID REFERENCES college_programs(id) ON DELETE SET NULL,
  to_school_name TEXT,
  to_title TEXT,

  -- When
  announced_date DATE,
  effective_date DATE,

  -- Context
  notes TEXT,
  source TEXT,
  source_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_changes_type ON staff_changes(change_type);
CREATE INDEX IF NOT EXISTS idx_staff_changes_date ON staff_changes(announced_date);
CREATE INDEX IF NOT EXISTS idx_staff_changes_from ON staff_changes(from_program_id);
CREATE INDEX IF NOT EXISTS idx_staff_changes_to ON staff_changes(to_program_id);


-- 7. WATCHLIST (athletes users are tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,

  notes TEXT,
  priority TEXT DEFAULT 'medium',        -- 'high', 'medium', 'low'
  tags TEXT[],                           -- Custom tags like ['local', 'QB target', '2025']

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(profile_id, athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_profile ON watchlist(profile_id);


-- 8. ALERTS (notification preferences)
-- =====================================================
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  alert_type TEXT NOT NULL,              -- 'offer', 'commitment', 'transfer', 'staff_change', 'roster_update'

  -- Filters (what triggers the alert)
  program_ids UUID[],                    -- Specific programs to watch
  position_filter TEXT[],                -- Specific positions
  state_filter TEXT[],                   -- Specific states
  class_filter INTEGER[],                -- Specific graduating classes

  -- Delivery
  is_active BOOLEAN DEFAULT true,
  delivery_method TEXT DEFAULT 'in_app', -- 'in_app', 'email', 'both'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_profile ON alert_subscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alert_subscriptions(alert_type);


-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE college_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_portal ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data (programs, coaches, transfers)
CREATE POLICY "Public read college_programs" ON college_programs
  FOR SELECT USING (true);

CREATE POLICY "Public read college_coaches" ON college_coaches
  FOR SELECT USING (true);

CREATE POLICY "Public read roster_needs" ON roster_needs
  FOR SELECT USING (true);

CREATE POLICY "Public read transfer_portal" ON transfer_portal
  FOR SELECT USING (true);

CREATE POLICY "Public read staff_changes" ON staff_changes
  FOR SELECT USING (true);

-- Offers: Athletes see their own, coaches see all
CREATE POLICY "Athletes see own offers" ON offers
  FOR SELECT USING (
    athlete_id IN (
      SELECT a.id FROM athletes a
      JOIN profiles p ON a.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Coaches see all offers" ON offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role IN ('coach', 'club')
    )
  );

-- Watchlist: Users only see their own
CREATE POLICY "Users manage own watchlist" ON watchlist
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Alert subscriptions: Users only see their own
CREATE POLICY "Users manage own alerts" ON alert_subscriptions
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Admin write access for all tables
CREATE POLICY "Admin write college_programs" ON college_programs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admin write college_coaches" ON college_coaches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admin write roster_needs" ON roster_needs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admin write offers" ON offers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admin write transfer_portal" ON transfer_portal
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admin write staff_changes" ON staff_changes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );


-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'college_programs', 'college_coaches', 'roster_needs',
    'offers', 'transfer_portal', 'alert_subscriptions'
  ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    ', t, t, t, t);
  END LOOP;
END $$;


-- =====================================================
-- SEED DATA: Sample Programs (Top 10 Priority)
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
ON CONFLICT DO NOTHING;


-- =====================================================
-- DONE! Summary of tables created:
-- =====================================================
-- 1. college_programs  - Schools doing recruiting
-- 2. college_coaches   - Staff at those programs
-- 3. roster_needs      - Position needs by class year
-- 4. offers            - Offers to HS athletes
-- 5. transfer_portal   - Transfer portal entries
-- 6. staff_changes     - Coaching carousel tracking
-- 7. watchlist         - Users tracking athletes
-- 8. alert_subscriptions - Notification preferences
-- =====================================================
