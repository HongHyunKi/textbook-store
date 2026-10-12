# textbook-store

Figma 시안 기반 교재 목록 페이지 · Supabase 데이터 CSR 조회

| 항목   | 링크                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------- |
| 배포   | TBD                                                                                               |
| 저장소 | TBD                                                                                               |
| 문서   | [PRD](docs/PRD.md) · [Figma 분석](docs/figma-notes.md) · [구현 계획](docs/implementation-plan.md) |

## 기술 스택

| 영역       | 사용 기술                                          |
| ---------- | -------------------------------------------------- |
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript      |
| 스타일     | Tailwind CSS v4 (`@theme` 디자인 토큰), Pretendard |
| 데이터     | Supabase (PostgreSQL, RLS), TanStack Query v5      |
| 품질·CI    | Prettier, ESLint, Vitest, GitHub Actions           |
| 배포       | Vercel                                             |

## 주요 기능

- 교재 목록 CSR 조회, 로딩 스켈레톤·오류 재시도·빈 상태 처리
- 교재명 검색 (공백·대소문자 무시)
- 카테고리 탭 (전체 · 패스 · 단품)
- 페이지네이션 (페이지당 12개, 필터 변경 시 1페이지로 이동)
- 할인 상품의 원가·할인율·판매가 표시
- 반응형 그리드 (모바일 2열 · 태블릿 3열 · 데스크톱 4열)
- 키보드 조작, 입력 라벨, 이미지 대체 텍스트 등 기본 접근성

## 폴더 구조

```text
src/
├── app/                        # 라우팅·페이지 조합, 전역 Provider
├── features/
│   └── products/               # 상품 목록 기능
│       ├── components/         #   ProductList, ProductToolbar, ProductCard
│       ├── api.ts              #   Supabase 조회
│       ├── types.ts            #   도메인 타입
│       ├── utils.ts            #   검색·필터 순수 함수 (+ 테스트)
│       └── index.ts            #   외부 공개 진입점
└── shared/                     # 도메인과 무관한 공통 코드
    ├── components/
    │   ├── layout/             #   Header, Banner, Footer
    │   └── ui/                 #   Pagination
    └── lib/
        └── supabase.ts         #   Supabase 클라이언트
supabase/
├── migrations/                 # 스키마·RLS 마이그레이션
└── seed.sql                    # 더미 데이터 36건
```

### Feature-based를 선택한 이유

- **응집도**: 기능에 필요한 타입·API·로직·UI가 한 폴더에 모여 구조 파악과 수정이 빠름
- **변경 범위 예측**: 기능 단위로 수정·삭제·리팩터링해도 영향 범위가 해당 폴더로 한정
- **FSD로 전환 용이**: 도메인 단위로 이미 나뉘어 있어 계층 구조로 옮기기 쉬움

### 구조 규칙

ESLint `no-restricted-imports`로 강제

- **단방향 의존**: `app → features → shared` 방향으로만 import
- **feature 간 참조 금지**: 여러 feature가 쓰는 코드는 `shared`로 이동
- **공개 진입점**: feature 외부에서는 `index.ts`로만 import, 내부 구현은 숨김
- **shared는 도메인 무관**: 특정 feature의 개념을 포함하지 않음

### 확장 방식

- **새 기능**: `features/cart`처럼 같은 구조의 폴더를 추가하고 `app/` 라우트에서 조합. 기존 기능 코드 변경 없음
- **도메인 공유**: 여러 feature가 상품을 함께 쓰면 `types`·`api`·`ProductCard`를 `entities/product`로 분리해 FSD 계층으로 확장
- **데이터 증가**: 서버 검색(`ilike`)·`range` 페이지네이션으로 전환 시 변경 범위는 `api.ts`·`utils.ts`

## 설계 결정

