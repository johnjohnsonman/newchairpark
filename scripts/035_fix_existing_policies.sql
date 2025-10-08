-- 기존 정책 삭제 후 재생성

-- Product variants 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON public.product_variants;
DROP POLICY IF EXISTS "Product variants are manageable by authenticated users" ON public.product_variants;

CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Product variants are manageable by authenticated users" ON public.product_variants
    FOR ALL USING (auth.role() = 'authenticated');

-- Product options 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Product options are viewable by everyone" ON public.product_options;
DROP POLICY IF EXISTS "Product options are manageable by authenticated users" ON public.product_options;

CREATE POLICY "Product options are viewable by everyone" ON public.product_options
    FOR SELECT USING (true);

CREATE POLICY "Product options are manageable by authenticated users" ON public.product_options
    FOR ALL USING (auth.role() = 'authenticated');
