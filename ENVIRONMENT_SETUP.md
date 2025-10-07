# 환경 변수 설정 가이드

## Supabase 환경 변수 설정

### 1. Supabase 프로젝트에서 환경 변수 가져오기

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. 다음 값들을 복사:

```env
# .env.local 파일에 추가
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Vercel 환경 변수 설정

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 메뉴로 이동
4. 다음 환경 변수들을 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Production, Preview, Development |

### 3. Storage 버킷 설정

Supabase 대시보드에서:

1. **Storage** 메뉴로 이동
2. **Create a new bucket** 클릭
3. 버킷 이름: `images`
4. Public bucket: ✅ 체크
5. File size limit: `5MB`
6. Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp`

또는 SQL Editor에서 `scripts/027_setup_storage_bucket.sql` 실행

### 4. 환경 변수 확인

개발 서버 실행 후 브라우저 콘솔에서 다음 로그 확인:
```
=== Supabase Environment Check ===
Valid: true
Has URL: true
Has Service Key: true
Has Anon Key: true
=================================
```

### 5. 문제 해결

#### "서버 설정 오류가 발생했습니다" 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Vercel에서 환경 변수가 배포에 포함되었는지 확인
- Supabase 프로젝트가 활성 상태인지 확인

#### 이미지 업로드 실패
- Storage 버킷이 생성되었는지 확인
- RLS 정책이 올바르게 설정되었는지 확인
- 파일 크기가 5MB 이하인지 확인
- 지원되는 이미지 형식인지 확인 (JPEG, PNG, GIF, WebP)

### 6. 로컬 개발 환경

`.env.local` 파일 생성:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 7. 보안 주의사항

- `SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용
- 클라이언트에서는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`만 사용
- 환경 변수를 Git에 커밋하지 않도록 주의
