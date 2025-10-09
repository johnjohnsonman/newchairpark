-- ============================================
-- Admin 계정 비밀번호 리셋 스크립트
-- ============================================
-- 이 스크립트는 Supabase SQL Editor에서 직접 실행해야 합니다.
-- 주의: auth.users 테이블을 직접 수정하므로 주의가 필요합니다.

-- 1. hello@chairpark.com 계정이 있는지 확인
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'hello@chairpark.com';

-- 2. hello@chairpark.com의 비밀번호를 'chairpark123!'로 업데이트
-- 주의: 이 방법은 Supabase의 bcrypt를 사용합니다
UPDATE auth.users
SET 
  encrypted_password = crypt('chairpark123!', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'hello@chairpark.com';

-- 3. hello@chairpark.com이 user_roles에 있는지 확인
SELECT 
  user_id,
  email,
  role,
  created_at
FROM public.user_roles
WHERE email = 'hello@chairpark.com';

-- 4. user_roles에 admin 권한 추가 (없으면)
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

-- 5. 결과 확인
SELECT 
  ur.user_id,
  ur.email,
  ur.role,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.email = 'hello@chairpark.com';

-- ============================================
-- 완료 후 다음 정보로 로그인하세요:
-- 이메일: hello@chairpark.com
-- 비밀번호: chairpark123!
-- ============================================

