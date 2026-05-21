import type {
  CalendarDailyData,
  CalendarDailyPreviewData,
  CalendarMonthlyData,
} from "@/types/calendar/calendar";

// CalendarMonthlyResponse
export const CALENDAR_MONTHLY_MOCK: CalendarMonthlyData = {
  month: "2026-05",
  days: [
    {
      date: "2026-05-04",
      hasScrums: true,
      hasStar: true,
      primaryCategory: "PLANNING_EXECUTION",
      starCount: 2,
    },
    { date: "2026-05-06", hasScrums: true, hasStar: false, primaryCategory: null, starCount: 0 },
    {
      date: "2026-05-08",
      hasScrums: true,
      hasStar: true,
      primaryCategory: "DISCOVERY_ANALYSIS",
      starCount: 1,
    },
    {
      date: "2026-05-12",
      hasScrums: true,
      hasStar: true,
      primaryCategory: "PROBLEM_SOLVING",
      starCount: 3,
    },
    { date: "2026-05-14", hasScrums: true, hasStar: false, primaryCategory: null, starCount: 0 },
    {
      date: "2026-05-16",
      hasScrums: true,
      hasStar: true,
      primaryCategory: "COLLABORATION",
      starCount: 1,
    },
  ],
};

// CalendarDailyPreviewResponse
export const CALENDAR_DAILY_PREVIEW_MOCK: Record<string, CalendarDailyPreviewData> = {
  "2026-05-04": {
    date: "2026-05-04",
    scrums: [
      {
        scrumId: 1,
        projectName: "밋업 프로젝트",
        freeText: "유저 리서치 문항 설계",
        content: "인터뷰 대상 선정 및 문항 초안 작성",
        primaryCategory: "PLANNING_EXECUTION",
        detailTags: ["UX 설계", "품질 관리"],
        hasStar: true,
      },
    ],
  },
  "2026-05-06": {
    date: "2026-05-06",
    scrums: [
      {
        scrumId: 2,
        projectName: "토이 프로젝트",
        freeText: "데이터셋 분석",
        content: "데이터셋 EDA 및 결측치 처리",
        primaryCategory: null,
        detailTags: null,
        hasStar: false,
      },
      {
        scrumId: 3,
        projectName: "밋업 프로젝트",
        freeText: "기획 작업",
        content: "와이어프레임 설계 및 Jira 세팅",
        primaryCategory: null,
        detailTags: null,
        hasStar: false,
      },
    ],
  },
  "2026-05-08": {
    date: "2026-05-08",
    scrums: [
      {
        scrumId: 4,
        projectName: "졸업 프로젝트",
        freeText: "와이어프레임 작업",
        content: "메인 화면 레이아웃 및 컴포넌트 정의",
        primaryCategory: "DISCOVERY_ANALYSIS",
        detailTags: ["UX 설계", "기획"],
        hasStar: true,
      },
    ],
  },
  "2026-05-12": {
    date: "2026-05-12",
    scrums: [
      {
        scrumId: 5,
        projectName: "밋업 프로젝트",
        freeText: "어드민 페이지 화면 작업",
        content: "대시보드 레이아웃 구성 및 필터 컴포넌트 작업",
        primaryCategory: "PROBLEM_SOLVING",
        detailTags: ["UI 구현", "품질 관리", "협업"],
        hasStar: true,
      },
    ],
  },
  "2026-05-14": {
    date: "2026-05-14",
    scrums: [
      {
        scrumId: 6,
        projectName: "큐시즘 스터디",
        freeText: "React 상태관리 발표 준비",
        content: "Zustand vs Jotai 비교 정리 및 발표 자료 제작",
        primaryCategory: null,
        detailTags: null,
        hasStar: false,
      },
      {
        scrumId: 7,
        projectName: "토이 프로젝트",
        freeText: "API 연동 및 에러 처리",
        content: "axios interceptor 설정 및 에러 바운더리 구현",
        primaryCategory: null,
        detailTags: null,
        hasStar: false,
      },
    ],
  },
  "2026-05-16": {
    date: "2026-05-16",
    scrums: [
      {
        scrumId: 8,
        projectName: "밋업 프로젝트",
        freeText: "디자인 시스템 컴포넌트 제작",
        content: "버튼 컴포넌트 변형 정의 및 색상 토큰 정리",
        primaryCategory: "COLLABORATION",
        detailTags: ["디자인 시스템", "협업"],
        hasStar: true,
      },
      {
        scrumId: 9,
        projectName: "밋업 프로젝트",
        freeText: "디자인 시스템 컴포넌트 제작",
        content: "버튼 컴포넌트 변형 정의 및 색상 토큰 정리2",
        primaryCategory: null,
        detailTags: null,
        hasStar: false,
      },
    ],
  },
};

