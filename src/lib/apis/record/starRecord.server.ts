import { serverApi } from "@/lib/apis/server";
import type { StarDetailResponse } from "@/types/record/starRecord";

// 심화기록 상세 조회 (서버 컴포넌트용)
export const getStarRecordId = (starRecordId: number) =>
  serverApi.get<StarDetailResponse>(`/api/star-records/${starRecordId}`);
