-- ============================================================================
-- Toyota Vorachakyont Sale Tool - Supabase Schema + Seed Data
-- ============================================================================
--
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- SETUP STEPS:
-- 1. Create a new Supabase project at https://supabase.com
-- 2. Go to SQL Editor and paste this entire file
-- 3. Click "Run" to execute
-- 4. Go to Authentication > Users and create demo users:
--    - sales@demo.com (password: demo1234, metadata: {"role":"sales","name":"สมศักดิ์ ดีงาม"})
--    - manager@demo.com (password: demo1234, metadata: {"role":"mgr","name":"วิชัย ผู้จัดการ"})
-- 5. Copy your project URL and anon key from Settings > API
-- 6. Create .env.local in the project root with:
--    VITE_SUPABASE_URL=https://your-project.supabase.co
--    VITE_SUPABASE_ANON_KEY=your-anon-key
--
-- NOTE: After creating users in step 4, the on_auth_user_created trigger
-- will automatically create their profiles. You can then update seed data
-- references (leads.assigned_to, leads.created_by) to match the actual
-- user UUIDs from the profiles table.
-- ============================================================================


-- ============================================================================
-- 1. Enable Required Extensions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
-- 2. BRANCHES TABLE
-- ============================================================================

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  region TEXT,
  target_units_monthly INTEGER DEFAULT 10,
  target_revenue_monthly DECIMAL(12, 2) DEFAULT 50000000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- ============================================================================
-- 3. PROFILES TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('sales', 'mgr', 'admin')),
  name TEXT NOT NULL,
  branch_id UUID NOT NULL REFERENCES branches(id),
  avatar_color TEXT DEFAULT '#1B7A3F',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_profiles_branch_id ON profiles(branch_id);
CREATE INDEX idx_profiles_role ON profiles(role);


-- ============================================================================
-- 4. CARS TABLE
-- ============================================================================

CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  fuel TEXT NOT NULL,
  seats INTEGER NOT NULL,
  gearbox TEXT NOT NULL,
  power TEXT,
  avail_status TEXT DEFAULT 'available' CHECK (avail_status IN ('available', 'transit', 'reserved')),
  stock_info TEXT,
  warranty TEXT DEFAULT '3 years',
  eco TEXT DEFAULT 'Euro 5',
  category TEXT,
  bg_color TEXT DEFAULT '#F5F5F5',
  image_url TEXT,
  images JSONB,
  video_id TEXT,
  specs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_cars_type ON cars(type);
CREATE INDEX idx_cars_price ON cars(price);


-- ============================================================================
-- 5. LEADS TABLE
-- ============================================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  initial TEXT,
  avatar_color TEXT DEFAULT '#DC2626',
  level TEXT NOT NULL CHECK (level IN ('hot', 'warm', 'cool', 'won')),
  source TEXT,
  car_id UUID REFERENCES cars(id),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  branch_id UUID NOT NULL REFERENCES branches(id),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_leads_branch_id ON leads(branch_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_level ON leads(level);
CREATE INDEX idx_leads_car_id ON leads(car_id);


-- ============================================================================
-- 6. LEAD ACTIVITIES TABLE
-- ============================================================================

CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'note', 'booking', 'status_change')),
  title TEXT NOT NULL,
  description TEXT,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_activities_created_at ON lead_activities(created_at);


-- ============================================================================
-- 7. BOOKINGS TABLE
-- ============================================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  salesperson_id UUID NOT NULL REFERENCES profiles(id),
  booking_date DATE NOT NULL,
  down_payment DECIMAL(12, 2),
  loan_amount DECIMAL(12, 2),
  loan_term_months INTEGER DEFAULT 60,
  interest_rate DECIMAL(5, 2) DEFAULT 2.5,
  monthly_amount DECIMAL(12, 2),
  payment_method TEXT DEFAULT 'bank_loan' CHECK (payment_method IN ('cash', 'bank_loan', 'company_lease')),
  qr_code_url TEXT,
  reference_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_bookings_lead_id ON bookings(lead_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_branch_id ON bookings(branch_id);


-- ============================================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'lead_update', 'booking')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);


