# GLIT Frontend

> 하루 5분 커리어 기록 서비스 **GLIT**의 프론트엔드 레포지토리입니다. <br />
> 소셜 로그인 → 온보딩 → 스크럼·STAR 기록 → 캘린더 → AI 역량 리포트로 이어지는 사용자 경험을 제공합니다.

<img width="1920" height="1080" alt="cover" src="https://github.com/user-attachments/assets/2dcccdd4-68e3-44b2-a36d-ecf836cf1018" />

## 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [아키텍처 & 디렉토리 구조](#-아키텍처--디렉토리-구조)
- [핵심 설계 포인트](#-핵심-설계-포인트)
- [CI/CD](#-cicd)
- [로컬 실행](#-로컬-실행)
- [협업 가이드](#-협업-가이드)

## ✨ 주요 기능

### 🔐 로그인 / 온보딩

<!-- TODO: 이미지 -->

- 카카오·구글·네이버 소셜 로그인
- 직무·관심 역량 설정 온보딩 플로우

### 📝 기록

<!-- TODO: 이미지 -->

- **오늘의 할 일** — 데일리 스크럼 기반 업무 기록
- **심화 기록 / STAR 기록** — 경험을 구조화된 형식으로 상세 기록
- **역량 선택 & AI 태깅** — 기록에서 역량을 직접 선택하거나 AI가 자동 태깅

### 📅 캘린더

<!-- TODO: 이미지 -->

- 월별 잔디 형태로 기록 현황 시각화
- 날짜별 기록 상세 조회

### 📊 리포트

<!-- TODO: 이미지 -->

- **미니 리포트** — 기록 기반 간단 역량 요약
- **커리어 리포트** — AI가 분석한 역량 레이더 차트 및 성장 리포트
- 리포트 생성 및 결과 조회

### 👤 마이페이지

<!-- TODO: 이미지 -->

- 프로필 편집
- 푸시 알림 시간 설정

## 🖥 기술 스택


| Category | Stack |
| -------- | ----- |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **Framework** | ![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![clsx](https://img.shields.io/badge/clsx-F7DF1E?style=for-the-badge&logoColor=black) ![tailwind-merge](https://img.shields.io/badge/tailwind--merge-06B6D4?style=for-the-badge&logoColor=white) |
| **UI Components** | ![Swiper](https://img.shields.io/badge/Swiper-6332F6?style=for-the-badge&logo=swiper&logoColor=white) ![Lottie](https://img.shields.io/badge/lottie--react-00DDB3?style=for-the-badge&logo=lottiefiles&logoColor=black) ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logoColor=white) ![React DayPicker](https://img.shields.io/badge/React_DayPicker-61DAFB?style=for-the-badge&logoColor=black) |
| **State Management** | ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logoColor=white) |
| **Data Fetching / Caching** | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white) ![ky](https://img.shields.io/badge/ky-F7DF1E?style=for-the-badge&logoColor=black) |
| **Compiler Optimization** | ![React Compiler](https://img.shields.io/badge/React_Compiler-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| **Infrastructure / Auth** | ![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white) |
| **Code Quality / Linting** | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![eslint-config-next](https://img.shields.io/badge/eslint--config--next-000000?style=for-the-badge&logo=next.js&logoColor=white) ![simple-import-sort](https://img.shields.io/badge/simple--import--sort-4B32C3?style=for-the-badge&logoColor=white) |
| **Code Formatting** | ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black) ![prettier-plugin-tailwindcss](https://img.shields.io/badge/prettier--plugin--tailwindcss-06B6D4?style=for-the-badge&logoColor=white) |
| **Git Hooks / Automation** | ![Husky](https://img.shields.io/badge/Husky-000000?style=for-the-badge&logoColor=white) ![lint-staged](https://img.shields.io/badge/lint--staged-F05032?style=for-the-badge&logoColor=white) |
| **Unit Testing** | ![Vitest](https://img.shields.io/badge/Vitest-00FF74?style=for-the-badge&logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white) ![jsdom](https://img.shields.io/badge/jsdom-F7DF1E?style=for-the-badge&logoColor=black) |
| **E2E Testing** | ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white) |
| **Visual Testing** | ![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white) ![Chromatic](https://img.shields.io/badge/Chromatic-FC521F?style=for-the-badge&logo=chromatic&logoColor=white) |
| **Package Manager** | ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white) |


## 🏗 아키텍처 & 디렉토리 구조

Next.js **App Router** 기반의 페이지 구성을 따르며, **UI 컴포넌트(components)와 페이지 비즈니스 로직(containers)을 분리**해 관심사를 명확히 나눴습니다.

```
src/
├── app/                        # Next.js App Router (라우트·레이아웃·메타데이터)
│   ├── auth/                   # 소셜 로그인 페이지
│   │   └── callback/           # OAuth 콜백 처리
│   ├── onboarding/             # 온보딩 플로우
│   │   ├── (main)/             # 온보딩 메인 스텝
│   │   └── guide/              # 서비스 가이드
│   ├── record/                 # 기록 홈
│   │   ├── today-task/         # 오늘의 할 일 (스크럼)
│   │   ├── deep-log/           # 심화 기록
│   │   ├── star-log/           # STAR 기록
│   │   ├── select-skills/      # 역량 선택
│   │   └── skill-tagging/      # AI 역량 태깅
│   ├── calendar/               # 캘린더(잔디) 조회
│   │   └── [date]/             # 날짜별 기록 상세
│   ├── report/                 # 리포트 홈
│   │   ├── create/             # 리포트 생성
│   │   ├── generate/           # 리포트 생성 중
│   │   ├── career/             # 커리어 리포트 상세
│   │   └── mini/               # 미니 리포트
│   ├── my/                     # 마이페이지
│   │   ├── profile/            # 프로필 편집
│   │   ├── alarm/              # 알림 설정
│   │   └── guide/              # 이용 가이드
│   ├── manifest.ts             # PWA 매니페스트
│   └── layout.tsx / globals.css / not-found.tsx
├── components/                 # 재사용 가능한 순수 UI 컴포넌트
├── containers/                 # 페이지별 비즈니스 로직 컨테이너 (데이터 페칭·상태 연결)
├── store/                      # Zustand 전역 클라이언트 상태 슬라이스
├── lib/                        # API 클라이언트·유틸 함수·훅
├── providers/                  # TanStack Query·Firebase 등 Provider 모음
├── types/                      # 전역 TypeScript 타입 정의
├── constants/                  # 라우트·코드 등 상수
├── assets/                     # SVG 아이콘·이미지
├── font/                       # 로컬 폰트 파일
├── data/                       # 정적 목업·seed 데이터
├── stories/                    # Storybook stories
├── __test__/unit/              # Vitest 단위 테스트
└── proxy.ts                    # Next.js Route Handler 기반 API 프록시 설정
```

## ⚡ 핵심 설계 포인트

**상태 관리**

- **레이어 분리** — TanStack Query(서버 데이터 캐싱·동기화) / Zustand(UI 전역 상태) / React useState(로컬 UI)로 역할을 명확히 나눠 불필요한 리렌더링 억제
- **쿼리 캐시 persist** — `@tanstack/react-query-persist-client`로 캐시를 localStorage에 직렬화, 재방문 시 API 재요청 없이 즉시 렌더링

**API 통신**

- **서버** — RSC에서 Next.js 네이티브 `fetch`로 직접 API 호출. `server-only` 패키지로 서버 전용 모듈의 클라이언트 유출을 컴파일 타임에 차단
- **클라이언트** — `ky` 기반 HTTP 클라이언트로 인터셉터·재시도·타임아웃 처리. `proxy.ts`(Next.js Route Handler)를 중간 계층으로 두어 API Base URL·인증 헤더를 클라이언트에 노출하지 않고 CORS 정책을 서버 사이드에서 일괄 처리

**성능 최적화**

- **React Compiler** 활성화 — 컴파일 타임 자동 메모이제이션으로 `useMemo`·`useCallback` 수동 작성 부담 제거
- **RSC 우선 원칙** — 데이터 페칭·정적 렌더링은 Server Component로 처리해 클라이언트 번들 절감
- **이미지 최적화** — Next.js `<Image>` + `qualities: [75, 95]` 설정으로 WebP 자동 변환·크기 최적화
- **SVG 최적화** — 아이콘은 svgr로 React 컴포넌트화해 currentColor 동적 색상 적용 및 트리쉐이킹, 경로별 Turbopack 로더 규칙으로 번들 분리

**코드 품질**

- **ESLint zero-warning CI 게이트** — PR마다 `lint:ci`(`--max-warnings 0`) 강제, `simple-import-sort`로 import 순서 자동 정렬
- **Husky + lint-staged** — 커밋 시 변경 파일에만 ESLint·Prettier를 적용해 빠른 피드백 유지
- **Prettier + prettier-plugin-tailwindcss** — Tailwind 클래스 자동 정렬로 코드 리뷰 노이즈 제거

## ☁️ CI/CD

> **PR 생성 → Lint·Format + 단위·E2E 테스트 → Vercel Preview 자동 배포 → PR 코멘트로 URL 공유**
> **Push to `dev` → Vercel 프로덕션 배포 ([glit.today](https://glit.today))**

| 워크플로      | 트리거       | 주요 작업                                                                                |
| ------------- | ------------ | ---------------------------------------------------------------------------------------- |
| `test.yml`    | PR → `dev`   | Vitest 단위 + Playwright E2E (Chromium·WebKit), 결과 Discord 알림                        |
| `preview.yml` | PR → `dev`   | ESLint zero-warning + Prettier 검사 → Vercel Preview 빌드·배포 → PR 코멘트 URL 자동 게시 |
| `deploy.yml`  | Push → `dev` | Vercel 프로덕션 빌드 & 배포                                                              |

- **환경 변수**: Vercel 프로젝트 환경 변수로 관리 — 이미지·레포에 평문 미탑재

## 💻 로컬 실행

요구사항: **Node.js 20**, **pnpm 10**

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local에 아래 값 입력

# 3. 개발 서버 실행
pnpm dev
# → http://localhost:3000
```

### 주요 명령어

```bash
pnpm test:unit          # Vitest 단위 테스트
pnpm test:e2e:run       # Playwright E2E 테스트
pnpm lint:ci            # ESLint zero-warning (CI용)
pnpm format:check       # Prettier 검사 (CI용)
pnpm storybook          # 로컬 Storybook 서버 (http://localhost:6006)
```

### 환경 변수 (`.env.example` 참고)

| 변수                       | 설명                                   |
| -------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API 서버 URL                    |
| `NEXT_PUBLIC_FIREBASE_*`   | Firebase 프로젝트 설정 (FCM 푸시 알림) |
| `NEXT_PUBLIC_GA_ID`        | Google Analytics 측정 ID               |

## 🤝 협업 가이드

브랜치 전략·커밋 컨벤션·PR 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고해 주세요.

## 🧑🏻‍💻 팀원

| <img src="https://github.com/yewon20804.png" width="200" height="200"/> | <img src="https://github.com/waldls.png" width="200" height="200"/> | <img src="https://github.com/seyun31.png" width="200" height="200"/> |
| :---------------------------------------------------------------: | :-----------------------------------------------------------------: | :---------------------------------------------------------------: |
| 김예원 <br/> [@yewon20804](https://github.com/yewon20804) | 박유민 <br/> [@waldls](https://github.com/waldls) | 임세윤 <br/> [@seyun31](https://github.com/seyun31) |
| **Frontend Lead** | **Frontend** | **Frontend** |

