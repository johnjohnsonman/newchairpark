-- 제품 조회수 증가 함수 생성

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_product_view_count(product_slug text)
RETURNS void AS $$
BEGIN
  UPDATE public.products 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = product_slug;
END;
$$ LANGUAGE plpgsql;

-- products 테이블에 view_count 컬럼 추가 (없는 경우)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- view_count 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_products_view_count ON public.products(view_count DESC);
