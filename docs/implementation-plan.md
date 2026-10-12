# 구현 계획과 진행 상황

- 기준 문서: [PRD.md](PRD.md), [figma-notes.md](figma-notes.md)
- 마감: 2026-10-14(수) 17:00 KST
- 최종 갱신: 2026-10-13

## 진행 상황

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 0. Figma 확인 | 과제 원문, 화면 구성, 에셋 export | 완료 |
| 1. 골격 | Next.js 16 + Tailwind v4 + React Query + Vitest, pnpm | 완료 |
| 2. 목록 UI와 CSR 조회 | 헤더, 배너, 카드, 로딩·오류·빈 상태 | 완료 |
| 3. 반응형·접근성 | 2/3/4열, 라벨·포커스·대체 텍스트 | 완료 |
| 4. 검색·카테고리·페이지네이션 | `selectProducts` + 테스트 5개 | 완료 |
| 5. Supabase | 마이그레이션·seed를 CLI로 원격 적용 | 완료 |
| 6. 운영 보완 | CI, keepalive 워크플로, README | 완료 |
| 7. 배포·제출 | GitHub 공개, Vercel 연결, URL 제출 | 진행 중 |

### 남은 작업

- [ ] GitHub 저장소를 Public으로 전환
- [ ] Vercel 연결, 환경변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 등록
- [ ] GitHub Actions secrets `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` 등록, keepalive 수동 실행 확인
- [ ] README의 `TBD` URL 2개 교체
- [ ] 배포 URL 최종 점검(하드 리로드, Network의 products 요청, 콘솔 오류 0건, 쓰기 거부 `42501`, 시크릿 창)
- [ ] 두 URL을 메일로 회신

## 계획 대비 변경

| 처음 계획 | 변경 | 이유 |
| --- | --- | --- |
| 가격 정렬 | 카테고리 탭(전체·패스·단품) | Figma에 정렬이 없고 카테고리 탭이 있음. 원문 "화면에 보이는 부분 위주" |
| `supabase/schema.sql`을 SQL Editor에서 실행 | `supabase/migrations/` + `supabase db push --include-seed` | 스키마 변경 이력을 저장소와 원격 DB에 남기기 위해 |
| 카테고리 값 `'패스'`, `'단품'` | `'pass'`, `'single'` + `CATEGORY_LABEL` | DB에는 코드값, 화면 표기는 UI에서 매핑 |
| npm | pnpm (`packageManager` 고정) | 사용자 선택 |
| Pretendard | Noto Sans KR (`next/font/google`) | 폰트 파일을 저장소에 두지 않음. 정확한 Figma 폰트명은 확인 불가 |
| 배너 HTML 재구성 | export 이미지 + `sr-only` 문구 | 배너 이미지에 문구가 포함되어 있어 중복 표시를 피함 |
| `placeholder.webp` | `placeholder.svg` | 별도 이미지 파일 없이 SVG 한 개로 대체 |

## 검증 기록

- `pnpm lint`, `pnpm test`(5개), `pnpm build` 통과. 빌드는 환경변수 없이도 성공
- 브라우저: 오류와 재시도, 빈 상태, 검색 공백 처리, 카테고리 필터, 필터 변경 시 1페이지 복귀, 375·768·1280px 열 수와 가로 스크롤 없음
- 마이그레이션: Postgres 17 컨테이너에서 마이그레이션·seed 2회 재실행 무오류, `anon` 조회 36건, insert·update·delete 거부, check 제약 위반 거부
- 원격 Supabase: 조회 36건(`pass` 18, `single` 18), POST·PATCH·DELETE `42501`, 마이그레이션 이력 로컬·원격 일치
- 리뷰: architect, security-reviewer, code-reviewer 승인. 반영한 수정은 `isLoadingError` 사용, `//` 이미지 경로 차단, 색 토큰, 포커스 링 통일, 검색 지우기 후 포커스 복귀, 결과 없음에서 카테고리까지 초기화 등

## ADR

- **Decision**: App Router 서버 페이지 안에 클라이언트 컴포넌트 `ProductList`를 두고, `features/products/api.ts`의 `fetchProducts()`를 React Query `useQuery`(`retry: 1`)로 브라우저에서 호출한다. 검색과 카테고리 필터는 순수 함수 `selectProducts`로 처리하고 `slice`로 페이지를 나눈다. Supabase는 RLS + `revoke all` + `grant select` + SELECT 정책 하나로 읽기만 허용하고, 브라우저에는 publishable key만 둔다. 스키마는 CLI 마이그레이션으로 관리한다.
- **Drivers**: 마감 안정성, CSR 요구 충족, 면접에서 설명하기 쉬운 구조.
- **Alternatives considered**: `useEffect` 직접 fetch(상태·경합·재시도를 손으로 작성해야 함), Server Component fetch(CSR 요구 위반), Supabase 서버 검색과 `range` 페이지네이션(36건에는 과함), SQL Editor 직접 실행(이력이 남지 않음).
- **Consequences**: 전체 데이터를 한 번에 받으므로 수천 건 이상에는 부적합하다. 이미지는 `public/`에 있어 교체하려면 재배포가 필요하다.
- **Follow-ups**: 데이터가 늘면 서버 검색(`ilike`)과 `range` 페이지네이션으로 전환하고 검색 조건을 query key에 넣는다. 이미지 관리가 필요하면 Supabase Storage와 `remotePatterns`를 도입한다.
