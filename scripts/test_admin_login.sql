-- Test admin login credentials
-- Check if admin accounts exist and their status

-- Check admin@chairpark.com
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'admin@chairpark.com';

-- Check hello@chairpark.com  
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'hello@chairpark.com';

-- Check user roles
SELECT 
  ur.user_id,
  ur.email,
  ur.role,
  ur.created_at,
  au.email_confirmed_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.email IN ('admin@chairpark.com', 'hello@chairpark.com');
