import type { Competency } from "@/types/competency";

export type AiTaggingStatus = "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";
export type ReportModalType = "MINI" | "FULL";

export interface AiTaggingStatusResponse {
  status?: AiTaggingStatus;
  retryCount?: number;
}

export interface AiTaggingResultResponse {
  status?: AiTaggingStatus;
  primaryCategory?: Competency;
  detailTags?: string[];
}

export interface HomeSummaryResponse {
  isFirstStar?: boolean;
  reportModal?: {
    show?: boolean;
    type?: ReportModalType | null;
  };
}
