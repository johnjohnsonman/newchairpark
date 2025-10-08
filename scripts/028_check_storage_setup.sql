-- Storage 버킷 확인 및 생성
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 1. 기존 버킷 확인
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets;

-- 2. images 버킷이 없다면 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage';

-- 4. images 버킷에 대한 RLS 정책 생성 (필요시)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public Update" ON storage.objects
FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Public Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'images');
