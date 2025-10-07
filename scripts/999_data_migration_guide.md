# 데이터 마이그레이션 가이드

## 현재 상황
- 기존 데이터가 하드코딩된 Supabase 프로젝트에 있음
- 새로운 Supabase 프로젝트로 완전히 마이그레이션 필요

## 마이그레이션 단계

### 1. 새 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `SUPABASE_SETUP.md` 가이드에 따라 스키마 설정

### 2. 기존 데이터 백업
```sql
-- 기존 프로젝트에서 데이터 백업
-- 각 테이블별로 데이터 추출

-- 브랜드 데이터
SELECT * FROM brands;

-- 제품 데이터  
SELECT * FROM products;

-- 갤러리 데이터
SELECT * FROM gallery;

-- 리뷰 데이터
SELECT * FROM reviews;

-- 중고마켓 데이터
SELECT * FROM recycle_items;

-- 카테고리 배너 데이터
SELECT * FROM category_banners;

-- 사용자 데이터 (선택적)
SELECT * FROM profiles;
```

### 3. 새 프로젝트에 데이터 이관
```sql
-- 새 프로젝트에서 데이터 삽입
-- 브랜드 데이터 먼저 삽입 (외래키 참조 때문에)
INSERT INTO brands (id, name, slug, logo_url, description, hero_image_url, created_at, updated_at)
VALUES (...);

-- 제품 데이터 삽입
INSERT INTO products (id, name, slug, brand_id, category, price, original_price, description, image_url, images, specifications, in_stock, featured, created_at, updated_at)
VALUES (...);

-- 나머지 테이블들도 순서대로 삽입
```

### 4. 이미지 및 파일 마이그레이션
```bash
# Supabase CLI를 사용하여 스토리지 마이그레이션
supabase storage cp --recursive s3://old-bucket-name s3://new-bucket-name
```

### 5. 환경변수 업데이트
```env
# .env.local 파일 업데이트
NEXT_PUBLIC_SUPABASE_URL=https://new-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=new_anon_key
SUPABASE_SERVICE_ROLE_KEY=new_service_role_key
```

### 6. 배포 환경 업데이트
- Vercel 대시보드에서 환경변수 업데이트
- 다른 배포 플랫폼도 동일하게 업데이트

## 자동화 스크립트 (선택적)

Python 스크립트로 자동 마이그레이션:

```python
import os
from supabase import create_client, Client

# 기존 프로젝트
OLD_URL = "https://nejjxccatspqlkujxlnd.supabase.co"
OLD_KEY = "old_service_role_key"

# 새 프로젝트  
NEW_URL = "https://new-project-ref.supabase.co"
NEW_KEY = "new_service_role_key"

old_supabase: Client = create_client(OLD_URL, OLD_KEY)
new_supabase: Client = create_client(NEW_URL, NEW_KEY)

# 데이터 마이그레이션 함수들
def migrate_brands():
    brands = old_supabase.table("brands").select("*").execute()
    for brand in brands.data:
        new_supabase.table("brands").insert(brand).execute()

def migrate_products():
    products = old_supabase.table("products").select("*").execute()
    for product in products.data:
        new_supabase.table("products").insert(product).execute()

# 나머지 테이블들도 동일한 방식으로 마이그레이션
```

## 검증 체크리스트

- [ ] 모든 테이블 데이터가 정상적으로 이관되었는지 확인
- [ ] 외래키 관계가 올바르게 설정되었는지 확인
- [ ] 이미지 및 파일이 정상적으로 접근 가능한지 확인
- [ ] 관리자 계정이 정상적으로 생성되었는지 확인
- [ ] RLS 정책이 올바르게 적용되었는지 확인
- [ ] API 엔드포인트가 정상적으로 작동하는지 확인
- [ ] 프론트엔드에서 모든 기능이 정상 작동하는지 확인

## 롤백 계획

문제 발생 시 롤백 방법:
1. 기존 환경변수로 복원
2. 기존 Supabase 프로젝트 계속 사용
3. 점진적으로 새 프로젝트로 이관

## 주의사항

- 마이그레이션 전 반드시 데이터 백업
- 외래키 참조 순서를 지켜서 데이터 삽입
- 이미지 URL 경로가 변경될 수 있으므로 확인 필요
- 사용자 인증 토큰은 새로 발급받아야 함
