-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200) NOT NULL,
  comment TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read reviews
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert reviews (in production, you'd want authentication)
CREATE POLICY "Anyone can create reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to update their own reviews (simplified for now)
CREATE POLICY "Anyone can update reviews" ON reviews
  FOR UPDATE USING (true);

-- Insert sample reviews
INSERT INTO reviews (product_id, user_name, user_email, rating, title, comment, verified_purchase, helpful_count) VALUES
(1, '김민수', 'minsu@example.com', 5, '최고의 오피스 체어입니다', '장시간 앉아서 작업해도 허리가 전혀 아프지 않습니다. 가격은 비싸지만 그만한 가치가 있어요.', true, 24),
(1, '이지은', 'jieun@example.com', 5, '투자할 가치가 있습니다', '처음엔 가격 때문에 망설였는데, 사용해보니 정말 만족스럽습니다. 메쉬 소재라 여름에도 시원해요.', true, 18),
(1, '박준호', 'junho@example.com', 4, '좋지만 가격이...', '제품은 정말 좋은데 가격이 부담스럽네요. 그래도 허리 건강을 생각하면 투자할 만합니다.', true, 12),
(1, '최서연', 'seoyeon@example.com', 5, '재택근무 필수템', '재택근무하면서 허리 통증이 심했는데, 이 의자로 바꾸고 나서 완전히 해결됐어요!', true, 31),
(2, '정우진', 'woojin@example.com', 5, '엠보디는 역시 명품', '에어론과 고민하다가 엠보디를 선택했는데 정말 잘 선택한 것 같아요. 자세 교정에 도움이 많이 됩니다.', true, 15),
(2, '강민지', 'minji@example.com', 4, '편안하지만 적응 기간 필요', '처음엔 좀 딱딱하다고 느껴졌는데, 2주 정도 사용하니 몸에 완전히 맞춰지는 느낌이에요.', true, 9),
(3, '윤서준', 'seojun@example.com', 5, '리프 체어 강력 추천', '스틸케이스 제품 중에서 가장 만족스러운 제품입니다. 가격 대비 성능이 훌륭해요.', true, 22);
