"use client";

import { useQuery } from "@tanstack/react-query";

import {
  calendarDailyPreviewQueryOptions,
  calendarMonthlyQueryOptions,
} from "@/lib/query/queryOptions";
import { formatMonthKey } from "@/lib/utils/calendar";

export const useCalendarMonth = (monthDate: Date) => {
  const monthKey = formatMonthKey(monthDate);
  return useQuery(calendarMonthlyQueryOptions(monthKey));
};

export const useCalendarDailyPreview = (dateKey: string) =>
  useQuery(calendarDailyPreviewQueryOptions(dateKey));
