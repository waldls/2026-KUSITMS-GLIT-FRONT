export interface ReportGauge {
  currentCount: number;
  nextThreshold: number;
  progressRate: number;
  isGeneratable: boolean;
}

export type ReportType = "CAREER" | "MINI";
export type ReportStatus = "SUCCESS" | "PROCESSING" | "FAILED";

export interface Report {
  reportId: number;
  reportType: ReportType;
  status?: ReportStatus;
  createdAt: string;
  title: string | null;
  previewText: string;
  competencyStatSummary: string | null;
}

export const mockReportGauge: ReportGauge = {
  currentCount: 40,
  nextThreshold: 50,
  progressRate: 1,
  isGeneratable: false,
};

export type CompetencyCategory =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "PROBLEM_SOLVING"
  | "COLLABORATION"
  | "REFLECTION_GROWTH";

export interface CompetencyStat {
  category: CompetencyCategory;
  count: number;
}

export interface CompetencyStats {
  topCategories: CompetencyStat[];
  topDetailTags: string[];
}

export interface ReportDetail {
  reportId: number;
  reportType: ReportType;
  createdAt: string;
  content: {
    competencyStats: CompetencyStats;
    activitySummary: string;
    nextFocusPoint: string;
  };
}

// 미니 리포트
export const mockReportDetail: ReportDetail = {
  reportId: 1,
  reportType: "MINI",
  createdAt: "2026.03.01",
  content: {
    competencyStats: {
      topCategories: [
        { category: "DISCOVERY_ANALYSIS", count: 2 },
        { category: "PLANNING_EXECUTION", count: 6 },
        { category: "PROBLEM_SOLVING", count: 6 },
        { category: "COLLABORATION", count: 3 },
        { category: "REFLECTION_GROWTH", count: 2 },
      ],
      topDetailTags: ["#기획_구조화", "#서비스_기획", "#UX_설계", "#문서화"],
    },
    activitySummary:
      "00님은 KOPLE, 밋업 프로젝트 등 복수의 프로젝트를 동시에 진행하며 각 과제를 구조화하는 작업을 반복해왔어요. 특히 복잡한 요구사항이 주어졌을 때 먼저 전체 흐름을 정의하고 실행하는 방식이 기록 전반에서 일관되게 나타나요. 설계 중 의문이 생기면 진행을 멈추고 재검토하는 패턴도 눈에 띄어요.",
    nextFocusPoint:
      "아직 협업/조율 영역 기록이 적어요. 팀원과 의견을 조율했던 경험이나 피드백을 주고받은 순간을 기록해보면 더 입체적인 커리어 서사가 만들어질 거예요.",
  },
};

export interface EvidenceRecord {
  starRecordId: number;
  title: string;
  recordedAt: string;
}

export interface Strength {
  title: string;
  description: string;
  evidenceRecords: EvidenceRecord[];
}

export interface InterviewQuestion {
  question: string;
  evidenceRecords: EvidenceRecord[];
}

export interface BrandingEvidence {
  topTags: { tag: string; count: number }[];
  pattern: string;
}

export interface CareerReportContent {
  brandingTitle: string;
  brandingEvidence: BrandingEvidence;
  narrativeSummary: string;
  strengths: Strength[];
  experienceHighlights: string[];
  interviewQuestions: InterviewQuestion[];
}

export interface CareerReportDetail {
  reportId: number;
  reportType: ReportType;
  createdAt: string;
  selectedStarCount: number;
  content: CareerReportContent;
}

