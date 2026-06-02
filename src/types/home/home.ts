import type { ApiResponse } from "@/types/api";
import type { Competency } from "@/types/competency";

// 역량 레이더 차트 조회 response
export interface ActivityStatsData {
  min: number;
  max: number;
  categories: Record<Competency, number>;
}

export type ActivityStatsResponse = ApiResponse<ActivityStatsData>;

// 월별 역량 잔디 조회 response
export type GrassStatus = "NO_DATA" | "STAR_LOW" | "STAR_MID" | "STAR_HIGH";

export interface GrassDayData {
  date: string;
  status: GrassStatus;
}

export interface MonthlyGrassData {
  month: string;
  days: GrassDayData[];
}

export type MonthlyGrassResponse = ApiResponse<MonthlyGrassData>;
