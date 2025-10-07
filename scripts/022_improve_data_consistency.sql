-- Improve data consistency for better search and autocomplete
-- 이 스크립트는 브랜드와 제품명의 일관성을 높여 검색과 자동완성을 개선합니다

-- 1. Gallery 테이블에 brand와 product_name 컬럼 추가 (이미 추가됨)
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS product_name TEXT;

-- 2. 인덱스 추가로 검색 성능 향상
CREATE INDEX IF NOT EXISTS idx_gallery_brand ON gallery(brand);
CREATE INDEX IF NOT EXISTS idx_gallery_product_name ON gallery(product_name);
CREATE INDEX IF NOT EXISTS idx_gallery_title_search ON gallery USING GIN (to_tsvector('english', title));

-- Recycle items 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_recycle_brand ON recycle_items(brand);
CREATE INDEX IF NOT EXISTS idx_recycle_title_search ON recycle_items USING GIN (to_tsvector('english', title));

-- Products 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING GIN (to_tsvector('english', description));

-- Resources 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_resources_title_search ON resources USING GIN (to_tsvector('english', title));

-- 3. 브랜드명 정규화를 위한 뷰 생성 (모든 곳에서 사용된 브랜드)
CREATE OR REPLACE VIEW all_brands_used AS
SELECT DISTINCT name as brand_name FROM brands
UNION
SELECT DISTINCT brand as brand_name FROM gallery WHERE brand IS NOT NULL AND brand != ''
UNION  
SELECT DISTINCT brand as brand_name FROM recycle_items WHERE brand IS NOT NULL AND brand != ''
ORDER BY brand_name;

-- 4. 제품명 정규화를 위한 뷰 생성
CREATE OR REPLACE VIEW all_products_used AS
SELECT DISTINCT 
  product_name as product,
  brand,
  'gallery' as source
FROM gallery 
WHERE product_name IS NOT NULL AND product_name != ''
UNION
SELECT DISTINCT 
  title as product,
  brand,
  'recycle' as source
FROM recycle_items 
WHERE title IS NOT NULL AND title != ''
UNION
SELECT DISTINCT 
  p.name as product,
  b.name as brand,
  'products' as source
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.name IS NOT NULL AND p.name != ''
ORDER BY brand, product;

-- 5. 검색 통계를 위한 테이블 생성 (선택사항)
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  search_category TEXT,
  results_count INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clicked_result_id UUID,
  clicked_result_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(search_query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at DESC);

-- 6. 자주 사용되는 브랜드-제품 조합을 위한 materialized view (성능 최적화)
CREATE MATERIALIZED VIEW IF NOT EXISTS brand_product_combinations AS
SELECT 
  brand,
  product_name as product,
  COUNT(*) as usage_count
FROM (
  SELECT brand, product_name FROM gallery WHERE brand IS NOT NULL AND product_name IS NOT NULL
  UNION ALL
  SELECT brand, title as product_name FROM recycle_items WHERE brand IS NOT NULL AND title IS NOT NULL
  UNION ALL
  SELECT b.name as brand, p.name as product_name FROM products p
  LEFT JOIN brands b ON p.brand_id = b.id
  WHERE b.name IS NOT NULL AND p.name IS NOT NULL
) combined
GROUP BY brand, product_name
ORDER BY usage_count DESC, brand, product_name;

-- Materialized view를 주기적으로 refresh하는 함수 (선택사항)
CREATE OR REPLACE FUNCTION refresh_brand_product_combinations()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW brand_product_combinations;
END;
$$ LANGUAGE plpgsql;

-- 7. 브랜드명 대소문자 통일을 위한 함수 (선택사항)
CREATE OR REPLACE FUNCTION normalize_brand_name(brand_name TEXT)
RETURNS TEXT AS $$
BEGIN
  -- 일반적인 브랜드명 표기법으로 변환
  RETURN CASE 
    WHEN LOWER(brand_name) = 'herman miller' THEN 'Herman Miller'
    WHEN LOWER(brand_name) = 'steelcase' THEN 'Steelcase'
    WHEN LOWER(brand_name) = 'vitra' THEN 'Vitra'
    WHEN LOWER(brand_name) = 'knoll' THEN 'Knoll'
    ELSE INITCAP(brand_name) -- 각 단어의 첫 글자를 대문자로
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 8. 트리거로 자동 정규화 적용 (선택사항)
CREATE OR REPLACE FUNCTION auto_normalize_brand()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.brand IS NOT NULL THEN
    NEW.brand = normalize_brand_name(NEW.brand);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gallery 테이블에 트리거 적용
DROP TRIGGER IF EXISTS trigger_normalize_gallery_brand ON gallery;
CREATE TRIGGER trigger_normalize_gallery_brand
  BEFORE INSERT OR UPDATE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION auto_normalize_brand();

-- Recycle items 테이블에 트리거 적용
DROP TRIGGER IF EXISTS trigger_normalize_recycle_brand ON recycle_items;
CREATE TRIGGER trigger_normalize_recycle_brand
  BEFORE INSERT OR UPDATE ON recycle_items
  FOR EACH ROW
  EXECUTE FUNCTION auto_normalize_brand();

-- 완료 메시지
SELECT 'Data consistency improvements applied successfully!' as message;