| 결정                                   | 이유                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| 서버 페이지 + 클라이언트 목록 컴포넌트 | 정적 레이아웃은 서버에서 렌더링하고, 상품 조회만 브라우저에서 수행해 CSR 요구사항을 충족 |
| TanStack Query                         | 로딩·오류·재시도·캐시 상태를 직접 구현하지 않고 선언적으로 처리                          |
| 클라이언트 필터링                      | 데이터 36건 규모에서 요청 1회로 검색·필터·페이지네이션을 처리하고, 순수 함수로 테스트    |
| 카테고리 코드값 (`pass`, `single`)     | DB에는 코드값을 저장하고 화면 표기는 `CATEGORY_LABEL`에서 매핑                           |
| 할인가 비계산                          | Figma 수치(76,000원 · 5% · 64,800원)를 그대로 재현하도록 원가·할인율·판매가를 각각 저장  |
| 이미지 `public/` 경로 저장             | 과제 범위에서 별도 스토리지 없이 재현 가능. 운영 시 Supabase Storage로 전환              |
| Supabase 클라이언트 지연 생성          | 환경변수 없이도 lint·test·build가 가능                                                   |

## 디자인 시스템

Figma 디자인 사양을 [`globals.css`](src/app/globals.css)의 `@theme` 토큰으로 정의하고, 컴포넌트에서는 토큰 클래스만 사용

| 분류          | 토큰                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| 타이포그래피  | `text-body-lg` · `text-body` · `text-body-sm` · `text-body-sm-strong` · `text-caption` (크기·행간·굵기 포함) |
| 색상          | `primary`, `text-primary/dark/secondary/muted`, `border-default/secondary/banner`, `discount` 등 16종        |
| 모서리·그림자 | `rounded-base`(6px), `rounded-pill`(999px), `shadow-base`                                                    |
| 폰트          | Pretendard Variable, 자체 호스팅 동적 서브셋 (사용 글자 범위만 로드)                                         |

상세 값: [Figma 분석 · 디자인 사양](docs/figma-notes.md#디자인-사양-2026-10-13-수령)

## 데이터베이스

`products` 테이블 · 스키마와 권한은 [마이그레이션](supabase/migrations/)으로 관리

| 컬럼             | 타입        | 설명                      |
| ---------------- | ----------- | ------------------------- |
| `id`             | uuid        | 기본 키                   |
| `title`          | text        | 교재명                    |
| `category`       | text        | `pass` 또는 `single`      |
| `image_url`      | text        | 이미지 경로               |
| `price`          | integer     | 판매가                    |
| `original_price` | integer     | 원가 (할인 시)            |
| `discount_rate`  | integer     | 할인율 0~100 (할인 시)    |
| `created_at`     | timestamptz | 생성 시각, 기본 정렬 기준 |

- **RLS**: `anon`·`authenticated`에 SELECT만 허용, 쓰기 요청은 `42501`로 거부
- **키**: 브라우저에는 publishable key만 노출

## 실행 방법

요구 사항: Node.js 24, pnpm

```bash
pnpm install
cp .env.example .env.local   # 환경변수 입력
pnpm dev                     # http://localhost:3000
```

| 환경변수                               | 설명                     |
| -------------------------------------- | ------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase 프로젝트 URL    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

### Supabase 설정

```bash
pnpm dlx supabase login
pnpm dlx supabase link --project-ref <프로젝트 ref>
pnpm dlx supabase db push --include-seed   # 마이그레이션 + 더미 데이터 적용
```

### 검증

```bash
pnpm format:check   # Prettier (수정: pnpm format)
pnpm lint
pnpm test    # 검색·카테고리 필터 단위 테스트 5개
pnpm build
```

## CI / 운영

| 워크플로                                         | 내용                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [ci.yml](.github/workflows/ci.yml)               | push·PR마다 format check → lint → test → build                                                                                        |
| [keepalive.yml](.github/workflows/keepalive.yml) | 매일 1회 상품을 조회해 Supabase 무료 플랜의 비활성 일시정지를 방지. Actions secrets에 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` 필요 |

## 구현 범위

과제 지침 "화면에 보이는 부분 위주" 기준

- **카테고리 탭**: Figma에 표시된 전체 · 패스 · 단품 탭 구현 (가격 정렬 없음)
- **배너**: 첫 장과 `1/5` 표시 재현, 슬라이드 전환 제외
- **반응형**: Figma 데스크톱(1440px) 프레임 기준, `md`(768px) · `xl`(1280px) breakpoint
- **제외**: 로그인 · 장바구니 · 주문 · 결제, 메뉴 · 아이콘 · CTA 이동
