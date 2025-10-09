# Admin 계정 설정 가이드

## 문제 상황
로컬 환경에서 admin 로그인 시 401 Unauthorized 에러가 발생하는 경우

## 해결 방법

### 방법 1: Supabase 대시보드에서 비밀번호 리셋 (추천)

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택: `nejjxccatspqlkujxlnd`

2. **Authentication 메뉴로 이동**
   - 왼쪽 사이드바에서 `Authentication` 클릭
   - `Users` 탭 클릭

3. **hello@chairpark.com 계정 찾기**
   - Users 목록에서 `hello@chairpark.com` 검색
   - 계정이 없으면 **방법 2**로 진행

4. **비밀번호 리셋**
   - 해당 계정의 `...` 메뉴 클릭
   - `Send password recovery` 선택
   - 또는 `Reset password` 선택
   - 새 비밀번호를 `chairpark123!`로 설정

5. **이메일 확인 상태 체크**
   - 계정의 `Email Confirmed` 컬럼이 체크되어 있는지 확인
   - 체크되어 있지 않으면 수동으로 확인 처리

### 방법 2: 새 Admin 계정 생성

1. **Supabase 대시보드에서 계정 생성**
   - Authentication > Users 페이지로 이동
   - `Add user` 또는 `Create new user` 버튼 클릭
   - Email: `hello@chairpark.com`
   - Password: `chairpark123!`
   - `Auto Confirm User` 체크박스 선택 (중요!)
   - `Create user` 클릭

2. **SQL Editor에서 Admin 권한 부여**
   - 왼쪽 사이드바에서 `SQL Editor` 클릭
   - `New query` 클릭
   - 아래 SQL을 붙여넣고 실행:

```sql
-- Admin 권한 부여
INSERT INTO public.user_roles (user_id, role, email)
SELECT 
  id,
  'admin',
  'hello@chairpark.com'
FROM auth.users
WHERE email = 'hello@chairpark.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- 결과 확인
SELECT 
  ur.user_id,
  ur.email,
  ur.role,
  au.email_confirmed_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.email = 'hello@chairpark.com';
```

3. **로그인 테스트**
   - http://localhost:3000/admin/login 접속
   - Email: `hello@chairpark.com`
   - Password: `chairpark123!`
   - Login 클릭

### 방법 3: SQL로 비밀번호 직접 업데이트

1. **SQL Editor 접속**
   - Supabase 대시보드 > SQL Editor

2. **스크립트 실행**
   - `scripts/999_reset_admin_passwords.sql` 파일의 내용을 복사
   - SQL Editor에 붙여넣기
   - `Run` 클릭

3. **로그인 테스트**
   - http://localhost:3000/admin/login 접속
   - Email: `hello@chairpark.com`
   - Password: `chairpark123!`

## 현재 설정된 Admin 계정

- **Email**: hello@chairpark.com
- **Password**: chairpark123!
- **Role**: admin

## 문제가 계속되는 경우

1. **브라우저 캐시 삭제**
   - Ctrl + Shift + Delete
   - 쿠키와 캐시 삭제

2. **개발 서버 재시작**
   ```bash
   # 터미널에서
   Ctrl + C (서버 중지)
   npm run dev (서버 재시작)
   ```

3. **환경 변수 확인**
   - `.env.local` 파일이 존재하는지 확인
   - Supabase URL과 ANON_KEY가 올바른지 확인

4. **Supabase 프로젝트 상태 확인**
   - Supabase 대시보드에서 프로젝트가 활성 상태인지 확인
   - API 제한이나 결제 문제가 없는지 확인

## 온라인 배포 환경

온라인에서는 작동하고 로컬에서만 문제가 있다면:

1. **Vercel 환경 변수 확인**
   - Vercel 대시보드에서 환경 변수가 올바르게 설정되어 있는지 확인

2. **온라인에서 사용한 계정 확인**
   - 온라인에서 로그인 성공한 이메일/비밀번호를 로컬에서도 동일하게 사용

3. **계정 동기화**
   - 온라인에서 비밀번호 변경 후 로컬에서도 같은 비밀번호 사용

