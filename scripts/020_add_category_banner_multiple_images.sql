-- 카테고리 배너 테이블에 여러 이미지 지원 추가 (안전한 마이그레이션)

-- 먼저 새로운 컬럼들을 추가 (기존 컬럼은 유지)
ALTER TABLE category_banners 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS featured_image_index INTEGER DEFAULT 0;

-- 기존 background_image 데이터를 images로 마이그레이션 (아직 마이그레이션되지 않은 경우만)
UPDATE category_banners 
SET images = jsonb_build_array(background_image::text),
    featured_image_index = 0
WHERE background_image IS NOT NULL 
  AND background_image != '' 
  AND (images IS NULL OR jsonb_array_length(images) = 0);

-- 인덱스 추가 (성능 최적화) - 이미 존재하면 무시
CREATE INDEX IF NOT EXISTS idx_category_banners_category_id ON category_banners(category_id);
CREATE INDEX IF NOT EXISTS idx_category_banners_images ON category_banners USING GIN(images);

-- 코멘트 추가
COMMENT ON COLUMN category_banners.images IS '배너 이미지들의 배열 (JSONB)';
COMMENT ON COLUMN category_banners.featured_image_index IS '대표 이미지 인덱스 (0부터 시작)';

-- 기존 background_image 컬럼은 하위 호환성을 위해 유지
-- 나중에 안전하게 제거할 수 있습니다:
-- ALTER TABLE category_banners DROP COLUMN IF EXISTS background_image;
