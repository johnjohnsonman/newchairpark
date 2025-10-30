-- =============================================
-- CREATE RENTALS TABLE (CLEAN VERSION)
-- =============================================
-- 기존 정책과 테이블을 정리하고 새로 생성합니다

-- 1. 기존 정책 삭제 (있을 경우)
DROP POLICY IF EXISTS "Anyone can view rentals" ON rentals;
DROP POLICY IF EXISTS "Only admins can insert rentals" ON rentals;
DROP POLICY IF EXISTS "Only admins can update rentals" ON rentals;
DROP POLICY IF EXISTS "Only admins can delete rentals" ON rentals;

DROP POLICY IF EXISTS "Users can view their own rental requests" ON rental_requests;
DROP POLICY IF EXISTS "Authenticated users can insert rental requests" ON rental_requests;
DROP POLICY IF EXISTS "Users can update their own pending rental requests" ON rental_requests;
DROP POLICY IF EXISTS "Only admins can delete rental requests" ON rental_requests;

-- 2. 테이블 생성 (이미 있으면 스킵)
CREATE TABLE IF NOT EXISTS rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rental', 'demo')),
  price_monthly DECIMAL(10, 2),
  price_daily DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  description TEXT,
  image_url TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  min_rental_period INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rental_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('rental', 'demo')),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  rental_period TEXT,
  preferred_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_rentals_brand_id ON rentals(brand_id);
CREATE INDEX IF NOT EXISTS idx_rentals_category ON rentals(category);
CREATE INDEX IF NOT EXISTS idx_rentals_type ON rentals(type);
CREATE INDEX IF NOT EXISTS idx_rentals_slug ON rentals(slug);
CREATE INDEX IF NOT EXISTS idx_rentals_featured ON rentals(featured);
CREATE INDEX IF NOT EXISTS idx_rentals_available ON rentals(available);

CREATE INDEX IF NOT EXISTS idx_rental_requests_rental_id ON rental_requests(rental_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_user_id ON rental_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_status ON rental_requests(status);
CREATE INDEX IF NOT EXISTS idx_rental_requests_created_at ON rental_requests(created_at DESC);

-- 4. RLS 활성화
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_requests ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 생성 (깔끔하게 재생성)
CREATE POLICY "Anyone can view rentals" ON rentals
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert rentals" ON rentals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update rentals" ON rentals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete rentals" ON rentals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own rental requests" ON rental_requests
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can insert rental requests" ON rental_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending rental requests" ON rental_requests
  FOR UPDATE USING (
    (auth.uid() = user_id AND status = 'pending')
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete rental requests" ON rental_requests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );







