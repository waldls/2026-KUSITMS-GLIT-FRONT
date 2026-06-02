import type { Competency } from "@/types/competency";

// DELETE /api/scrums/{scrumId}
export type DeleteScrumResponse = string;

// DELETE /api/scrums/titles/{titleId}
export type DeleteScrumTitleResponse = string;

// PUT /api/scrums/daily
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

// POST /api/scrums/write
export interface ScrumContentRequest {
  content: string;
}

export interface ScrumByTitleRequest {
  projectId: number;
  freeText: string;
  scrums: ScrumContentRequest[];
}

export interface ScrumBulkWriteRequest {
  date: string;
  scrumsByTitle: ScrumByTitleRequest[];
}

export interface ScrumItem {
  scrumId: number;
}

export interface ScrumBulkWriteResponse {
  projectName?: string;
  freeText?: string;
  scrums?: ScrumItem[];
}

// PATCH /api/scrums/competencies
export interface ScrumCompetencyItem {
  scrumId: number;
  competency: Competency;
}

export interface ScrumCompetencyUpdateRequest {
  items: ScrumCompetencyItem[];
}
