import { api } from "@/lib/apis/client";
import type {
  CalendarDailyPreviewResponse,
  CalendarDayInfo,
  CalendarMonthlyResponse,
  CalendarTitlePreview,
} from "@/types/calendar/calendar";

export type {
  CalendarDailyPreviewResponse,
  CalendarDayInfo,
  CalendarMonthlyResponse,
  CalendarTitlePreview,
};

// 월별 캘린더 데이터 조회
export const getMonthly = (month: string) =>
  api.get<CalendarMonthlyResponse>("/api/calendar/monthly", { month });

// 날짜 프리뷰 조회
export const getDailyPreview = (date: string) =>
  api.get<CalendarDailyPreviewResponse>("/api/calendar/daily-preview", { date });
