import type { Competency } from "@/types/competency";

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