-- ============================================================================
-- 9. Updated_at Trigger Function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ---------- PROFILES ----------

CREATE POLICY "users_view_own_profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admin_view_all_profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "manager_view_branch_profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = profiles.branch_id
    )
  );

CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---------- BRANCHES ----------

CREATE POLICY "public_read_branches"
  ON branches FOR SELECT
  USING (true);

-- ---------- CARS ----------

CREATE POLICY "public_read_cars"
  ON cars FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_cars"
  ON cars FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "admin_update_cars"
  ON cars FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------- LEADS ----------

CREATE POLICY "sales_own_leads"
  ON leads FOR SELECT
  USING (
    assigned_to = auth.uid() OR created_by = auth.uid()
  );

CREATE POLICY "sales_create_leads"
  ON leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'sales'
      AND p.branch_id = leads.branch_id
    )
  );

CREATE POLICY "sales_update_own_leads"
  ON leads FOR UPDATE
  USING (assigned_to = auth.uid() OR created_by = auth.uid())
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'sales'
      AND p.branch_id = leads.branch_id
    )
  );

CREATE POLICY "manager_view_branch_leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = leads.branch_id
    )
  );

CREATE POLICY "manager_reassign_leads"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = leads.branch_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = leads.branch_id
    )
  );

CREATE POLICY "admin_view_all_leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------- LEAD_ACTIVITIES ----------

CREATE POLICY "view_own_activities"
  ON lead_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_activities.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

CREATE POLICY "sales_create_activity"
  ON lead_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_activities.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

CREATE POLICY "manager_view_branch_activities"
  ON lead_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l, profiles p
      WHERE l.id = lead_activities.lead_id
      AND p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = l.branch_id
    )
  );

-- ---------- BOOKINGS ----------

CREATE POLICY "sales_view_own_bookings"
  ON bookings FOR SELECT
  USING (salesperson_id = auth.uid());

CREATE POLICY "sales_create_booking"
  ON bookings FOR INSERT
  WITH CHECK (
    salesperson_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = bookings.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

CREATE POLICY "manager_view_branch_bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = bookings.branch_id
    )
  );

CREATE POLICY "admin_view_all_bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------- NOTIFICATIONS ----------

CREATE POLICY "users_view_own_notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- 11. AUTH TRIGGER: Auto-create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_branch_id UUID;
BEGIN
  -- Try to get a branch; fallback to the seeded default branch UUID
  SELECT id INTO v_branch_id FROM branches ORDER BY created_at LIMIT 1;
  IF v_branch_id IS NULL THEN
    v_branch_id := 'a0000000-0000-4000-8000-000000000001'::uuid;
  END IF;

  INSERT INTO public.profiles (id, email, role, name, branch_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'sales'),
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    v_branch_id
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 12. SEED DATA: Branches
-- ============================================================================

INSERT INTO branches (id, name, location, region, target_units_monthly, target_revenue_monthly) VALUES
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'สาขาลาดพร้าว', 'ลาดพร้าว, กทม.', 'กรุงเทพมหานคร', 15, 75000000),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'สาขาบางนา', 'บางนา, กทม.', 'กรุงเทพมหานคร', 10, 50000000),
  ('a0000000-0000-4000-8000-000000000003'::uuid, 'สาขาอ่อนนุช', 'อ่อนนุช, กทม.', 'กรุงเทพมหานคร', 8, 40000000)
ON CONFLICT (name) DO NOTHING;


-- ============================================================================
-- 13. SEED DATA: Cars (6 models from mockData.js)
-- ============================================================================

INSERT INTO cars (id, name, type, price, fuel, seats, gearbox, power, avail_status, stock_info, warranty, eco, category, bg_color, image_url, images, video_id, specs) VALUES

