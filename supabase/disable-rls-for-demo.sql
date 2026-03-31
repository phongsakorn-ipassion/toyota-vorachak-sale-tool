-- ============================================================================
-- DISABLE RLS FOR DEMO MODE
-- Run this to allow the app to sync without authenticated sessions
-- For production, re-enable RLS and ensure proper auth
-- ============================================================================

ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
