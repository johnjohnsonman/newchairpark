-- Supabase 프로젝트 설정 확인
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 1. 현재 사용자 및 역할 확인
SELECT current_user, current_role;

-- 2. brands 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'brands' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. banner_images, banner_titles, banner_descriptions 컬럼 존재 확인
SELECT 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'banner_images'
  ) THEN '✅ banner_images exists' ELSE '❌ banner_images missing' END as banner_images_check,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'banner_titles'
  ) THEN '✅ banner_titles exists' ELSE '❌ banner_titles missing' END as banner_titles_check,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'banner_descriptions'
  ) THEN '✅ banner_descriptions exists' ELSE '❌ banner_descriptions missing' END as banner_descriptions_check;

-- 4. brands 테이블의 RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'brands';

-- 5. brands 테이블에 데이터가 있는지 확인
SELECT COUNT(*) as brand_count FROM brands;

-- 6. 특정 브랜드의 banner 관련 컬럼 값 확인 (예시)
SELECT id, name, banner_images, banner_titles, banner_descriptions 
FROM brands 
LIMIT 3;
