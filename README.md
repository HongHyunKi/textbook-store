# 히든카이스 스토어

Figma의 교재 목록 화면을 구현한 Next.js 과제입니다. Supabase의 더미 교재를 브라우저에서 조회하고, 교재명 검색·카테고리 필터·페이지 이동을 제공합니다.

- GitHub 공개 저장소 URL: TBD
- Vercel 배포 URL: TBD

기술 구성은 Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase JS, TanStack Query v5, Vitest입니다.

## 로컬 실행

Node.js 24와 pnpm을 사용합니다. 저장소를 clone한 폴더에서 실행합니다.

```bash
pnpm install
cp .env.example .env.local
```

아래 Supabase 설정을 마친 뒤 `.env.local`의 두 값을 채웁니다.

| 환경변수 | 값 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다. 브라우저에는 공개 조회용 키만 사용하며, DB 비밀번호나 관리자용 비밀키는 넣지 않습니다. `.env.local`은 커밋하지 않습니다.

`NEXT_PUBLIC_*` 값은 빌드 시 브라우저 번들에 고정됩니다. Vercel에서 값을 바꾸면 다시 배포하고, 로컬 개발 중 변경했다면 개발 서버를 재시작합니다. 환경변수가 없더라도 lint·단위 테스트·빌드는 가능하며, 실제 목록 조회 시에는 오류 안내가 표시됩니다.

## Supabase 설정

1. Supabase 프로젝트를 생성하고 프로젝트 URL과 publishable key를 확인합니다.
2. Supabase CLI로 프로젝트를 연결하고 마이그레이션과 seed를 적용합니다. 적용 이력은 원격 DB의 `supabase_migrations.schema_migrations`에 남습니다.

   ```bash
   pnpm dlx supabase login
   pnpm dlx supabase link --project-ref <프로젝트 ref>
   pnpm dlx supabase db push --include-seed
   ```

   - 스키마: [supabase/migrations/](supabase/migrations/) (`supabase migration new`로 생성)
   - 더미 데이터: [supabase/seed.sql](supabase/seed.sql)
3. `.env.local`에 두 값을 넣고 개발 서버를 시작합니다.

`products`의 컬럼은 `id`, `title`, `category`, `image_url`, `price`, `original_price`, `discount_rate`, `created_at`입니다. 카테고리는 `pass`(패스) 또는 `single`(단품)이며 화면 표기는 `CATEGORY_LABEL`에서 매핑합니다, 가격은 0 이상, 할인율은 null 또는 0~100입니다.

RLS를 활성화하고 `anon`, `authenticated`의 기존 테이블 권한을 회수한 뒤 SELECT 권한과 조회 정책 하나만 부여합니다. 브라우저에서 상품을 추가·수정·삭제할 수 없습니다.

마이그레이션은 테이블을 삭제하지 않으며 동일한 스키마에 재실행할 수 있습니다. 기존에 다른 컬럼으로 만든 테이블을 자동 변경하는 마이그레이션은 아닙니다. seed는 단품 18건과 패스 18건이며, 고정 ID 중복을 건너뛰므로 재실행해도 행이 늘지 않습니다. `created_at`은 1분 간격의 고정값이며 기본 조회 순서는 `created_at`, `id` 오름차순입니다. 할인 없는 패스도 1건 포함합니다.

연결 후 터미널에서 URL과 공개 키를 입력해 조회 및 쓰기 거부를 확인할 수 있습니다.

```bash
URL='프로젝트 URL'
KEY='프로젝트 publishable key'
curl -fsS "$URL/rest/v1/products?select=id&limit=1" -H "apikey: $KEY"
curl -sS -i "$URL/rest/v1/products" \
  -H "apikey: $KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"권한 확인","category":"single","image_url":"/products/single.png","price":1}'
```

첫 요청에는 상품이 반환되고 두 번째 요청은 응답 본문의 오류 코드 `42501`로 거부되어야 합니다. publishable key는 `apikey` 헤더로 전달합니다.

## 구현 기능

- 브라우저에서 Supabase 상품 조회, 로딩 스켈레톤 12개, 오류 안내와 다시 시도
- 등록 상품 0건과 필터 결과 0건을 구분한 안내
- 교재명 검색: 앞뒤 공백 및 영문 대소문자 무시, 검색어 지우기
- `전체 | 패스 | 단품` 카테고리 탭
- 페이지당 12개, 기본 데이터 36건으로 3페이지 구성, 검색어나 카테고리 변경 시 1페이지로 이동
- 상품 이미지·카테고리·상품명·가격 표시, 할인 시 원가 취소선과 할인율 표시
- 반응형 헤더·배너·상품 그리드·푸터, 입력 라벨·버튼 이름·이미지 대체 텍스트·현재 페이지 표시