-- Corolla Altis 2026
('c0000000-0000-4000-8000-000000000001'::uuid,
 'Corolla Altis 2026', 'Sedan', 909000, 'Hybrid', 5, 'CVT Auto', '140 hp',
 'available', '3 units — สาขาลาดพร้าว',
 '3 ปี / 100,000 กม.', '23.3 km/L', 'sedan', '#EEF2FF',
 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_1?wid=640&hei=480&fmt=webp',
 '{"ext":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_1?wid=640&hei=480&fmt=webp","side":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_2?wid=640&hei=480&fmt=webp","rear":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_3?wid=640&hei=480&fmt=webp","int":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_interior_1?wid=640&hei=480&fmt=webp"}'::jsonb,
 'suqtQAPxiBM',
 '{"engine":[["เครื่องยนต์","1.8L 4-Cylinder Hybrid"],["แรงม้า","140 hp @ 5,200 rpm"],["แรงบิด","177 Nm @ 3,600 rpm"],["ระบบเกียร์","CVT อัตโนมัติ"],["ระบบขับเคลื่อน","FWD"],["อัตราสิ้นเปลือง","23.3 km/L"]],"dim":[["ความยาว","4,620 mm"],["ความกว้าง","1,780 mm"],["ความสูง","1,435 mm"],["ฐานล้อ","2,700 mm"],["ความจุถังน้ำมัน","50 L"],["น้ำหนัก","1,335 kg"]],"safety":["7 ถุงลม SRS","Toyota Safety Sense 3.0","ระบบเบรก ABS + EBD + BA","ระบบควบคุมเสถียรภาพ VSC","กล้องมองหลัง","เซ็นเซอร์ถอยหลัง"],"features":["จอ 9\" ระบบสัมผัส","Apple CarPlay / Android Auto","เบาะหนังแท้","ระบบปรับอากาศอัตโนมัติ 2 โซน","สตาร์ทด้วยปุ่มกด","กุญแจอัจฉริยะ Smart Key"]}'::jsonb),

-- Yaris Cross 2026
('c0000000-0000-4000-8000-000000000002'::uuid,
 'Yaris Cross 2026', 'Crossover', 799000, 'Hybrid', 5, 'CVT Auto', '116 hp',
 'transit', 'คาดว่าถึง 2 สัปดาห์',
 '3 ปี / 100,000 กม.', '30.2 km/L', 'crossover', '#FEF3C7',
 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_1?wid=640&hei=480&fmt=webp',
 '{"ext":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_1?wid=640&hei=480&fmt=webp","side":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_2?wid=640&hei=480&fmt=webp","rear":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_3?wid=640&hei=480&fmt=webp","int":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_interior_1?wid=640&hei=480&fmt=webp"}'::jsonb,
 'Yj1YmRrAQao',
 '{"engine":[["เครื่องยนต์","1.5L 3-Cylinder Hybrid"],["แรงม้า","116 hp"],["แรงบิด","145 Nm"],["ระบบเกียร์","CVT"],["ระบบขับเคลื่อน","FWD / AWD"],["อัตราสิ้นเปลือง","30.2 km/L"]],"dim":[["ความยาว","4,180 mm"],["ความกว้าง","1,765 mm"],["ความสูง","1,560 mm"],["ฐานล้อ","2,560 mm"],["ความจุถังน้ำมัน","36 L"],["น้ำหนัก","1,190 kg"]],"safety":["7 ถุงลม SRS","Toyota Safety Sense","Pre-Collision System","Lane Departure Alert","Auto High Beam","กล้องมองหลัง"],"features":["จอ 8\" ระบบสัมผัส","Apple CarPlay / Android Auto","ไฟ LED ออโต้","ระบบปรับอากาศอัตโนมัติ","Wireless Charger","สตาร์ทด้วยปุ่มกด"]}'::jsonb),

