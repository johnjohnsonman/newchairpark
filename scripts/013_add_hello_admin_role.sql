-- Add admin role for hello@chairpark.com
-- This script grants admin privileges to the hello@chairpark.com account

-- Insert admin role for hello@chairpark.com
-- Note: The user must exist in auth.users first (created via Supabase Dashboard)
INSERT INTO public.user_roles (user_id, role, email)
SELECT 
  id,
  'admin',
  'hello@chairpark.com'
FROM auth.users
WHERE email = 'hello@chairpark.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Verify the admin role was added
SELECT 
  ur.user_id,
  ur.email,
  ur.role,
  ur.created_at,
  au.email_confirmed_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.email = 'hello@chairpark.com';
