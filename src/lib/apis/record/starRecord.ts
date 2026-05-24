import { api } from "@/api/client";

type Competency =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

interface StarRecordStepUpdateRequest {
  userAnswer: string;
}

interface ScrumItem {
  scrumId: number;
}

interface StarRecordBulkCreateRequest {
  items: ScrumItem[];
}

interface StarRecordItem {
  starRecordId?: number;
}

interface StarRecordBulkCreateResponse {
  items?: StarRecordItem[];
}

interface StarImage {
  imageId?: number;
  imageUrl?: string;
  sortOrder?: number;
}

interface StarDetailResponse {
  starRecordId?: number;
  projectTag?: string;
  freeText?: string;
  scrumContent?: string;
  primaryCategory?: Competency | string;
  detailTags?: string[];
  situationTask?: string;
  action?: string;
  result?: string;
  images?: StarImage[];
}

interface ReportModal {
  show?: boolean;
  type?: "MINI" | "FULL";
}

interface HomeSummaryResponse {
  isFirstStar?: boolean;
  reportModal?: ReportModal;
}

// STAR 단계 저장
export const updateStep = (starRecordId: number, step: string, body: StarRecordStepUpdateRequest) =>
  api.post<null>(`/api/star-records/${starRecordId}/steps/${step}`, body);

// 심화기록 일괄 생성
export const bulkCreate = (body: StarRecordBulkCreateRequest) =>
  api.post<StarRecordBulkCreateResponse>("/api/star-records/bulk", body);

// 심화기록 상세 조회
export const getStarDetail = (starRecordId: number) =>
  api.get<StarDetailResponse>(`/api/star-records/${starRecordId}`);

// 심화기록 단독 삭제
export const deleteStar = (starRecordId: number) =>
  api.delete<null>(`/api/star-records/${starRecordId}`);

// 홈 복귀 요약 정보 조회
export const getHomeSummary = () => api.get<HomeSummaryResponse>("/api/star-records/home-summary");
