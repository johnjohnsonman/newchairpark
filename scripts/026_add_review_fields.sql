-- 리뷰 테이블에 새로운 필드 추가
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS height INTEGER,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS sitting_duration VARCHAR(20);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_reviews_height ON reviews(height);
CREATE INDEX IF NOT EXISTS idx_reviews_gender ON reviews(gender);
CREATE INDEX IF NOT EXISTS idx_reviews_sitting_duration ON reviews(sitting_duration);

-- 기존 리뷰 데이터에 기본값 설정 (필요한 경우)
-- UPDATE reviews SET height = NULL, gender = NULL, sitting_duration = NULL WHERE height IS NULL;

-- RLS 정책 업데이트 (필요한 경우)
-- 기존 RLS 정책이 있다면 새로운 필드들도 포함하도록 업데이트
