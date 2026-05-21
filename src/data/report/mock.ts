import type { ReportType } from "@/data/report";
import type { DailySelectableRecords } from "@/types/report/report";

export const NEXT_REPORT_TYPE: ReportType = "CAREER";

export const MOCK_DAILY_RECORDS: DailySelectableRecords[] = [
  {
    date: "2026-05-02",
    starRecords: [
      {
        starRecordId: 301,
        projectName: "밋업 프로젝트",
        scrumContent: "유저 인터뷰 설계 및 질문 구조화",
      },
      {
        starRecordId: 302,
        projectName: "밋업 프로젝트",
        scrumContent: "PRD 초안 작성 및 기능 우선순위 정의",
      },
    ],
  },
  {
    date: "2026-05-05",
    starRecords: [
      {
        starRecordId: 303,
        projectName: "졸업 프로젝트",
        scrumContent: "팀원 간 의견 충돌 조율 방식 정리",
      },
    ],
  },
  {
    date: "2026-05-07",
    starRecords: [
      {
        starRecordId: 304,
        projectName: "졸업 프로젝트",
        scrumContent: "API 오류 원인 분석 및 수정",
      },
      { starRecordId: 305, projectName: "KOPLE", scrumContent: "서비스 구조 전반 재설계" },
    ],
  },
  {
    date: "2026-05-09",
    starRecords: [
      { starRecordId: 306, projectName: "KOPLE", scrumContent: "경쟁 서비스 분석 리포트 작성" },
    ],
  },
  {
    date: "2026-05-12",
    starRecords: [
      { starRecordId: 307, projectName: "CEOS", scrumContent: "리뷰 피드백 반영 후 개선점 기록" },
    ],
  },
  {
    date: "2026-05-13",
    starRecords: [
      {
        starRecordId: 308,
        projectName: "졸업 프로젝트",
        scrumContent: "와이어프레임 수정 및 팀 공유",
      },
      { starRecordId: 309, projectName: "KOPLE", scrumContent: "기능 명세서 최종 정리" },
    ],
  },
  {
    date: "2026-05-15",
    starRecords: [
      { starRecordId: 310, projectName: "밋업 프로젝트", scrumContent: "사용성 테스트 결과 분석" },
    ],
  },
  {
    date: "2026-05-18",
    starRecords: [
      { starRecordId: 311, projectName: "CEOS", scrumContent: "배포 후 오류 대응 및 핫픽스" },
    ],
  },
  {
    date: "2026-05-19",
    starRecords: [
      {
        starRecordId: 312,
        projectName: "개인",
        scrumContent: "6개월 활동 돌아보기 및 성장 포인트 정리",
      },
    ],
  },
];
