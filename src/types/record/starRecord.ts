import type { Competency } from "@/types/competency";

// POST /api/star-records/{starRecordId}/steps/{step}
export interface StarRecordStepUpdateRequest {
  userAnswer: string;
}

// POST /api/star-records/bulk
export interface StarRecordBulkCreateRequest {
  items: { scrumId: number }[];
}

export interface StarRecordBulkCreateResponse {
  items?: { starRecordId?: number }[];
}

interface StarImage {
  imageId?: number;
  imageUrl?: string;
  sortOrder?: number;
}

// GET /api/star-records/{starRecordId}
export interface StarDetailResponse {
  starRecordId?: number;
  projectTag?: string;
  freeText?: string;
  scrumContent?: string;
  primaryCategory?: Competency;
  detailTags?: string[];
  situationTask?: string;
  action?: string;
  result?: string;
  images?: StarImage[];
}
