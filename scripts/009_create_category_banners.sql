-- Create category_banners table for managing store category banners
CREATE TABLE IF NOT EXISTS category_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL UNIQUE,
  category_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  background_image TEXT,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default banners for each category
INSERT INTO category_banners (category_id, category_name, title, description, background_image, featured_image) VALUES
('all', '전체', '전체 체어', '인체공학적 디자인과 혁신적인 기술이 결합된 프리미엄 오피스 가구', '/placeholder.svg?height=600&width=1200', '/steelcase-gesture-chair.jpg'),
('office-chair', '오피스 체어', '오피스 체어', '장시간 업무에 최적화된 인체공학적 오피스 체어 컬렉션', '/placeholder.svg?height=600&width=1200', '/steelcase-gesture-chair.jpg'),
('executive-chair', '임원용 체어', '임원용 체어', '고급스러운 디자인과 최상의 편안함을 제공하는 프리미엄 임원용 체어', '/placeholder.svg?height=600&width=1200', '/herman-miller-aeron.png'),
('lounge-chair', '라운지 체어', '라운지 체어', '휴식과 편안함을 위한 럭셔리 라운지 체어', '/placeholder.svg?height=600&width=1200', '/eames-lounge-chair.jpg'),
('conference-chair', '회의용 체어', '회의용 체어', '효율적인 회의 공간을 위한 실용적이고 스타일리시한 체어', '/placeholder.svg?height=600&width=1200', '/steelcase-leap-chair.jpg'),
('dining-chair', '다이닝 체어', '다이닝 체어', '식사 공간을 위한 편안하고 세련된 다이닝 체어', '/placeholder.svg?height=600&width=1200', '/eames-lounge-chair.jpg'),
('design-chair', '디자인 체어', '디자인 체어', '아이코닉한 디자인과 예술성이 돋보이는 특별한 체어', '/placeholder.svg?height=600&width=1200', '/herman-miller-embody-chair.jpg')
ON CONFLICT (category_id) DO NOTHING;

-- Enable RLS
ALTER TABLE category_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to category_banners"
ON category_banners FOR SELECT
TO public
USING (true);

-- Allow authenticated users to manage banners
CREATE POLICY "Allow authenticated users to manage category_banners"
ON category_banners FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
