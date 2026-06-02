import { api } from "@/lib/apis/client";
import type {
  AiTaggingResultResponse,
  AiTaggingStatusResponse,
  HomeSummaryResponse,
  ReportModalType,
} from "@/types/record/record";

export type { AiTaggingResultResponse, HomeSummaryResponse, ReportModalType };

// AI 태깅 트리거
export const postAiTagging = (starRecordId: number) =>
  api.post<null>(`/api/star-records/${starRecordId}/ai-tagging`);

// AI 태깅 상태 폴링
export const getStatus = (starRecordId: number) =>
  api.get<AiTaggingStatusResponse>(`/api/star-records/${starRecordId}/ai-tagging/status`);

// AI 태깅 결과 조회
export const getResult = (starRecordId: number) =>
  api.get<AiTaggingResultResponse>(`/api/star-records/${starRecordId}/ai-tagging/result`);

// 홈 복귀 요약 정보 조회
export const getHomeSummary = () => api.get<HomeSummaryResponse>("/api/star-records/home-summary");
