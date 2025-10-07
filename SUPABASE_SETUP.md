# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트 생성
2. 프로젝트 이름: `chairpark` (또는 원하는 이름)
3. 데이터베이스 비밀번호 설정

## 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 환경변수 값 찾기:

1. Supabase 대시보드 → Settings → API
2. `Project URL`을 `NEXT_PUBLIC_SUPABASE_URL`에 복사
3. `anon public` 키를 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사
4. `service_role secret` 키를 `SUPABASE_SERVICE_ROLE_KEY`에 복사

## 3. 데이터베이스 스키마 설정

1. Supabase 대시보드 → SQL Editor
2. `scripts/000_complete_supabase_schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기 후 실행

## 4. 스토리지 버킷 설정

스키마 실행 후 자동으로 생성되지만, 수동으로 확인하려면:

1. Supabase 대시보드 → Storage
2. 다음 버킷들이 생성되었는지 확인:
   - `images` (공개 버킷)
   - `files` (공개 버킷)

## 5. 관리자 계정 생성

1. Supabase 대시보드 → Authentication → Users
2. "Add user" 클릭하여 관리자 계정 생성
3. 또는 SQL Editor에서 다음 쿼리 실행:

```sql
-- 관리자 계정 생성 (이메일과 비밀번호를 실제 값으로 변경)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@chairpark.com',
  crypt('your_admin_password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}',
  FALSE,
  '',
  '',
  '',
  ''
);

-- 관리자 프로필 생성
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
FROM auth.users
WHERE email = 'admin@chairpark.com';
```

## 6. 테스트 데이터 삽입 (선택사항)

샘플 브랜드와 제품 데이터를 추가하려면:

```sql
-- 샘플 제품 추가
INSERT INTO products (name, slug, brand_id, category, price, description, image_url) VALUES
  ('Herman Miller Aeron Chair', 'herman-miller-aeron-chair', 
   (SELECT id FROM brands WHERE slug = 'herman-miller'), 
   'office-chair', 2500000, '세계에서 가장 유명한 오피스 체어', '/herman-miller-aeron.png'),
  ('Steelcase Gesture Chair', 'steelcase-gesture-chair',
   (SELECT id FROM brands WHERE slug = 'steelcase'),
   'office-chair', 2200000, '인체공학적 설계의 프리미엄 체어', '/steelcase-gesture-chair.jpg');
```

## 7. 프로젝트 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 8. 배포 시 환경변수 설정

### Vercel 배포 시:
1. Vercel 대시보드 → Project Settings → Environment Variables
2. 다음 변수들을 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 다른 플랫폼 배포 시:
해당 플랫폼의 환경변수 설정 방법에 따라 동일한 변수들을 설정하세요.

## 문제 해결

### 자주 발생하는 문제:

1. **RLS 정책 오류**: 모든 테이블에 RLS가 활성화되어 있으므로 적절한 정책이 설정되어 있는지 확인
2. **스토리지 권한 오류**: 버킷이 공개로 설정되어 있고 정책이 올바른지 확인
3. **인증 오류**: 환경변수가 올바르게 설정되어 있는지 확인

### 로그 확인:
- Supabase 대시보드 → Logs에서 에러 로그 확인
- 브라우저 개발자 도구 → Console에서 클라이언트 에러 확인
