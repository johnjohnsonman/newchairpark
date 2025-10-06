# 갤러리 다중 이미지 업로드 설정 가이드

## 🗄️ 데이터베이스 마이그레이션

갤러리에 다중 이미지 기능을 사용하려면 먼저 데이터베이스를 업데이트해야 합니다.

### 방법 1: Supabase 대시보드에서 실행

1. **Supabase 대시보드 접속**
   - https://app.supabase.com 로그인
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭
   - "New query" 버튼 클릭

3. **마이그레이션 SQL 복사 & 실행**
   
   아래 SQL을 복사해서 붙여넣고 "Run" 버튼 클릭:

```sql
-- Add multiple images support to gallery table
ALTER TABLE public.gallery 
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS featured_image_index INTEGER DEFAULT 0;

-- Update existing records to have their image_url as the first image in the array
UPDATE public.gallery 
SET images = jsonb_build_array(image_url)
WHERE images = '[]'::jsonb AND image_url IS NOT NULL AND image_url != '';

-- Add comment
COMMENT ON COLUMN public.gallery.images IS 'Array of image URLs in display order';
COMMENT ON COLUMN public.gallery.featured_image_index IS 'Index of the featured/primary image in the images array';
```

4. **성공 확인**
   - "Success. No rows returned" 메시지가 나오면 성공!

### 방법 2: psql 또는 다른 PostgreSQL 클라이언트 사용

```bash
# Supabase 연결 정보로 접속 후 위의 SQL 실행
psql postgresql://[YOUR_CONNECTION_STRING]
```

## 🧪 테스트

마이그레이션 후:

1. 브라우저에서 http://localhost:3001/admin/gallery/new 접속
2. F12를 눌러 개발자 도구 콘솔 열기
3. 이미지 여러 개 업로드
4. 저장 버튼 클릭
5. 콘솔에서 "Submitting gallery data:" 로그 확인
6. 성공하면 /admin/gallery 페이지로 리다이렉트

## 🔍 문제 해결

### 에러: "column does not exist"
→ 마이그레이션 SQL을 아직 실행하지 않았습니다. 위의 SQL을 실행하세요.

### 저장 버튼을 눌러도 반응이 없음
1. 브라우저 콘솔(F12) 확인
2. 빨간색 에러 메시지 확인
3. "Gallery form error:" 로그 찾기

### 권한 에러
→ 관리자로 로그인했는지 확인하세요.

## ✨ 기능

마이그레이션 후 사용 가능한 기능:

- ✅ 여러 이미지 동시 업로드 (최대 10개)
- ✅ 드래그로 순서 변경
- ✅ 별 아이콘으로 대표 이미지 선택
- ✅ 개별 이미지 삭제
- ✅ 순서 번호 표시

