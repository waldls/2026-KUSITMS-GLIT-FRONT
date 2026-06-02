import { api } from "@/lib/apis/client";
import type { ActivityStatsData, MonthlyGrassData } from "@/types/home/home";

// 역량 레이더 차트 조회
export const getRadar = () => api.get<ActivityStatsData>("/api/home/radar");

// 월별 역량 잔디 조회
export const getCompetencyStats = (month: string) =>
  api.get<MonthlyGrassData>("/api/home/competency-stats", { month });