-- Land Cruiser FJ
('c0000000-0000-4000-8000-000000000003'::uuid,
 'Land Cruiser FJ', 'SUV', 1269000, 'Diesel', 7, '6AT', '204 hp',
 'available', '1 unit — สาขาบางนา',
 '5 ปี / 150,000 กม.', '12.5 km/L', 'suv', '#FEE2E2',
 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_1?wid=640&hei=480&fmt=webp',
 '{"ext":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_1?wid=640&hei=480&fmt=webp","side":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_2?wid=640&hei=480&fmt=webp","rear":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_3?wid=640&hei=480&fmt=webp","int":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_interior_1?wid=640&hei=480&fmt=webp"}'::jsonb,
 'ZE6MkxVRKXM',
 '{"engine":[["เครื่องยนต์","2.8L 4-Cylinder Turbo Diesel"],["แรงม้า","204 hp @ 3,000 rpm"],["แรงบิด","500 Nm @ 1,600 rpm"],["ระบบเกียร์","6-Speed Auto"],["ระบบขับเคลื่อน","4WD"],["อัตราสิ้นเปลือง","12.5 km/L"]],"dim":[["ความยาว","4,925 mm"],["ความกว้าง","1,980 mm"],["ความสูง","1,935 mm"],["ฐานล้อ","2,850 mm"],["ความจุถังน้ำมัน","80 L"],["น้ำหนัก","2,490 kg"]],"safety":["8 ถุงลม SRS","Toyota Safety Sense","Multi-Terrain Select","Crawl Control","กล้อง 360°","ระบบช่วยเบรกฉุกเฉิน"],"features":["จอ 12.3\" ระบบสัมผัส","JBL Premium Audio 14 ลำโพง","เบาะหนังแท้ 3 แถว","ซันรูฟไฟฟ้า","หน้าจอหลังเบาะ","Wireless Charger"]}'::jsonb),

-- bZ4X Electric
('c0000000-0000-4000-8000-000000000004'::uuid,
 'bZ4X Electric', 'EV', 1529000, 'Electric', 5, 'Single Speed', '218 hp',
 'available', '2 units — สาขาลาดพร้าว',
 '5 ปี / 150,000 กม.', '6.2 km/kWh', 'ev', '#DBEAFE',
 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_1?wid=640&hei=480&fmt=webp',
 '{"ext":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_1?wid=640&hei=480&fmt=webp","side":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_2?wid=640&hei=480&fmt=webp","rear":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_3?wid=640&hei=480&fmt=webp","int":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_interior_1?wid=640&hei=480&fmt=webp"}'::jsonb,
 'Yj1YmRrAQao',
 '{"engine":[["มอเตอร์","Dual Motor AWD"],["แรงม้า","218 hp"],["แรงบิด","337 Nm"],["แบตเตอรี่","71.4 kWh Lithium-ion"],["ระยะทาง","500 km (WLTP)"],["ชาร์จเร็ว","DC 150kW (80% ใน 30 นาที)"]],"dim":[["ความยาว","4,690 mm"],["ความกว้าง","1,860 mm"],["ความสูง","1,650 mm"],["ฐานล้อ","2,850 mm"],["ความจุเก็บสัมภาระ","452 L"],["น้ำหนัก","2,010 kg"]],"safety":["8 ถุงลม SRS","Toyota Safety Sense 3.0","ระบบเบรกฉุกเฉิน PCS","ระบบช่วยรักษาช่องทาง LTA","ระบบตรวจจุดบอด BSM","กล้อง Panoramic View"],"features":["จอ 12.3\" ระบบสัมผัส","Harman Kardon Audio","หลังคา Solar Panel","Heat Pump A/C","Wireless Charger + CarPlay","Digital Key"]}'::jsonb),

