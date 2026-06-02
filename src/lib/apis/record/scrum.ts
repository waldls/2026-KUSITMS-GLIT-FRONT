import { api } from "@/lib/apis/client";
import type {
  DeleteScrumResponse,
  DeleteScrumTitleResponse,
  ScrumBulkWriteRequest,
  ScrumBulkWriteResponse,
  ScrumCompetencyUpdateRequest,
  ScrumSyncGroupRequest,
  ScrumSyncItemRequest,
  SyncDailyScrumRequest,
} from "@/types/record/scrum";

export type {
  ScrumBulkWriteRequest,
  ScrumBulkWriteResponse,
  ScrumSyncGroupRequest,
  ScrumSyncItemRequest,
  SyncDailyScrumRequest,
};

// 일자별 스크럼 일괄 sync
export const putDaily = (date: string, body: SyncDailyScrumRequest) =>
  api.put<null>(`/api/scrums/daily?date=${encodeURIComponent(date)}`, body);

// 스크럼 일괄 저장
export const postWrite = (body: ScrumBulkWriteRequest) =>
  api.post<ScrumBulkWriteResponse[]>("/api/scrums/write", body);

// 스크럼 역량 선택
export const patchCompetencies = (body: ScrumCompetencyUpdateRequest) =>
  api.patch<null>("/api/scrums/competencies", body);

// 스크럼 단일 삭제
export const deleteScrumId = (scrumId: number) =>
  api.delete<DeleteScrumResponse>(`/api/scrums/${scrumId}`);

// 스크럼 제목(freeText) 단위 일괄 삭제
export const deleteTitleId = (titleId: number) =>
  api.delete<DeleteScrumTitleResponse>(`/api/scrums/titles/${titleId}`);
