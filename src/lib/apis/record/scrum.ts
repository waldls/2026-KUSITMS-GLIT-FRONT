import { api } from "@/api/client";
import type { DeleteScrumResponse, DeleteScrumTitleResponse } from "@/types/record/scrum";

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

// 스크럼 단일 삭제
export const deleteScrum = (scrumId: number) =>
  api.delete<DeleteScrumResponse>(`/api/scrums/${scrumId}`);

// 스크럼 제목(freeText) 단위 일괄 삭제
export const deleteScrumTitle = (titleId: number) =>
  api.delete<DeleteScrumTitleResponse>(`/api/scrums/titles/${titleId}`);
