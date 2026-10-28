# TODOS

## Auth

### 비밀번호 찾기 Supabase 연동

**What:** `/forgot-password`와 `/reset-password` 샘플 UI에 실제 Supabase 연동을 붙인다.

**Why:** 지금은 두 페이지 모두 1초 대기 후 성공 화면을 보여주는 UI 샘플이라 실제로 메일이 가거나 비밀번호가 바뀌지 않는다.

**Context:** 설계와 리뷰 결정은 docs/designs/password-reset.md에 있다(Implementation Tasks T1~T6). UI에 이미 반영된 것: "다른 이메일로 다시 받기" 버튼(D10), 저장 중 버튼 잠금(D3), 비밀번호 확인 불일치 문구. 남은 것: `resetPasswordForEmail` + `isResetRequestAccepted`(D5), 전용 메모리 클라이언트 `createIsolatedSupabase()`(D6), checking/invalid 상태와 `isRecoveryLink`(D2, D4, D9), `updateUser` 오류 문구, 완료 후 `signOut`. 각 페이지의 TODO 주석이 연동 자리다. 시작 전에 대시보드 Redirect URLs 등록이 필요하다.

**Effort:** M
**Priority:** P2
**Depends on:** Supabase 대시보드 Redirect URLs 설정

### 커스텀 SMTP 연결

**What:** Supabase Dashboard → Authentication → SMTP Settings에 커스텀 SMTP(Resend, SendGrid 등)를 연결한다.

**Why:** 기본 SMTP는 Supabase 조직 팀원 이메일로만 발송하고 시간당 발송량도 적다. 외부 사용자나 과제 검토자는 "메일을 확인해 주세요" 화면만 보고 메일을 받지 못한다.

**Context:** 비밀번호 찾기(`/forgot-password` → `/reset-password`)는 기본 SMTP 전제로 구현했다(docs/designs/password-reset.md 전제 4). 코드 변경 없이 대시보드 설정과 발신 도메인 인증만 필요하다. 연결 후 팀원이 아닌 이메일로 재설정 메일 수신을 확인한다.

**Effort:** S
**Priority:** P2
**Depends on:** 외부 시연 일정

### 로그인 추가 시 auth 코드를 features/auth로 이동

**What:** 로그인 기능을 추가할 때 `src/app/(auth)/*`의 Supabase auth 호출과 판정 헬퍼(`recovery.ts`, `request-result.ts`)를 `features/auth`로 모은다.

**Why:** 지금은 호출처가 적어 페이지에 직접 두었다(docs/designs/password-reset.md Approach A). 로그인이 생기면 README의 feature-based 규칙대로 모아야 auth 코드가 흩어지지 않는다.

**Context:** 이동할 때 보류한 결정 D8도 정한다. 비밀번호 저장 성공 후 `signOut()`이 인자 없이 SDK 기본 global로 동작 중이며, global(탈취 세션 폐기)과 local(다른 기기 로그인 유지) 중 무엇을 명시할지 미결정이다(docs/designs/password-reset.md R8).

**Effort:** M
**Priority:** P3
**Depends on:** 로그인 기능

## Completed
