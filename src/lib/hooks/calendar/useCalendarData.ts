"use client";

import { useState } from "react";

import { useCalendarDailyPreview, useCalendarMonth } from "@/lib/hooks/calendar/useCalendarQueries";
import { toDateKey } from "@/lib/utils/calendar";

export const useCalendarData = (today: Date) => {
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewMonth, setViewMonth] = useState<Date>(today);

  const monthQuery = useCalendarMonth(viewMonth);
  const dateKey = toDateKey(selectedDate);
  const previewQuery = useCalendarDailyPreview(dateKey);

  const handleSelect = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  const loadMonth = (monthDate: Date) => {
    setViewMonth(monthDate);
  };

  return {
    selectedDate,
    calendarDays: monthQuery.data ?? [],
    previewScrums: previewQuery.data ?? [],
    isMonthLoading: monthQuery.isPending,
    isPreviewLoading: previewQuery.isPending,
    handleSelect,
    loadMonth,
  };
};
