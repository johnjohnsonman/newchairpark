-- This script should be run manually to create the first admin user
-- You can create an admin user through Supabase Auth UI or by running this after signup

-- Note: First, sign up a user through the app at /admin/login
-- Then you can verify they exist in auth.users

-- Optional: Create an admins table to track admin roles
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin list
CREATE POLICY "Admins can view admin list" ON admins FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admins)
);

-- For now, manually insert admin users
-- Example: INSERT INTO admins (id, email) VALUES ('user-uuid-here', 'admin@chairpark.com');
