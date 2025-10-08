-- 데이터베이스 스키마 확인

-- 1. 모든 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. resources 테이블 구조 확인
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resources' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. recycle_items 테이블 구조 확인
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'recycle_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. products 테이블 구조 확인
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. 제약 조건 확인
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.table_name IN ('products', 'resources', 'recycle_items')
ORDER BY tc.table_name, tc.constraint_type;

-- 6. 중복 데이터 확인 (products 테이블)
SELECT slug, COUNT(*) as count
FROM public.products
GROUP BY slug
HAVING COUNT(*) > 1;