-- Hilux Revo 2026
('c0000000-0000-4000-8000-000000000005'::uuid,
 'Hilux Revo 2026', 'Pickup', 649000, 'Diesel', 5, '6MT / 6AT', '204 hp',
 'available', '5 units — หลายสาขา',
 '3 ปี / 100,000 กม.', '11.6 km/L', 'pickup', '#F0FDF4',
 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_1?wid=640&hei=480&fmt=webp',
 '{"ext":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_1?wid=640&hei=480&fmt=webp","side":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_2?wid=640&hei=480&fmt=webp","rear":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_3?wid=640&hei=480&fmt=webp","int":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_interior_1?wid=640&hei=480&fmt=webp"}'::jsonb,
 'suqtQAPxiBM',
 '{"engine":[["เครื่องยนต์","2.8L 4-Cylinder Turbo Diesel"],["แรงม้า","204 hp @ 3,400 rpm"],["แรงบิด","500 Nm @ 1,600 rpm"],["ระบบเกียร์","6-Speed Auto / Manual"],["ระบบขับเคลื่อน","4WD"],["อัตราสิ้นเปลือง","11.6 km/L"]],"dim":[["ความยาว","5,325 mm"],["ความกว้าง","1,855 mm"],["ความสูง","1,815 mm"],["ฐานล้อ","3,085 mm"],["ความจุถังน้ำมัน","80 L"],["น้ำหนัก","2,080 kg"]],"safety":["6 ถุงลม SRS","Toyota Safety Sense","Hill Assist Control","Trailer Sway Control","กล้องมองหลัง","เซ็นเซอร์ถอยหลัง"],"features":["จอ 8\" ระบบสัมผัส","Apple CarPlay / Android Auto","เบาะหนังสังเคราะห์","Diff Lock หลัง","ระบบปรับอากาศอัตโนมัติ","USB-C ชาร์จเร็ว"]}'::jsonb),

-- GR 86 2026
('c0000000-0000-4000-8000-000000000006'::uuid,
 'GR 86 2026', 'Sport', 1899000, 'Petrol', 4, '6MT / 6AT', '235 hp',
 'available', '1 unit — Limited Edition',
 '3 ปี / 100,000 กม.', '12.0 km/L', 'sport', '#FDF2F8',
 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_1?wid=640&hei=480&fmt=webp',
 '{"ext":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_1?wid=640&hei=480&fmt=webp","side":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_2?wid=640&hei=480&fmt=webp","rear":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_3?wid=640&hei=480&fmt=webp","int":"https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_interior_1?wid=640&hei=480&fmt=webp"}'::jsonb,
 'ZE6MkxVRKXM',
 '{"engine":[["เครื่องยนต์","2.4L Flat-4 Boxer"],["แรงม้า","235 hp @ 7,000 rpm"],["แรงบิด","250 Nm @ 3,700 rpm"],["ระบบเกียร์","6-Speed Manual / Auto"],["ระบบขับเคลื่อน","RWD"],["อัตราสิ้นเปลือง","12.0 km/L"]],"dim":[["ความยาว","4,265 mm"],["ความกว้าง","1,775 mm"],["ความสูง","1,310 mm"],["ฐานล้อ","2,575 mm"],["ความจุถังน้ำมัน","50 L"],["น้ำหนัก","1,270 kg"]],"safety":["6 ถุงลม SRS","Toyota Safety Sense","Track Mode","Sport ABS","กล้องมองหลัง","ระบบควบคุมเสถียรภาพ VSC Sport"],"features":["จอ 8\" ระบบสัมผัส","Apple CarPlay / Android Auto","เบาะ Sport แบบ Alcantara","ระบบไอเสียคู่ Sports","เกจ์วัดแบบ Digital","Push Start / Smart Key"]}'::jsonb);


-- ============================================================================
-- 14. SEED DATA: Leads
-- ============================================================================
-- NOTE: leads.assigned_to and leads.created_by require valid profile UUIDs.
-- After creating demo users (step 4 in SETUP), replace the placeholder UUIDs
-- below with the actual UUIDs from the profiles table.
--
-- To find user UUIDs after signup:
--   SELECT id, email, name FROM profiles;
--
-- For initial setup without auth users, we temporarily allow NULL created_by
-- and will insert leads without foreign key references to profiles.
-- You can re-run these inserts after creating users.

