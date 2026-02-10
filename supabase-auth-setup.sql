-- =====================================================
-- HS Portal One - Auth System Database Setup
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE (Central auth table)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role text CHECK (role IN ('athlete', 'coach', 'club')),
  email text,
  onboarding_complete boolean DEFAULT false,
  subscription_tier text DEFAULT 'free',
  stripe_customer_id text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. ATHLETES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  primary_position text NOT NULL,
  secondary_position text,
  graduation_year int NOT NULL,
  high_school text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  height_feet int,
  height_inches int,
  weight_lbs int,
  gpa decimal(3,2),
  hudl_link text,
  twitter_handle text,
  phone text,
  parent_email text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. HS_COACHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hs_coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  school_name text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  sport_type text CHECK (sport_type IN ('football', 'flag_football', 'both')) NOT NULL,
  title text,
  school_enrollment int,
  conference text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. CLUBS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  club_name text NOT NULL,
  director_first_name text NOT NULL,
  director_last_name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  sport_type text CHECK (sport_type IN ('7on7', 'flag_football', 'both')) NOT NULL,
  primary_color text,
  secondary_color text,
  website text,
  roster_count int,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 5. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hs_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read/update their own profile
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ATHLETES: Users can CRUD their own athlete record
CREATE POLICY "Users read own athlete" ON athletes
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users insert own athlete" ON athletes
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users update own athlete" ON athletes
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users delete own athlete" ON athletes
  FOR DELETE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- HS_COACHES: Users can CRUD their own coach record
CREATE POLICY "Users read own hs_coach" ON hs_coaches
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users insert own hs_coach" ON hs_coaches
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users update own hs_coach" ON hs_coaches
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users delete own hs_coach" ON hs_coaches
  FOR DELETE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- CLUBS: Users can CRUD their own club record
CREATE POLICY "Users read own club" ON clubs
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users insert own club" ON clubs
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users update own club" ON clubs
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users delete own club" ON clubs
  FOR DELETE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- =====================================================
-- 7. ADMIN POLICIES (Full access for admins)
-- =====================================================

CREATE POLICY "Admin full access profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin full access athletes" ON athletes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin full access hs_coaches" ON hs_coaches
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin full access clubs" ON clubs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- =====================================================
-- 8. COACHES TABLE UPDATE POLICY (For admin editing)
-- =====================================================

CREATE POLICY "Admin can update coaches" ON coaches
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- =====================================================
-- 9. UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- DONE! Tables and policies created.
-- =====================================================
