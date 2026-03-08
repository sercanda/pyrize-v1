-- ============================================================
-- 003_crm_integration.sql
-- CRM modulu: customers, properties, deals, activities, todos
-- Onceki denemelerdeki yarim tablolari temizle, sonra olustur
-- ============================================================

-- Onceki denemelerdeki yarim tablolari temizle (siralama onemli: FK bagimliliklari)
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- ========================
-- 1. customers tablosu
-- ========================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'Aktif',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  type TEXT DEFAULT 'buyer',
  city TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID
);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(type);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- Auth stub: service role RLS'i bypass eder, bu politika anon/authenticated icin
CREATE POLICY customers_all ON customers FOR ALL USING (true) WITH CHECK (true);

-- ========================
-- 2. presentations tablosuna eksik kolonlar
-- ========================
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS customer_id UUID;
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS style TEXT;
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- FK constraint (customers olusturulduktan sonra)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'presentations_customer_id_fkey'
    AND table_name = 'presentations'
  ) THEN
    ALTER TABLE presentations
      ADD CONSTRAINT presentations_customer_id_fkey
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_presentations_customer_id ON presentations(customer_id);

-- ========================
-- 3. properties tablosu (YENi)
-- ========================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  address TEXT,
  city TEXT,
  price NUMERIC DEFAULT 0,
  type TEXT DEFAULT 'sale' CHECK (type IN ('sale', 'rent')),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'pending')),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  notes TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  room_count TEXT,
  area_sqm NUMERIC,
  floor_info TEXT,
  building_age INTEGER,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID
);

CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_customer_id ON properties(customer_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY properties_all ON properties FOR ALL USING (true) WITH CHECK (true);

-- ========================
-- 4. deals tablosu (YENi)
-- ========================
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  stage TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'meeting', 'offer', 'contract', 'closed', 'lost')),
  value NUMERIC DEFAULT 0,
  expected_close_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID
);

CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_property_id ON deals(property_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY deals_all ON deals FOR ALL USING (true) WITH CHECK (true);

-- ========================
-- 5. activities tablosu (YENi)
-- ========================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'presentation')),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  description TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID
);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_customer_id ON activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal_id ON activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date DESC);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY activities_all ON activities FOR ALL USING (true) WITH CHECK (true);

-- ========================
-- 6. todos tablosu (YENi)
-- ========================
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'inprogress', 'done')),
  due_date TIMESTAMPTZ,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_customer_id ON todos(customer_id);
CREATE INDEX IF NOT EXISTS idx_todos_deal_id ON todos(deal_id);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY todos_all ON todos FOR ALL USING (true) WITH CHECK (true);
