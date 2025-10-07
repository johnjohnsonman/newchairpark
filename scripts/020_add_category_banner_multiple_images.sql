-- 카테고리 배너 테이블에 여러 이미지 지원 추가
-- background_image를 단일 이미지에서 여러 이미지 배열로 변경

-- 기존 background_image 컬럼을 images로 변경하고 JSONB 타입으로 설정
ALTER TABLE category_banners 
DROP COLUMN IF EXISTS background_image,
ADD COLUMN images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN featured_image_index INTEGER DEFAULT 0;

-- 기존 데이터가 있다면 마이그레이션
-- (기존 background_image가 있다면 첫 번째 이미지로 이동)
UPDATE category_banners 
SET images = jsonb_build_array(background_image::text)
WHERE background_image IS NOT NULL AND background_image != '';

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_category_banners_category_id ON category_banners(category_id);
CREATE INDEX IF NOT EXISTS idx_category_banners_images ON category_banners USING GIN(images);

-- 코멘트 추가
COMMENT ON COLUMN category_banners.images IS '배너 이미지들의 배열 (JSONB)';
COMMENT ON COLUMN category_banners.featured_image_index IS '대표 이미지 인덱스 (0부터 시작)';
