import { api } from "@/api/client";

export type Competency =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

export interface ScrumSyncItemRequest {
  scrumId?: number | null;
  content: string;
}

export interface ScrumSyncGroupRequest {
  titleId: number;
  items: ScrumSyncItemRequest[];
}

export interface SyncDailyScrumRequest {
  groups: ScrumSyncGroupRequest[];
}

interface ScrumItem {
  scrumId: number;
}

interface ScrumContentRequest {
  content: string;
}

interface ScrumByTitleRequest {
  projectId: number;
  freeText: string;
  scrums: ScrumContentRequest[];
}

export interface ScrumBulkWriteRequest {
  date: string;
  scrumsByTitle: ScrumByTitleRequest[];
}

export interface ScrumBulkWriteResponse {
  projectName?: string;
  freeText?: string;
  scrums?: ScrumItem[];
}

interface ScrumCompetencyItem {
  scrumId: number;
  competency: Competency;
}

interface ScrumCompetencyUpdateRequest {
  items: ScrumCompetencyItem[];
}

// 일자별 스크럼 일괄 sync
export const syncDailyScrum = (date: string, body: SyncDailyScrumRequest) =>
  api.put<null>(`/api/scrums/daily?date=${encodeURIComponent(date)}`, body);

// 스크럼 일괄 저장
export const bulkWrite = (body: ScrumBulkWriteRequest) =>
  api.post<ScrumBulkWriteResponse[]>("/api/scrums/write", body);

// 스크럼 역량 선택
export const updateCompetency = (body: ScrumCompetencyUpdateRequest) =>
  api.patch<null>("/api/scrums/competencies", body);
