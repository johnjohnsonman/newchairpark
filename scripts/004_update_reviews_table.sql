-- Add new columns to reviews table for detailed user information
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS height INTEGER; -- in cm
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS weight INTEGER; -- in kg
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS occupation VARCHAR(100);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sitting_style VARCHAR(100);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS previous_chair VARCHAR(200);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS design_score INTEGER CHECK (design_score >= 1 AND design_score <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS comfort_score INTEGER CHECK (comfort_score >= 1 AND comfort_score <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS value_score INTEGER CHECK (value_score >= 1 AND value_score <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create table for review recommendations
CREATE TABLE IF NOT EXISTS review_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_identifier VARCHAR(255) NOT NULL, -- IP or user ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_identifier)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_review_recommendations_review_id ON review_recommendations(review_id);

-- Enable Row Level Security
ALTER TABLE review_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read review recommendations" ON review_recommendations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create review recommendations" ON review_recommendations
  FOR INSERT WITH CHECK (true);

-- Update sample reviews with new fields
UPDATE reviews SET 
  age = 32,
  height = 175,
  weight = 70,
  occupation = '개발자',
  sitting_style = '장시간 앉아서 작업',
  previous_chair = '일반 사무용 의자',
  satisfaction_score = 5,
  design_score = 5,
  comfort_score = 5,
  value_score = 4,
  view_count = 245,
  featured = true
WHERE user_name = '김민수';

UPDATE reviews SET 
  age = 28,
  height = 162,
  weight = 52,
  occupation = '디자이너',
  sitting_style = '자주 자세를 바꿈',
  previous_chair = '게이밍 의자',
  satisfaction_score = 5,
  design_score = 5,
  comfort_score = 5,
  value_score = 4,
  view_count = 189,
  featured = true
WHERE user_name = '이지은';

UPDATE reviews SET 
  age = 35,
  height = 180,
  weight = 78,
  occupation = '마케터',
  sitting_style = '바른 자세 유지',
  previous_chair = '스틸케이스 리프',
  satisfaction_score = 4,
  design_score = 5,
  comfort_score = 4,
  value_score = 3,
  view_count = 156,
  featured = true
WHERE user_name = '박준호';

UPDATE reviews SET 
  age = 29,
  height = 168,
  weight = 58,
  occupation = '작가',
  sitting_style = '다리를 꼬고 앉음',
  previous_chair = '이케아 의자',
  satisfaction_score = 5,
  design_score = 5,
  comfort_score = 5,
  value_score = 5,
  view_count = 312,
  featured = true
WHERE user_name = '최서연';

UPDATE reviews SET 
  age = 41,
  height = 177,
  weight = 75,
  occupation = 'CEO',
  sitting_style = '장시간 회의',
  previous_chair = '허먼밀러 에어론',
  satisfaction_score = 5,
  design_score = 5,
  comfort_score = 5,
  value_score = 4,
  view_count = 98
WHERE user_name = '정우진';

UPDATE reviews SET 
  age = 26,
  height = 165,
  weight = 55,
  occupation = '학생',
  sitting_style = '공부할 때 오래 앉음',
  previous_chair = '일반 학생 의자',
  satisfaction_score = 4,
  design_score = 4,
  comfort_score = 4,
  value_score = 4,
  view_count = 67
WHERE user_name = '강민지';

UPDATE reviews SET 
  age = 38,
  height = 182,
  weight = 82,
  occupation = '변호사',
  sitting_style = '바른 자세로 장시간',
  previous_chair = '듀오백',
  satisfaction_score = 5,
  design_score = 5,
  comfort_score = 5,
  value_score = 5,
  view_count = 134
WHERE user_name = '윤서준';
