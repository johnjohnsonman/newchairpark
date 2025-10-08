# Supabase 키 확인 방법

## 1. Supabase Dashboard에서 올바른 키 확인

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. `newchairpark` 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. 다음 키들을 복사:

### Project URL
```
NEXT_PUBLIC_SUPABASE_URL = https://[your-project-ref].supabase.co
```

### anon public key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### service_role secret key
```
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2. 키 형식 확인

### ✅ 올바른 형식:
- **URL**: `https://[random-string].supabase.co`
- **anon key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iltwcm9qZWN0LXJlZl0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODk2MDAwMCwiZXhwIjoyMDE0NTM2MDAwfQ.[signature]`
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iltwcm9qZWN0LXJlZl0iLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk4OTYwMDAwLCJleHAiOjIwMTQ1MzYwMDB9.[signature]`

## 3. 자주 발생하는 문제들

### ❌ 잘못된 URL 형식:
- `https://supabase.com/project/[id]` (잘못됨)
- `https://[project-name].supabase.co` (잘못됨)

### ❌ 잘못된 키 형식:
- 키가 중간에 잘린 경우
- 공백이나 줄바꿈이 포함된 경우
- 다른 프로젝트의 키를 사용한 경우

## 4. 확인 방법

각 키를 복사한 후 다음 사이트에서 디코딩하여 확인:
- https://jwt.io
- `payload` 섹션에서 `ref` 값이 프로젝트 ID와 일치하는지 확인
