import { api } from "@/api/client";

type Competency =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

export interface CalendarDayInfo {
  date?: string;
  hasScrums?: boolean;
  hasStar?: boolean;
  primaryCategory?: Competency | null;
  starCount?: number;
}

export interface CalendarMonthlyResponse {
  month?: string;
  days?: CalendarDayInfo[];
}

export interface CalendarTitlePreview {
  titleId?: number;
  projectName?: string;
  freeText?: string;
  primaryCategories?: Competency[];
  scrumCount?: number;
  hasStarAny?: boolean;
}

export interface CalendarDailyPreviewResponse {
  date?: string;
  titles?: CalendarTitlePreview[];
}

// 월별 캘린더 데이터 조회
export const getMonthlyCalendar = (month: string) =>
  api.get<CalendarMonthlyResponse>("/api/calendar/monthly", { month });

// 날짜 프리뷰 조회
export const getDailyCalendarPreview = (date: string) =>
  api.get<CalendarDailyPreviewResponse>("/api/calendar/daily-preview", { date });
