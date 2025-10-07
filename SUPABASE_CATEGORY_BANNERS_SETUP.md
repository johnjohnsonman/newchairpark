# Category Banners 테이블 설정 가이드

## 1. SQL 스크립트 실행

Supabase 대시보드에서 SQL Editor를 열고 다음 스크립트를 실행하세요:

```sql
-- Create category_banners table for managing brand banners and other category banners
CREATE TABLE IF NOT EXISTS category_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_banners_category ON category_banners(category);
CREATE INDEX IF NOT EXISTS idx_category_banners_order ON category_banners(category, order_index);
CREATE INDEX IF NOT EXISTS idx_category_banners_active ON category_banners(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_category_banners_updated_at 
    BEFORE UPDATE ON category_banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 2. RLS (Row Level Security) 설정

보안을 위해 RLS 정책을 설정하세요:

```sql
-- Enable RLS
ALTER TABLE category_banners ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read banners
CREATE POLICY "Allow read access to category_banners" ON category_banners
    FOR SELECT USING (true);

-- Allow authenticated users to insert banners
CREATE POLICY "Allow insert access to category_banners" ON category_banners
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update banners
CREATE POLICY "Allow update access to category_banners" ON category_banners
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete banners
CREATE POLICY "Allow delete access to category_banners" ON category_banners
    FOR DELETE USING (auth.role() = 'authenticated');
```

## 3. Storage 설정

브랜드 배너 이미지를 위한 Storage 버킷을 설정하세요:

```sql
-- Create storage bucket for category banners
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true);

-- Allow public access to images
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' AND 
        auth.role() = 'authenticated'
    );

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'images' AND 
        auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' AND 
        auth.role() = 'authenticated'
    );
```

## 4. 테이블 구조

### category_banners 테이블 컬럼:

- `id`: UUID (Primary Key)
- `category`: TEXT (브랜드 ID 또는 카테고리 식별자)
- `image_url`: TEXT (배너 이미지 URL)
- `title`: TEXT (배너 제목, 선택사항)
- `description`: TEXT (배너 설명, 선택사항)
- `order_index`: INTEGER (배너 순서)
- `link_url`: TEXT (클릭 시 이동할 URL, 선택사항)
- `is_active`: BOOLEAN (활성화 상태)
- `created_at`: TIMESTAMP (생성일시)
- `updated_at`: TIMESTAMP (수정일시)

## 5. 사용법

### 브랜드 배너 카테고리 형식:
- `brand-{brandId}`: 브랜드별 배너 (예: `brand-herman-miller`)

### API 엔드포인트:
- `POST /api/category-banners/upload`: 배너 업로드
- `PUT /api/category-banners/[id]`: 배너 수정
- `DELETE /api/category-banners/[id]`: 배너 삭제

## 6. 확인 방법

설정이 완료되면 다음을 확인하세요:

1. Supabase 대시보드에서 `category_banners` 테이블이 생성되었는지 확인
2. 어드민에서 브랜드 편집 페이지로 이동
3. 브랜드 배너 업로드 기능이 정상 작동하는지 테스트
4. 업로드된 배너가 브랜드 상세 페이지에서 캐러셀로 표시되는지 확인

## 문제 해결

만약 여전히 오류가 발생한다면:

1. Supabase 프로젝트의 환경 변수가 올바른지 확인
2. 테이블이 정확히 생성되었는지 확인
3. RLS 정책이 올바르게 설정되었는지 확인
4. Storage 버킷이 올바르게 설정되었는지 확인
