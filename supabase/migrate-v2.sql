-- ============================================================================
-- MIGRATION V2: Complete schema alignment with app
-- Safe to run multiple times (all IF NOT EXISTS / IF EXISTS)
-- ============================================================================

-- 1. Leads: add all extended columns
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_type TEXT DEFAULT 'purchase';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS selected_color TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_center TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_date TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_time TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS line_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS test_drive_date TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS test_drive_time TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS activities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Drop restrictive CHECK constraints
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_level_check;
ALTER TABLE lead_activities DROP CONSTRAINT IF EXISTS lead_activities_type_check;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_method_check;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- 3. Bookings: add extended columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'Pearl White';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS delivery_date TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS car_name TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS car_price DECIMAL(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS down_payment_pct INTEGER DEFAULT 15;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 4. Make FKs nullable for direct bookings (no lead/branch/salesperson required)
ALTER TABLE bookings ALTER COLUMN lead_id DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN branch_id DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN salesperson_id DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN car_id DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN down_payment DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN loan_amount DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN monthly_amount DROP NOT NULL;

-- 5. Notifications: add updated_at
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 6. Make notification user_id nullable (app may not have auth user)
ALTER TABLE notifications ALTER COLUMN user_id DROP NOT NULL;

-- 7. Drop FK constraints that block string-based IDs from the app
-- The app generates string IDs like 'lead_1234567890' — we change columns to TEXT
ALTER TABLE lead_activities DROP CONSTRAINT IF EXISTS lead_activities_lead_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_lead_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_car_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_branch_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_salesperson_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- 8. Change ID columns from UUID to TEXT for flexibility with app-generated IDs
ALTER TABLE leads ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE leads ALTER COLUMN car_id TYPE TEXT USING car_id::TEXT;
ALTER TABLE leads ALTER COLUMN assigned_to TYPE TEXT USING assigned_to::TEXT;
ALTER TABLE leads ALTER COLUMN branch_id TYPE TEXT USING branch_id::TEXT;
ALTER TABLE leads ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

ALTER TABLE bookings ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE bookings ALTER COLUMN lead_id TYPE TEXT USING lead_id::TEXT;
ALTER TABLE bookings ALTER COLUMN car_id TYPE TEXT USING car_id::TEXT;
ALTER TABLE bookings ALTER COLUMN branch_id TYPE TEXT USING branch_id::TEXT;
ALTER TABLE bookings ALTER COLUMN salesperson_id TYPE TEXT USING salesperson_id::TEXT;

ALTER TABLE notifications ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE notifications ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

ALTER TABLE lead_activities ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE lead_activities ALTER COLUMN lead_id TYPE TEXT USING lead_id::TEXT;
ALTER TABLE lead_activities ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

-- 9. Make booking_date nullable (app sends ISO string, not DATE)
ALTER TABLE bookings ALTER COLUMN booking_date DROP NOT NULL;

-- 10. Indexes
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at);
CREATE INDEX IF NOT EXISTS idx_bookings_updated_at ON bookings(updated_at);

-- 11. Add updated_at trigger for notifications
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_notifications_updated_at'
  ) THEN
    CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;
