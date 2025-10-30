-- =============================================
-- CREATE RENTALS TABLE (FIXED VERSION)
-- =============================================
-- This script creates a table for rental and demo products

-- Create rentals table
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

-- Create rental_requests table
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

-- Create indexes for performance
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

-- Enable Row Level Security
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rentals table
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

-- RLS Policies for rental_requests table
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



