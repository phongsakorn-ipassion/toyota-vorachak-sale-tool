-- ============================================================================
-- MIGRATION V3: Sub-model / Grade fields
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Leads: sub-model + conversion tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS selected_grade TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS converted_from TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS converted_to TEXT;

-- Bookings: sub-model
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS selected_grade TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS grade_name TEXT;