// CalendarDailyResponse
export const CALENDAR_DAILY_MOCK: Record<string, CalendarDailyData> = {
  "2026-05-04": {
    receivedTags: [],
    groups: [
      {
        titleId: 1,
        projectTag: "밋업 프로젝트",
        freeText: "유저 리서치 문항 설계",
        isEditable: true,
        items: [
          {
            scrumId: 1,
            content: "인터뷰 대상 선정 및 문항 초안 작성",
            hasStar: true,
            isEditable: false,
            primaryCategory: null,
          },
          {
            scrumId: 2,
            content: "경쟁사 리서치 자료 정리",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
        ],
      },
    ],
  },
  "2026-05-06": {
    receivedTags: [
      "UX 설계",
      "품질 관리",
      "데이터 분석",
      "고객 인터뷰",
      "고객 인터뷰2",
      "고객 인터뷰3",
    ], // 임시
    groups: [
      {
        titleId: 2,
        projectTag: "토이 프로젝트",
        freeText: "데이터셋 분석",
        isEditable: true,
        items: [
          {
            scrumId: 3,
            content: "데이터셋 EDA 및 결측치 처리",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
          {
            scrumId: 4,
            content: "이상치 탐지 및 시각화",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
        ],
      },
      {
        titleId: 3,
        projectTag: "밋업 프로젝트",
        freeText: "기획 작업",
        isEditable: true,
        items: [
          {
            scrumId: 5,
            content: "와이어프레임 작업",
            hasStar: true,
            isEditable: false,
            primaryCategory: "PLANNING_EXECUTION",
          }, // 임시
          {
            scrumId: 6,
            content: "Jira 세팅 및 Github 연결 자동화",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
          {
            scrumId: 7,
            content: "기능명세서 작성",
            hasStar: true,
            isEditable: false,
            primaryCategory: "DISCOVERY_ANALYSIS",
          }, // 임시
        ],
      },
    ],
  },
  "2026-05-08": {
    receivedTags: [],
    groups: [
      {
        titleId: 4,
        projectTag: "졸업 프로젝트",
        freeText: "와이어프레임 작업",
        isEditable: false,
        items: [
          {
            scrumId: 8,
            content: "메인 화면 레이아웃 및 컴포넌트 정의",
            hasStar: true,
            isEditable: false,
            primaryCategory: null,
          },
          {
            scrumId: 9,
            content: "온보딩 플로우 스케치",
            hasStar: false,
            isEditable: false,
            primaryCategory: null,
          },
        ],
      },
    ],
  },
  "2026-05-12": {
    receivedTags: [],
    groups: [
      {
        titleId: 5,
        projectTag: "밋업 프로젝트",
        freeText: "어드민 페이지 화면 작업",
        isEditable: true,
        items: [
          {
            scrumId: 10,
            content: "대시보드 레이아웃 구성",
            hasStar: true,
            isEditable: false,
            primaryCategory: null,
          },
          {
            scrumId: 11,
            content: "필터 컴포넌트 작업",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
          {
            scrumId: 12,
            content: "테이블 페이지네이션 구현",
            hasStar: true,
            isEditable: false,
            primaryCategory: null,
          },
        ],
      },
    ],
  },
  "2026-05-14": {
    receivedTags: [],
    groups: [
      {
        titleId: 6,
        projectTag: "큐시즘 스터디",
        freeText: "React 상태관리 발표 준비",
        isEditable: true,
        items: [
          {
            scrumId: 13,
            content: "Zustand vs Jotai 비교 정리",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
          {
            scrumId: 14,
            content: "발표 자료 제작",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
        ],
      },
      {
        titleId: 7,
        projectTag: "토이 프로젝트",
        freeText: "API 연동 및 에러 처리",
        isEditable: true,
        items: [
          {
            scrumId: 15,
            content: "axios interceptor 설정",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
          {
            scrumId: 16,
            content: "에러 바운더리 구현",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
        ],
      },
    ],
  },
  "2026-05-16": {
    receivedTags: [],
    groups: [
      {
        titleId: 8,
        projectTag: "밋업 프로젝트",
        freeText: "디자인 시스템 컴포넌트 제작",
        isEditable: true,
        items: [
          {
            scrumId: 17,
            content: "버튼 컴포넌트 변형 정의",
            hasStar: true,
            isEditable: false,
            primaryCategory: null,
          },
          {
            scrumId: 18,
            content: "색상 토큰 정리",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
          {
            scrumId: 19,
            content: "아이콘 컴포넌트 래핑",
            hasStar: false,
            isEditable: true,
            primaryCategory: null,
          },
        ],
      },
    ],
  },
};
