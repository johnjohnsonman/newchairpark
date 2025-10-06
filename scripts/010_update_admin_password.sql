-- Update admin user password to '1234'
-- This script updates the existing admin user or creates a new one

-- First, you need to sign up with email: admin@chairpark.com and password: 1234
-- through the /admin/login page (click "Sign up" tab)

-- After signing up, run this to add them to the admins table:
-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users

-- To find the user UUID, you can query:
-- SELECT id, email FROM auth.users WHERE email = 'admin@chairpark.com';

-- Then insert into admins table:
-- INSERT INTO admins (id, email) 
-- SELECT id, email FROM auth.users WHERE email = 'admin@chairpark.com'
-- ON CONFLICT (id) DO NOTHING;

-- Note: Supabase Auth handles password hashing automatically during signup
-- You cannot directly set passwords in SQL for security reasons
