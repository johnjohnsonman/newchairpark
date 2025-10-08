-- 제품 옵션 기능 추가

-- 1. products 테이블에 옵션 관련 컬럼 추가
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS options jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}'::jsonb;

-- 2. product_variants 테이블 생성 (색상, 사이즈 등 변형)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku text,
    name text NOT NULL,
    price decimal(10,2),
    original_price decimal(10,2),
    stock_quantity integer DEFAULT 0,
    options jsonb DEFAULT '{}'::jsonb, -- {color: "red", size: "L"}
    images jsonb DEFAULT '[]'::jsonb,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. product_options 테이블 생성 (옵션 타입 정의)
CREATE TABLE IF NOT EXISTS public.product_options (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name text NOT NULL, -- "색상", "사이즈", "재질"
    type text NOT NULL DEFAULT 'select', -- "select", "color", "text", "number"
    required boolean DEFAULT false,
    values jsonb DEFAULT '[]'::jsonb, -- [{"value": "빨강", "color": "#FF0000"}, {"value": "파랑", "color": "#0000FF"}]
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON public.product_options(product_id);
CREATE INDEX IF NOT EXISTS idx_products_options ON public.products USING gin(options);
CREATE INDEX IF NOT EXISTS idx_products_variants ON public.products USING gin(variants);

-- 5. RLS 정책 설정
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;

-- Product variants 정책
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Product variants are manageable by authenticated users" ON public.product_variants
    FOR ALL USING (auth.role() = 'authenticated');

-- Product options 정책
CREATE POLICY "Product options are viewable by everyone" ON public.product_options
    FOR SELECT USING (true);

CREATE POLICY "Product options are manageable by authenticated users" ON public.product_options
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. 트리거 함수 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_options_updated_at ON public.product_options;
CREATE TRIGGER update_product_options_updated_at
    BEFORE UPDATE ON public.product_options
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
