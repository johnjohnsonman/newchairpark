-- 기존 admin 계정 삭제 (있다면)
DELETE FROM auth.users WHERE email = 'admin@chairpark.com';

-- 새로운 admin 계정 생성 (이메일 확인 완료 상태)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@chairpark.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- user_roles 테이블에 admin 권한 추가
INSERT INTO public.user_roles (user_id, role, email)
SELECT id, 'admin', 'admin@chairpark.com'
FROM auth.users
WHERE email = 'admin@chairpark.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
