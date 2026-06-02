import { api } from "@/lib/apis/client";
import type { DailyCalendarData } from "@/types/record/calendar";

// 일자별 스크럼 조회
export const getDaily = (date: string) =>
  api.get<DailyCalendarData>("/api/calendar/daily", { date });
