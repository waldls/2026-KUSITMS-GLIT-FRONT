import type { Competency } from "@/types/competency";

export type ReportType = "MINI" | "CAREER";
export type ReportStatus = "GENERATING" | "SUCCESS" | "FAILED";

// 리포트 목록 조회
export interface Report {
  reportId: number;
  reportType: ReportType;
  status: ReportStatus;
  createdAt: string;
  title: string | null;
  previewText: string;
  competencyStatSummary: string | null;
}

export interface ReportsData {
  reports: Report[];
}

// 리포트 생성용 사전 정보 조회
export interface AutoSelectedStarRecord {
  starRecordId: number;
  date: string; // "YYYY-MM-DD"
  projectName: string;
  scrumContent: string;
}

export interface SelectableInfo {
  reportType: ReportType;
  totalStarCount: number;
  autoSelectedStarRecords: AutoSelectedStarRecord[];
  starRecordDates: string[]; // "YYYY-MM-DD"[]
}

// 날짜별 심화 기록 모달 조회
export interface DailySelectableRecord {
  starRecordId: number;
  projectName: string;
  scrumContent: string;
}

export interface DailySelectableRecords {
  date: string; // "YYYY-MM-DD"
  starRecords: DailySelectableRecord[];
}

// 리포트 게이지 조회
export interface ReportGauge {
  currentCount: number;
  nextThreshold: number;
  progressRate: number;
  isGeneratable: boolean;
}

// 리포트 생성 상태 폴링
export interface ReportStatusResponse {
  reportId: number;
  status: ReportStatus;
  retryAvailable: boolean | null;
}

// 리포트 생성 API 요청 + 재시도 API 요청
export interface ReportCreateRequest {
  reportType: ReportType;
  starRecordIds: number[];
}

// 리포트 생성 API 응답 + 재시도 API 응답
export interface ReportCreateResponse {
  reportId: number;
}

// 리포트 상세 조회
export interface EvidenceRecord {
  id: number;
  scrumTitle: string;
  createdAt: string;
  projectName: string;
}

export interface Strength {
  title: string;
  description: string;
  evidences: EvidenceRecord[];
}

export interface TopTag {
  tag: string;
  count: number;
}

export interface InterviewQuestion {
  question: string;
  evidences: EvidenceRecord[];
}

// 커리어 리포트 content
export interface CareerReportContent {
  strengths: Strength[];
  brandingStatement: string;
  brandingPattern: string;
  topDetailTags: TopTag[];
  narrativeSummary: string;
  interviewQuestions: InterviewQuestion[];
  experienceHighlights: string[];
}

export interface CompetencyStat {
  competency: Competency;
  count: number;
}

// 미니 리포트 content
export interface MiniReportContent {
  nextFocusPoint: string;
  activitySummary: string;
  competencyFrequency: CompetencyStat[];
  topDetailTags: string[];
}

export interface MiniReportDetail {
  reportId: number;
  reportType: "MINI";
  createdAt: string;
  selectedStarCount: number;
  content: MiniReportContent;
}

export interface CareerReportDetail {
  reportId: number;
  reportType: "CAREER";
  createdAt: string;
  selectedStarCount: number;
  content: CareerReportContent;
}

export type ReportDetailResponse = MiniReportDetail | CareerReportDetail;
