import { api } from "@/api/client";

export interface CalendarDailyItemResponse {
  scrumId?: number;
  content?: string;
  hasStar?: boolean;
  isEditable?: boolean;
}

export interface CalendarDailyGroupResponse {
  titleId?: number;
  projectTag?: string;
  freeText?: string;
  isEditable?: boolean;
  items?: CalendarDailyItemResponse[];
}

export interface CalendarDailyResponse {
  groups?: CalendarDailyGroupResponse[];
}

// 일자별 스크럼 조회
export const getDailyCalendar = (date: string) =>
  api.get<CalendarDailyResponse>("/api/calendar/daily", { date });