-- We use a DO block to conditionally insert leads only if a demo user exists
DO $$
DECLARE
  v_sales_id UUID;
  v_branch_lp UUID := 'a0000000-0000-4000-8000-000000000001'::uuid;
  v_branch_bn UUID := 'a0000000-0000-4000-8000-000000000002'::uuid;
  v_car_yaris UUID := 'c0000000-0000-4000-8000-000000000002'::uuid;
  v_car_lc UUID := 'c0000000-0000-4000-8000-000000000003'::uuid;
  v_car_corolla UUID := 'c0000000-0000-4000-8000-000000000001'::uuid;
  v_car_hilux UUID := 'c0000000-0000-4000-8000-000000000005'::uuid;
  v_lead_duangjai UUID;
  v_lead_prawit UUID;
  v_lead_oranee UUID;
  v_lead_jirawat UUID;
BEGIN
  -- Try to find a sales user profile
  SELECT id INTO v_sales_id FROM profiles WHERE role = 'sales' LIMIT 1;

  -- If no user yet, skip lead seeding (run this block again after user creation)
  IF v_sales_id IS NULL THEN
    RAISE NOTICE 'No sales user found. Skipping lead seed data. Re-run after creating demo users.';
    RETURN;
  END IF;

  -- Lead 1: ดวงใจ ทองดี (hot, Walk-in, Yaris Cross)
  INSERT INTO leads (id, name, initial, avatar_color, level, source, car_id, assigned_to, branch_id, created_by, phone, email, created_at, last_contact_at)
  VALUES (uuid_generate_v4(), 'ดวงใจ ทองดี', 'ด', '#DC2626', 'hot', 'Walk-in · สาขาลาดพร้าว', v_car_yaris, v_sales_id, v_branch_lp, v_sales_id, '081-234-5678', 'duangjai@email.com', '2026-03-25T10:00:00+07:00', '2026-03-27T14:30:00+07:00')
  RETURNING id INTO v_lead_duangjai;

  -- Lead 2: ประวิทย์ จันทร์แจ่ม (warm, LINE OA, Land Cruiser)
  INSERT INTO leads (id, name, initial, avatar_color, level, source, car_id, assigned_to, branch_id, created_by, phone, email, created_at, last_contact_at)
  VALUES (uuid_generate_v4(), 'ประวิทย์ จันทร์แจ่ม', 'ป', '#8B5CF6', 'warm', 'LINE OA', v_car_lc, v_sales_id, v_branch_lp, v_sales_id, '089-876-5432', 'prawit@email.com', '2026-03-20T09:00:00+07:00', '2026-03-26T16:00:00+07:00')
  RETURNING id INTO v_lead_prawit;

  -- Lead 3: อรณี สุขสม (warm, Facebook Lead, Corolla)
  INSERT INTO leads (id, name, initial, avatar_color, level, source, car_id, assigned_to, branch_id, created_by, phone, email, created_at, last_contact_at)
  VALUES (uuid_generate_v4(), 'อรณี สุขสม', 'อ', '#F59E0B', 'warm', 'Facebook Lead', v_car_corolla, v_sales_id, v_branch_lp, v_sales_id, '062-345-6789', 'oranee@email.com', '2026-03-22T14:00:00+07:00', '2026-03-24T09:00:00+07:00')
  RETURNING id INTO v_lead_oranee;

  -- Lead 4: จิรวัฒน์ ศรีรัตน์ (won, Referral, Hilux)
  INSERT INTO leads (id, name, initial, avatar_color, level, source, car_id, assigned_to, branch_id, created_by, phone, email, created_at, last_contact_at)
  VALUES (uuid_generate_v4(), 'จิรวัฒน์ ศรีรัตน์', 'จ', '#10B981', 'won', 'Referral', v_car_hilux, v_sales_id, v_branch_bn, v_sales_id, '095-678-1234', 'jirawat@email.com', '2026-03-15T11:00:00+07:00', '2026-03-26T15:00:00+07:00')
  RETURNING id INTO v_lead_jirawat;

  -- ============================================================================
  -- 15. SEED DATA: Lead Activities
  -- ============================================================================

  -- Activities for ดวงใจ
  INSERT INTO lead_activities (lead_id, type, title, description, created_at, created_by) VALUES
    (v_lead_duangjai, 'call', 'โทรติดตามลูกค้า', 'ลูกค้าสนใจ Yaris Cross สี Burgundy — นัดทดสอบ วันเสาร์', '2026-03-27T14:30:00+07:00', v_sales_id),
    (v_lead_duangjai, 'note', 'บันทึกข้อมูล', 'ลูกค้ามีรถเก่าต้องการเทิร์น — ประเมินราคา 180,000 บาท', '2026-03-26T11:00:00+07:00', v_sales_id),
    (v_lead_duangjai, 'meeting', 'Walk-in สาขาลาดพร้าว', 'ลูกค้าเข้าชมโชว์รูม สนใจ Yaris Cross และ Corolla Altis', '2026-03-25T10:00:00+07:00', v_sales_id);

  -- Activities for ประวิทย์
  INSERT INTO lead_activities (lead_id, type, title, description, created_at, created_by) VALUES
    (v_lead_prawit, 'call', 'โทรแจ้งราคาพิเศษ', 'เสนอแพ็กเกจดาวน์ 10% สำหรับ Land Cruiser', '2026-03-26T16:00:00+07:00', v_sales_id),
    (v_lead_prawit, 'note', 'ข้อมูลเพิ่มเติม', 'ลูกค้าเป็นเจ้าของธุรกิจ ต้องการรถ SUV สำหรับครอบครัว', '2026-03-22T10:30:00+07:00', v_sales_id);

  -- Activities for อรณี
  INSERT INTO lead_activities (lead_id, type, title, description, created_at, created_by) VALUES
    (v_lead_oranee, 'meeting', 'นัดหมายที่โชว์รูม', 'นัดทดสอบ Corolla Altis วันอาทิตย์ เวลา 13:00', '2026-03-24T09:00:00+07:00', v_sales_id);

  -- Activities for จิรวัฒน์
  INSERT INTO lead_activities (lead_id, type, title, description, created_at, created_by) VALUES
    (v_lead_jirawat, 'booking', 'จองรถสำเร็จ', 'ชำระเงินจอง 5,000 บาท — Hilux Revo Double Cab', '2026-03-26T15:00:00+07:00', v_sales_id),
    (v_lead_jirawat, 'meeting', 'ทดสอบรถ', 'ทดสอบ Hilux Revo บนเส้นทางจริง', '2026-03-20T10:00:00+07:00', v_sales_id),
    (v_lead_jirawat, 'call', 'โทรนัดหมาย', 'นัดทดสอบรถ Hilux Revo', '2026-03-18T14:00:00+07:00', v_sales_id);

  -- ============================================================================
  -- 16. SEED DATA: Notifications
  -- ============================================================================

  INSERT INTO notifications (user_id, title, body, type, read, created_at) VALUES
    (v_sales_id, 'ลีดใหม่จาก Facebook', 'คุณสมศักดิ์ สนใจ Corolla Altis — โปรดติดต่อภายใน 24 ชม.', 'lead_update', false, '2026-03-28T09:00:00+07:00'),
    (v_sales_id, 'จองสำเร็จ!', 'คุณจิรวัฒน์ จอง Hilux Revo เรียบร้อยแล้ว', 'booking', false, '2026-03-27T15:30:00+07:00'),
    (v_sales_id, 'เป้าหมายประจำสัปดาห์', 'ทีมขายสาขาลาดพร้าว ทำได้ 70% ของเป้า', 'info', true, '2026-03-27T08:00:00+07:00'),
    (v_sales_id, 'นัดหมายพรุ่งนี้', 'คุณดวงใจ นัดทดสอบ Yaris Cross เวลา 10:00', 'info', true, '2026-03-26T18:00:00+07:00');

END $$;


-- ============================================================================
-- DONE! Schema + seed data complete.
-- ============================================================================
-- Next steps:
-- 1. Create demo users via Supabase Auth Dashboard (see header comments)
-- 2. Re-run the DO $$ block above if leads were skipped
-- 3. Verify data: SELECT * FROM branches; SELECT * FROM cars; SELECT * FROM leads;
-- ============================================================================
