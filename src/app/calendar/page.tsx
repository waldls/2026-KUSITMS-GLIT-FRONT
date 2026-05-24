"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CalendarSwiper from "@/components/calendar/CalendarSwiper";
import NavigationBar from "@/components/common/NavigationBar";
import CalendarScrumPreview from "@/containers/calendar/CalendarScrumPreview";
import {
  type CalendarDayInfo,
  type CalendarTitlePreview,
  getDailyCalendarPreview,
  getMonthlyCalendar,
} from "@/lib/apis/calendar/calendar";
import { exceededMatcher, isExceededDate, toDateKey } from "@/lib/utils/calendar";

const formatMonthForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const Page = () => {
  const router = useRouter();
  const [today] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarDays, setCalendarDays] = useState<CalendarDayInfo[]>([]);
  const [previewScrums, setPreviewScrums] = useState<CalendarTitlePreview[]>([]);

  const dateKey = toDateKey(selectedDate);
  const dayData = calendarDays.find(day => day.date === dateKey);
  const hasScrums = dayData?.hasScrums ?? false;
  const exceeded = isExceededDate(selectedDate);

  const handleSelect = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  const loadMonthlyCalendar = async (monthDate: Date) => {
    try {
      const monthlyCalendar = await getMonthlyCalendar(formatMonthForApi(monthDate));

      setCalendarDays(monthlyCalendar?.days ?? []);
    } catch {
      setCalendarDays([]);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadInitialMonthlyCalendar = async () => {
      try {
        const monthlyCalendar = await getMonthlyCalendar(formatMonthForApi(today));
        if (!ignore) setCalendarDays(monthlyCalendar?.days ?? []);
      } catch {
        if (!ignore) setCalendarDays([]);
      }
    };

    void loadInitialMonthlyCalendar();

    return () => {
      ignore = true;
    };
  }, [today]);

  useEffect(() => {
    let ignore = false;

    const loadPreview = async () => {
      try {
        const dailyPreview = await getDailyCalendarPreview(dateKey);
        if (!ignore) setPreviewScrums(dailyPreview?.titles ?? []);
      } catch {
        if (!ignore) setPreviewScrums([]);
      }
    };

    void loadPreview();

    return () => {
      ignore = true;
    };
  }, [dateKey]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="scrollbar-hide mt-9 flex-1 overflow-y-auto px-4">
        <CalendarSwiper
          selectedDate={selectedDate}
          today={today}
          scrumDates={calendarDays
            .filter(day => day.hasScrums && day.date)
            .map(day => new Date(day.date!))}
          exceededMatcher={exceededMatcher}
          onSelect={handleSelect}
          onMonthChange={loadMonthlyCalendar}
        />

        <div className="mt-10.5 px-1 pb-9">
          <CalendarScrumPreview
            selectedDate={selectedDate}
            dateKey={dateKey}
            exceeded={exceeded}
            hasScrums={hasScrums}
            previewScrums={previewScrums}
            onDetailClick={() => router.push(`/calendar/${dateKey}`)}
          />
        </div>
      </div>

      <NavigationBar />
    </div>
  );
};

export default Page;
