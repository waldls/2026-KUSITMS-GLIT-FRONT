# Contributing Guide

본 문서는 Frontend 팀의 협업 규칙을 정의합니다. <br>
작업 흐름을 표준화하여 협업 시 혼선을 줄이고, 코드 리뷰·테스트·배포 과정을 일관되게 유지하는 것을 목표로 합니다.

## 목차

- [브랜치 전략](#-브랜치-전략)
- [이슈 작성](#-이슈-작성)
- [커밋 컨벤션](#-커밋-컨벤션)
- [PR 규칙](#-pr-규칙)
- [코드 컨벤션](#-코드-컨벤션)

## 🌿 브랜치 전략

```
dev ← feature/#이슈번호-작업내용
    ← hotfix/#이슈번호-작업내용
```

- `dev` — 기본 개발 브랜치. 모든 PR은 이 브랜치를 대상으로 합니다.
- `feature/*` — 새로운 기능 개발
- `hotfix/*` — 긴급 버그 수정

> 이슈 생성 시 브랜치 유형과 작업 내용을 입력하면 **브랜치가 자동으로 생성**됩니다.
> 브랜치를 직접 만들 필요 없이 자동 생성된 브랜치를 바로 사용하세요.

## 📋 이슈 작성

이슈 템플릿을 사용해 작성합니다.

| 항목                 | 설명                                    |
| -------------------- | --------------------------------------- |
| **제목**             | `[FEAT] 기능 이름` 형식으로 작성        |
| **브랜치 유형**      | `feature` / `hotfix` 중 선택            |
| **브랜치 작업 내용** | 영어로만 작성 (예: `common_components`) |
| **Description**      | 구현할 내용 요약                        |
| **Todo**             | 체크리스트 형태로 세부 작업 목록 작성   |

## ✍️ 커밋 컨벤션

| 타입         | 설명                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `[FEAT]`     | 새로운 기능 구현                                                     |
| `[MOD]`      | 코드 수정 및 내부 파일 수정                                          |
| `[ADD]`      | 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성                |
| `[CHORE]`    | 버전 코드 수정, 패키지 구조 변경, 타입 및 변수명 변경 등의 작은 변경 |
| `[DEL]`      | 쓸모없는 코드나 파일 삭제                                            |
| `[UI]`       | UI 작업                                                              |
| `[FIX]`      | 버그 및 오류 해결                                                    |
| `[MOVE]`     | 프로젝트 내 파일이나 코드의 이동 (패키지 위치 이동)                  |
| `[RENAME]`   | 파일 이름 변경                                                       |
| `[REFACTOR]` | 전면 수정                                                            |
| `[DOCS]`     | README나 WIKI 등의 문서 개정                                         |
| `[STYLE]`    | 스타일링 관련                                                        |

**예시**

```
[FEAT] 캘린더 잔디 컴포넌트 구현
[FIX] 로그인 콜백 리다이렉트 오류 수정
[UI] 기록 홈 버튼 간격 조정
```

## 🔀 PR 규칙

- **대상 브랜치**: 항상 `dev`로 PR을 올립니다.
- **연결 이슈**: `resolves #이슈번호` 로 반드시 이슈를 연결합니다.
- **PR 제목**: 커밋 컨벤션과 동일한 형식으로 작성합니다.
- **리뷰어**: 최소 1인 이상의 Approve를 받은 후 머지합니다.

## 🎨 코드 컨벤션

**폴더명**

- 일반 폴더명: 소문자로 시작 `camelCase`

**컴포넌트명**

- 컴포넌트 폴더명: 대문자로 시작 `PascalCase`

```
src/
├── assets/
└── components/
    ├── Button/   # 컴포넌트가 직접 들어있으므로 대문자로 시작
    └── Input/
```

**`.tsx` 파일명 (page, layout 등)**

- 페이지의 경우 `page`로 내보내기

```tsx
const page = () => {
  return <div>Hello World</div>;
};

export default page;
```

**포맷팅** (`.prettierrc` 기준)

| 항목            | 값                                    |
| --------------- | ------------------------------------- |
| 들여쓰기        | 스페이스 2칸                          |
| 줄 길이         | 100자                                 |
| 따옴표          | 쌍따옴표 (`"`)                        |
| 세미콜론        | 사용 (`true`)                         |
| trailing comma  | 항상 (`all`)                          |
| Tailwind 클래스 | prettier-plugin-tailwindcss 자동 정렬 |

**Import 순서**

`eslint-plugin-simple-import-sort` 기준으로 자동 정렬됩니다. <br>
커밋 전 `pnpm lint --fix` 또는 `lint-staged`가 자동으로 처리합니다.

**API 함수명**

- `METHOD + 함수명` 구조로 작성 (예: `patchEditProfile`)
- METHOD: `get`, `post`, `patch`, `put`, `delete`

```
src/lib/apis/
├── auth/
│   ├── auth.ts
│   └── deviceToken.ts
├── calendar/
│   └── calendar.ts
├── home/
│   └── home.ts
├── record/
│   ├── calendar.ts
│   ├── project.ts
│   ├── record.ts
│   ├── scrum.ts
│   ├── starImage.ts
│   ├── starRecord.ts
│   └── starRecord.server.ts
├── report/
│   ├── report.ts
│   └── report.server.ts
├── user/
│   ├── notification.ts
│   ├── onboarding.ts
│   ├── user.ts
│   └── user.server.ts
├── client.ts
└── server.ts
```

**API URI**

- URI는 상수화하지 않고, API 함수 내에서 URI를 그대로 작성합니다.

```ts
// 클라이언트
api.get("/api/projects");
api.post("/api/star-records/bulk", body);

// 서버
serverApi.get("/api/onboarding/status");
```