## 디자인과 범위

Figma에는 가격 정렬 컨트롤 대신 카테고리 탭이 있습니다. 과제 원문의 “화면에 보이는 부분 위주”를 따라 가격 정렬은 제외하고 카테고리 탭을 구현했습니다.

배너는 제공된 첫 장과 `1/5` 표시를 재현합니다. 슬라이드 전환 컨트롤과 나머지 장면의 동작 명세가 없어 자동 전환은 구현하지 않았습니다. 메뉴 링크, 장바구니·알림·사용자 아이콘, 배너 CTA는 화면 표현만 제공하며 구매·로그인·다른 페이지로의 이동은 구현 범위에 없습니다.

Figma에는 1440px 데스크톱 프레임만 있고 모바일 프레임은 없습니다. Tailwind 기본 breakpoint를 기준으로 아래와 같이 정했습니다.

| 화면 폭 | 상품 그리드 | 헤더 |
| --- | --- | --- |
| 768px 미만, 검수 폭 375px | 2열 | 로고와 아이콘 |
| 768px 이상 (`md`) | 3열 | 전체 메뉴 |
| 1280px 이상 (`xl`) | 4열 | 전체 메뉴 |

배너는 Figma에서 문구·아이콘·CTA가 이미지에 포함된 한 장의 이미지라서 그대로 사용하고, 같은 문구를 스크린 리더용 텍스트(`sr-only`)로 함께 제공합니다. 모바일에서는 이미지가 비율대로 축소되어 문구가 작아지는 한계가 있습니다. 포인트 컬러는 보라 `#6D5DF5`, 주황 `#F26B1D` 근사값이며, 정확한 Figma 폰트·색상 정보는 확인할 수 없어 폰트는 `next/font/google`의 Noto Sans KR을 사용합니다. 최초 빌드 시 폰트 다운로드를 위한 네트워크 연결이 필요합니다.

Figma의 원가 76,000원·할인율 5%·판매가 64,800원은 계산상 일치하지 않습니다. 화면 값을 그대로 재현하기 위해 `original_price`, `discount_rate`, `price`를 각각 저장하고 UI에서 할인가를 계산하지 않습니다. 더미 데이터의 표시값이며 실제 판매 가격 규칙은 별도 정의가 필요합니다.

PRD의 공개 이미지 URL은 외부 절대 URL 대신 `public/`의 경로를 사용합니다. `/products/single.png`, `/products/pass.png`, `/banner/books.png`는 배포 후 같은 도메인에서 공개 접근할 수 있고, 외부 이미지 호스트 설정 없이 재현할 수 있습니다. 상품 이미지 값이 `/`로 시작하지 않으면 `/placeholder.svg`를 표시합니다. 과제 범위상 이미지는 `public/`에 두고 DB에는 경로만 저장했으며, 운영 시에는 Supabase Storage에 업로드하고 `image_url`에 Storage 경로를 저장해 배포 없이 이미지를 교체할 수 있게 합니다.

## 폴더 구조

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    providers.tsx
  components/
    Header.tsx
    Banner.tsx
    Footer.tsx
  features/products/
    types.ts
    api.ts
    utils.ts
    utils.test.ts
    ProductList.tsx
    ProductToolbar.tsx
    ProductCard.tsx
    Pagination.tsx
  lib/
    supabase.ts
public/
  products/
  banner/
  placeholder.svg
supabase/
  config.toml
  migrations/
  seed.sql
.github/workflows/
  ci.yml
  keepalive.yml
