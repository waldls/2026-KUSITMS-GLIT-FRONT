"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getDailyCalendarPreview, getMonthlyCalendar } from "@/lib/apis/calendar/calendar";
import { formatMonthKey, toDateKey } from "@/lib/utils/calendar";
import type { CalendarDayInfo, CalendarTitlePreview } from "@/types/calendar/calendar";

export const useCalendarData = (today: Date) => {
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarDays, setCalendarDays] = useState<CalendarDayInfo[]>([]);
  const [previewScrums, setPreviewScrums] = useState<CalendarTitlePreview[]>([]);

  const monthCacheRef = useRef<Record<string, CalendarDayInfo[]>>({});
  const previewCacheRef = useRef<Record<string, CalendarTitlePreview[]>>({});
  const activeMonthKeyRef = useRef<string | null>(null);

  const loadMonth = useCallback((monthDate: Date) => {
    const monthKey = formatMonthKey(monthDate);
    activeMonthKeyRef.current = monthKey;

    if (monthCacheRef.current[monthKey] !== undefined) {
      setCalendarDays(monthCacheRef.current[monthKey]);
      return;
    }

    void (async () => {
      try {
        const data = await getMonthlyCalendar(monthKey);
        const days = data?.days ?? [];
        monthCacheRef.current[monthKey] = days;
        if (activeMonthKeyRef.current === monthKey) setCalendarDays(days);
      } catch {
        if (activeMonthKeyRef.current === monthKey) setCalendarDays([]);
      }
    })();
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  useEffect(() => {
    loadMonth(today);
  }, [loadMonth, today]);

  useEffect(() => {
    const dateKey = toDateKey(selectedDate);

    if (previewCacheRef.current[dateKey] !== undefined) {
      setPreviewScrums(previewCacheRef.current[dateKey]);
      return;
    }

    let ignore = false;

    void (async () => {
      try {
        const data = await getDailyCalendarPreview(dateKey);
        if (ignore) return;
        const titles = data?.titles ?? [];
        previewCacheRef.current[dateKey] = titles;
        setPreviewScrums(titles);
      } catch {
        if (!ignore) setPreviewScrums([]);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  return {
    selectedDate,
    calendarDays,
    previewScrums,
    handleSelect,
    loadMonth,
  };
};
