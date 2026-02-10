-- =====================================================
-- HS Portal One - Data Cleanup Scripts
-- Run these in Supabase SQL Editor one section at a time
-- =====================================================

-- =====================================================
-- 1. DIAGNOSTICS: Understand what's being filtered
-- =====================================================

-- See the tier1_coaches view definition
SELECT pg_get_viewdef('tier1_coaches', true);

-- Count what's excluded from tier1_coaches
SELECT
  COUNT(*) as excluded_count,
  'Coaches excluded from tier1_coaches view' as description
FROM coaches
WHERE id NOT IN (SELECT id FROM tier1_coaches);

-- See WHY coaches are excluded (sample)
SELECT
  first_name, last_name, school_name, email,
  verification_status, is_verified, state, division_level
FROM coaches
WHERE id NOT IN (SELECT id FROM tier1_coaches)
LIMIT 20;


-- =====================================================
-- 2. FIX: State column has "FBS" values (scraper bug)
-- =====================================================

-- Preview the bad data
SELECT id, first_name, last_name, school_name, state, division_level
FROM coaches
WHERE state IN ('FBS', 'FCS', 'Division II', 'Division III', 'NAIA', 'JUCO')
LIMIT 20;

-- Count affected rows
SELECT state, COUNT(*) as count
FROM coaches
WHERE state IN ('FBS', 'FCS', 'Division II', 'Division III', 'NAIA', 'JUCO')
GROUP BY state;

-- FIX: Clear bad state values (they're actually division values)
UPDATE coaches
SET state = NULL
WHERE state IN ('FBS', 'FCS', 'Division II', 'Division III', 'NAIA', 'JUCO');


-- =====================================================
-- 3. FIX: School names with junk characters
-- =====================================================

-- Preview schools with @ | ? characters
SELECT DISTINCT school_name
FROM coaches
WHERE school_name LIKE '%@%'
   OR school_name LIKE '%|%'
   OR school_name LIKE '%?%'
ORDER BY school_name;

-- Clean up school names (remove leading/trailing junk)
UPDATE coaches
SET school_name = TRIM(BOTH FROM
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(school_name, '^[@|?\s-]+', ''),  -- leading junk
      '[@|?\s-]+$', ''                                  -- trailing junk
    ),
    '\s+', ' '                                          -- multiple spaces
  )
)
WHERE school_name LIKE '%@%'
   OR school_name LIKE '%|%'
   OR school_name LIKE '%?%';


-- =====================================================
-- 4. FIX: Null states - infer from school if possible
-- =====================================================

-- Count null states
SELECT COUNT(*) as null_state_count FROM coaches WHERE state IS NULL;

-- If you have a schools table with state info:
-- UPDATE coaches c
-- SET state = s.state
-- FROM schools s
-- WHERE c.school_id = s.id
--   AND c.state IS NULL
--   AND s.state IS NOT NULL;


-- =====================================================
-- 5. FIX: Placeholder emails
-- =====================================================

-- Count placeholder emails
SELECT COUNT(*) FROM coaches
WHERE email LIKE '%placeholder%' OR email LIKE '%no-email%';

-- Set placeholder emails to NULL (cleaner)
UPDATE coaches
SET email = NULL
WHERE email LIKE '%placeholder%' OR email LIKE '%no-email%';


-- =====================================================
-- 6. SCHOOL COVERAGE CHECK
-- =====================================================

-- Find schools with zero coaches (if schools table exists)
-- SELECT s.name, s.division, s.conference
-- FROM schools s
-- LEFT JOIN coaches c ON s.id = c.school_id
-- WHERE c.id IS NULL
-- ORDER BY s.division, s.name;

-- Alternative: Count coaches per school
SELECT school_name, division_level, COUNT(*) as coach_count
FROM coaches
GROUP BY school_name, division_level
ORDER BY coach_count DESC
LIMIT 50;

-- Schools with only 1 coach (likely incomplete)
SELECT school_name, division_level, COUNT(*) as coach_count
FROM coaches
GROUP BY school_name, division_level
HAVING COUNT(*) = 1
ORDER BY division_level, school_name;


-- =====================================================
-- 7. VERIFY AFTER CLEANUP
-- =====================================================

-- Final counts
SELECT
  COUNT(*) as total_coaches,
  COUNT(email) as with_email,
  COUNT(phone) as with_phone,
  COUNT(twitter) as with_twitter,
  COUNT(state) as with_state
FROM coaches;

-- By division
SELECT division_level, COUNT(*) as count
FROM coaches
GROUP BY division_level
ORDER BY count DESC;

-- Tier1 vs total
SELECT
  (SELECT COUNT(*) FROM coaches) as total_coaches,
  (SELECT COUNT(*) FROM tier1_coaches) as tier1_coaches,
  (SELECT COUNT(*) FROM coaches) - (SELECT COUNT(*) FROM tier1_coaches) as excluded;