```

## 설계 결정

| 결정 | 이유와 영향 |
| --- | --- |
| 서버 페이지 안에 클라이언트 상품 목록 배치 | 정적 레이아웃은 App Router에서 구성하고, 상품 조회는 CSR 요구에 맞춰 브라우저에서 수행합니다. 서버에서는 상품을 조회하지 않습니다. |
| `fetchProducts()`와 상품 UI 분리 | Supabase 접근은 `api.ts`가 담당합니다. Supabase 응답의 오류를 throw해 React Query의 오류 상태로 전달합니다. |
| TanStack Query `useQuery`, 재시도 1회 | 직접 작성해야 할 로딩·오류·재시도·캐시 관리를 대체합니다. `useEffect` 기반 수동 fetch는 사용하지 않습니다. |
| `getSupabase()` 지연 생성 | 모듈을 불러올 때 클라이언트를 생성하지 않아 환경변수가 없는 빌드도 가능합니다. 실제 조회 시 누락된 설정을 오류로 알립니다. |
| 순수 함수 `selectProducts()`로 클라이언트 필터 | 더미 데이터 36건에 별도 서버 검색·debounce가 필요하지 않습니다. 검색과 카테고리 필터 후 `slice`로 페이지를 표시하며 원래 조회 순서를 유지합니다. |
| 기능 단위 폴더 | 타입·조회·순수 로직·상품 UI를 한곳에 모으고 공통 레이아웃과 분리해 변경 범위를 찾기 쉽게 합니다. |
| Tailwind v4와 Vitest | 기존 스타일 구성을 사용하고, 분기가 있는 필터 로직을 단위 테스트로 검증합니다. UI와 반응형 검증은 수동으로 수행합니다. |

## 검증

```bash
pnpm lint
pnpm test
pnpm build
```

단위 테스트는 검색 공백·대소문자 처리, 결과 0건, 카테고리 필터, 검색과 카테고리 조합, 입력 순서 유지의 5개 사례를 다룹니다. `pnpm build` 후 `pnpm start`로 프로덕션 모드를 확인할 수 있습니다.

배포 전 수동 확인 항목은 다음과 같습니다.

- Network 탭에서 브라우저의 `/rest/v1/products` 요청을 확인하고, 초기 HTML에 상품 데이터가 없는지 확인합니다.
- Slow 3G에서 로딩 표시, 요청 차단 시 오류와 재시도, 응답을 `[]`로 바꿨을 때 등록 상품 없음 안내를 확인합니다.
- 검색과 카테고리 조합, 결과 없음, 검색어 지우기, 페이지 이동과 필터 변경 후 1페이지 복귀를 확인합니다.
- 375px·768px·1280px와 실제 모바일 기기에서 열 수, 카드 잘림, 가로 스크롤을 확인합니다.
- 키보드로 컨트롤에 접근하고 콘솔 오류·hydration 경고, 잘못된 이미지 값의 대체 표시를 확인합니다.
- 배포 페이지를 하드 리로드하고 시크릿 창에서 두 제출 URL을 열어 봅니다. 공개 키의 조회 성공과 쓰기 거부를 다시 확인합니다.

## 배포와 자동 실행

GitHub 공개 저장소를 Vercel에 연결하고 Next.js 프로젝트로 배포합니다. Node.js 버전은 CI와 같은 24를 사용하며, 앞서 설명한 두 `NEXT_PUBLIC_*` 환경변수를 Vercel의 Production과 Preview 모두에 등록합니다. 환경변수를 변경한 뒤에는 재배포합니다. 배포가 끝나면 상단의 두 `TBD`를 실제 URL로 교체합니다.

[ci.yml](.github/workflows/ci.yml)은 push와 pull request마다 Node.js 24에서 `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm test` → `pnpm build`를 실행합니다. Supabase 환경변수나 secrets를 주입하지 않습니다.

[keepalive.yml](.github/workflows/keepalive.yml)은 매일 03:17 UTC(12:17 KST)에 상품 ID 한 건을 조회합니다. GitHub 저장소의 Settings → Secrets and variables → Actions에 다음 repository secrets를 등록합니다.

| Secret | 값 |
| --- | --- |
| `SUPABASE_URL` | 앱에서 사용하는 Supabase 프로젝트 URL, 끝 `/` 제외 |
| `SUPABASE_PUBLISHABLE_KEY` | 앱에서 사용하는 publishable key |

워크플로를 기본 브랜치에 올린 뒤 Actions → Supabase keepalive → Run workflow로 수동 실행을 확인합니다. 실행 결과는 Actions에서 확인합니다. 무료 프로젝트는 7일 동안 활동이 적으면 일시정지될 수 있어 주기적 조회를 추가했으며, 이미 중지된 프로젝트는 대시보드에서 복구해야 합니다. 이 요청이 가용성을 보장하지는 않습니다. [Supabase 운영 안내](https://supabase.com/docs/guides/deployment/going-into-prod)

## 한계와 확장 방향

전체 상품을 한 번에 가져오므로 수천 건 이상의 목록에는 적합하지 않습니다. 데이터가 늘면 Supabase의 서버 검색과 `range` 페이지네이션으로 전환하고 검색 조건을 query key에 포함할 수 있습니다.

이미지는 저장소의 에셋과 연결되어 있어 상품별 이미지 관리가 필요해지면 Supabase Storage와 `next/image`의 `remotePatterns` 설정을 도입할 수 있습니다. 현재 경로 검사는 이미지 파일의 실제 존재까지 확인하지 않습니다. 인증·주문·결제·관리자 기능과 배너 전환은 이번 과제 범위에 포함하지 않았습니다.
