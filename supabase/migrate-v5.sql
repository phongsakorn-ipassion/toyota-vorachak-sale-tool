-- ============================================================================
-- MIGRATION V5: Booking signature fields
-- Run this in Supabase SQL Editor
-- ============================================================================

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS signature TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS signed_at TEXT;
