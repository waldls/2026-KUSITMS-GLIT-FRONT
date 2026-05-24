import { api } from "@/api/client";

export type Competency =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

type AiTaggingStatus = "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";

interface AiTaggingStatusResponse {
  status?: AiTaggingStatus;
  retryCount?: number;
}

export interface AiTaggingResultResponse {
  status?: AiTaggingStatus;
  primaryCategory?: Competency;
  detailTags?: string[];
}

export type ReportModalType = "MINI" | "FULL";

export interface HomeSummaryResponse {
  isFirstStar?: boolean;
  reportModal?: {
    show?: boolean;
    type?: ReportModalType | null;
  };
}

// AI 태깅 트리거
export const triggerAiTagging = (starRecordId: number) =>
  api.post<null>(`/api/star-records/${starRecordId}/ai-tagging`);

// AI 태깅 상태 폴링
export const getAiTaggingStatus = (starRecordId: number) =>
  api.get<AiTaggingStatusResponse>(`/api/star-records/${starRecordId}/ai-tagging/status`);

// AI 태깅 결과 조회
export const getAiTaggingResult = (starRecordId: number) =>
  api.get<AiTaggingResultResponse>(`/api/star-records/${starRecordId}/ai-tagging/result`);

// 홈 복귀 요약 정보 조회
export const getHomeSummary = () => api.get<HomeSummaryResponse>("/api/star-records/home-summary");
