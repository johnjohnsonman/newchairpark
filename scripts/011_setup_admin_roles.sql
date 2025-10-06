-- Create user_roles table for admin management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own role
CREATE POLICY "Users can read own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin user (replace with your email)
-- This will be executed after you sign up
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@chairpark.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Update RLS policies for all admin tables
-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brands"
  ON public.brands FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify brands"
  ON public.brands FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery"
  ON public.gallery FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify gallery"
  ON public.gallery FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Recycle items
ALTER TABLE public.recycle_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recycle items"
  ON public.recycle_items FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify recycle items"
  ON public.recycle_items FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Category banners
ALTER TABLE public.category_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view category banners"
  ON public.category_banners FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify category banners"
  ON public.category_banners FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Reviews (users can create their own, admins can modify all)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));
