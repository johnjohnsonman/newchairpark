-- 로컬 개발용 관리자 계정 설정
-- Email: hello@chairpark.com
-- Password: 123456

-- 1. 관리자 사용자 생성 (이미 있다면 무시)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'hello@chairpark.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- 2. 관리자 역할 부여
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'hello@chairpark.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- 3. 확인
SELECT 
  u.email,
  ur.role,
  u.email_confirmed_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'hello@chairpark.com';