// 커리어 리포트
export const mockCareerReportDetail: CareerReportDetail = {
  reportId: 2,
  reportType: "CAREER",
  createdAt: "2026.04.10",
  selectedStarCount: 20,
  content: {
    brandingTitle: "OOO님은 복잡한 문제를 구조로 풀어내는 '설계형 기획자'입니다.",
    brandingEvidence: {
      topTags: [
        { tag: "#기획_구조화", count: 4 },
        { tag: "#서비스_기획", count: 3 },
        { tag: "#구조_개선", count: 3 },
      ],
      pattern: "복잡한 상황에서 먼저 구조를 정의하는 행동 방식",
    },
    narrativeSummary:
      "다솔님은 복수의 프로젝트를 동시에 진행하면서도 각 과제를 먼저 구조화하고 실행하는 방식을 일관되게 유지해왔어요. 기획 중 설계적 의문이 생기면 진행을 멈추고 재검토하는 패턴이 반복되며, 이는 완성도에 대한 높은 기준을 반영해요. #기획_구조화와 #구조_개선이 다른 역량 태그보다 유독 많이 나온 건 이 방식의 증거예요.",
    strengths: [
      {
        title: "구조 먼저 잡는 기획력",
        description:
          "요구사항이 복잡할수록 전체 흐름을 먼저 정의하고 실행해요. 설계 중 의문이 생기면 멈추고 재검토하는 패턴이 일관돼요.",
        evidenceRecords: [
          { starRecordId: 101, title: "KOPLE 기획", recordedAt: "04/09" },
          { starRecordId: 203, title: "5대 역량 설계 재고민", recordedAt: "04/10" },
        ],
      },
      {
        title: "시스템으로 해결하는 협업",
        description: "커뮤니케이션 문제를 개인 노력이 아닌 구조와 규칙으로 풀는 접근이 반복돼요.",
        evidenceRecords: [{ starRecordId: 102, title: "CEOS 협업 툴 세팅", recordedAt: "04/09" }],
      },
      {
        title: "구조 먼저 잡는 기획력",
        description:
          "요구사항이 복잡할수록 전체 흐름을 먼저 정의하고 실행해요. 설계 중 의문이 생기면 멈추고 재검토하는 패턴이 일관돼요.",
        evidenceRecords: [
          { starRecordId: 104, title: "KOPLE 기획", recordedAt: "04/09" },
          { starRecordId: 206, title: "5대 역량 설계 재고민", recordedAt: "04/10" },
        ],
      },
    ],
    experienceHighlights: [
      "복수의 이해관계자 요구가 충돌하는 KOPLE 프로젝트에서, 전체 흐름을 구조화해 PRD와 기능명세서를 단기간에 완성했습니다.",
      "설계 중 구조적 의문이 생겼을 때 진행을 멈추고 재검토함으로써, 개발 착수 전 핵심 설계 이슈를 선재 해결했습니다.",
    ],
    interviewQuestions: [
      {
        question:
          "KOPLE 프로젝트에서 단기간에 완성했다고 하셨는데, 구체적으로 얼마 만이었고 어떤 트레이드오프가 있었나요?",
        evidenceRecords: [{ starRecordId: 101, title: "KOPLE 기획", recordedAt: "04/09" }],
      },
      {
        question: "진행을 멈추고 재검토하는 판단을 팀원들에게 어떻게 설득하셨나요?",
        evidenceRecords: [{ starRecordId: 109, title: "CEOS 협업 툴 세팅", recordedAt: "04/09" }],
      },
      {
        question: "진행을 멈추고 재검토하는 판단을 팀원들에게 어떻게 설득하셨나요?",
        evidenceRecords: [{ starRecordId: 109, title: "CEOS 협업 툴 세팅", recordedAt: "04/10" }],
      },
    ],
  },
};

// 리포트 생성 상태 조회
export type GenerateStatus = "GENERATING" | "SUCCESS" | "FAILED";

export interface GenerateStatusResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    reportId: number;
    status: GenerateStatus;
  };
}

let _mockPollCount = 0;

export const getMockGenerateStatus = (): GenerateStatusResponse => {
  _mockPollCount++;
  return {
    success: true,
    code: "200",
    message: "리포트 생성 상태 조회 성공",
    data: {
      reportId: 3,
      status: _mockPollCount >= 30 ? "SUCCESS" : "GENERATING",
    },
  };
};

// 리포트 목록 조회
export const mockReports: Report[] = [
  {
    reportId: 3,
    reportType: "CAREER",
    createdAt: "2026.04.12",
    title: "디솔님은 문제를 구조화하고, 데이터로 해결하는 기획자입니다.",
    previewText:
      '"꾸준함이 만든 변화"가 가장 크게 보인 시기였어요. 기록을 통해 스스로를 돌아보는 빈도가 늘어나면서, 작은 행동이 쌓여 실력이 되는 과정을 직접 체감하고 있습니다.',
    competencyStatSummary: null,
  },
  {
    reportId: 2,
    reportType: "CAREER",
    status: "SUCCESS",
    createdAt: "2026.04.10",
    title: "다솔님은 복잡한 문제를 구조로 풀어내는 '설계형 기획자'입니다.",
    previewText:
      "복수의 프로젝트를 동시에 진행하면서도 각 과제의 핵심을 놓치지 않는 집중력이 돋보였어요. 혼란스러운 상황일수록 구조를 먼저 잡고 움직이는 패턴이 뚜렷하게 나타났습니다.",
    competencyStatSummary: null,
  },
  {
    reportId: 1,
    reportType: "MINI",
    createdAt: "2026.03.01",
    title: "다솔님은 어떤 기획자로 성장하고 있을까요?",
    previewText:
      "이번 달은 실행보다 고민이 앞섰던 시기예요. 방향을 잡기 위해 많은 에너지를 쏟았고, 그 과정에서 스스로의 판단 기준이 조금씩 선명해지고 있다는 걸 느꼈을 거예요.",
    competencyStatSummary: null,
  },
];
