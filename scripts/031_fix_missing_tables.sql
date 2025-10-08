-- 누락된 테이블들 생성 및 수정

-- 1. resources 테이블 생성 (존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS public.resources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    brand text,
    product_name text,
    file_url text NOT NULL,
    file_type text,
    file_size integer,
    category text DEFAULT 'general',
    featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. recycle_items 테이블 수정 (brand, product_name 컬럼 추가)
ALTER TABLE public.recycle_items 
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS product_name text;

-- 3. products 테이블의 중복 제약 조건 확인 및 수정
-- slug 유니크 제약 조건이 있는지 확인하고 필요시 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'products_slug_key'
    ) THEN
        ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
    END IF;
END $$;

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_resources_brand ON public.resources(brand);
CREATE INDEX IF NOT EXISTS idx_resources_product_name ON public.resources(product_name);
CREATE INDEX IF NOT EXISTS idx_recycle_items_brand ON public.recycle_items(brand);
CREATE INDEX IF NOT EXISTS idx_recycle_items_product_name ON public.recycle_items(product_name);

-- 5. RLS 정책 설정
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Resources 테이블에 대한 정책
CREATE POLICY "Resources are viewable by everyone" ON public.resources
    FOR SELECT USING (true);

CREATE POLICY "Resources are insertable by authenticated users" ON public.resources
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Resources are updatable by authenticated users" ON public.resources
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Resources are deletable by authenticated users" ON public.resources
    FOR DELETE USING (auth.role() = 'authenticated');

-- Recycle items 테이블에 대한 정책 (이미 있는 경우 무시)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'recycle_items' AND policyname = 'Recycle items are viewable by everyone'
    ) THEN
        CREATE POLICY "Recycle items are viewable by everyone" ON public.recycle_items
            FOR SELECT USING (true);
    END IF;
END $$;
