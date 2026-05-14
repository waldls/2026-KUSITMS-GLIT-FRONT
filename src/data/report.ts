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
  currentCount: 7,
  nextThreshold: 10,
  progressRate: 0.7,
  isGeneratable: false,
};

export const mockReports: Report[] = [
  {
    reportId: 3,
    reportType: "CAREER",
    createdAt: "2026-04-12",
    title: "OOO님은 문제를 구조화하고, 데이터로 해결하는 기획자입니다.",
    previewText:
      '"꾸준함이 만든 변화"가 가장 크게 보인 시기였어요. 기록을 통해 스스로를 돌아보는 빈도가 늘어나면서, 작은 행동이 쌓여 실력이 되는 과정을 직접 체감하고 있습니다.',
    competencyStatSummary: null,
  },
  {
    reportId: 2,
    reportType: "CAREER",
    status: "SUCCESS",
    createdAt: "2026-04-10",
    title: "OOO님은 복잡한 문제를 구조로 풀어내는 '설계형 기획자'입니다.",
    previewText:
      "복수의 프로젝트를 동시에 진행하면서도 각 과제의 핵심을 놓치지 않는 집중력이 돋보였어요. 혼란스러운 상황일수록 구조를 먼저 잡고 움직이는 패턴이 뚜렷하게 나타났습니다.",
    competencyStatSummary: null,
  },
  {
    reportId: 1,
    reportType: "MINI",
    createdAt: "2026-03-01",
    title: "OOO님은 여러 프로젝트를 병행하며 꾸준한 성장을 보여주고 있습니다.",
    previewText:
      "이번 달은 실행보다 고민이 앞섰던 시기예요. 방향을 잡기 위해 많은 에너지를 쏟았고, 그 과정에서 스스로의 판단 기준이 조금씩 선명해지고 있다는 걸 느꼈을 거예요.",
    competencyStatSummary: null,
  },
];
