import { api } from "@/lib/apis/client";
import type {
  StarDetailResponse,
  StarRecordBulkCreateRequest,
  StarRecordBulkCreateResponse,
  StarRecordStepUpdateRequest,
} from "@/types/record/starRecord";

// STAR 단계 저장
export const postSteps = (starRecordId: number, step: string, body: StarRecordStepUpdateRequest) =>
  api.post<null>(`/api/star-records/${starRecordId}/steps/${step}`, body);

// 심화기록 일괄 생성
export const postBulk = (body: StarRecordBulkCreateRequest) =>
  api.post<StarRecordBulkCreateResponse>("/api/star-records/bulk", body);

// 심화기록 상세 조회
export const getStarRecordId = (starRecordId: number) =>
  api.get<StarDetailResponse>(`/api/star-records/${starRecordId}`);

// 심화기록 단독 삭제
export const deleteStarRecordId = (starRecordId: number) =>
  api.delete<null>(`/api/star-records/${starRecordId}`);
