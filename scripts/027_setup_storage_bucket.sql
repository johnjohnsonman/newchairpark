-- Supabase Storage 버킷 설정
-- 이 스크립트는 Supabase 대시보드의 Storage 섹션에서 실행하거나
-- SQL Editor에서 실행할 수 있습니다.

-- 1. images 버킷 생성 (이미 존재하는 경우 무시됨)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS 정책 설정 (공개 읽기, 인증된 사용자 업로드)
-- 공개 읽기 정책
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- 인증된 사용자 업로드 정책
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- 사용자 자신의 파일 삭제 정책
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. 버킷 정보 확인
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE name = 'images';
