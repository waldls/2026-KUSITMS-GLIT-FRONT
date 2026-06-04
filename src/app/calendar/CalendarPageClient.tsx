"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CalendarSwiper from "@/components/calendar/CalendarSwiper";
import NavigationBar from "@/components/common/NavigationBar";
import CalendarScrumPreview from "@/containers/calendar/CalendarScrumPreview";
import { useCalendarData } from "@/lib/hooks/calendar/useCalendarData";
import { exceededMatcher, isExceededDate, parseDateKey, toDateKey } from "@/lib/utils/calendar";

interface CalendarPageClientProps {
  /** 서버 prefetch와 동일한 YYYY-MM-DD (Asia/Seoul 기준) */
  initialDateKey: string;
}

const CalendarPageClient = ({ initialDateKey }: CalendarPageClientProps) => {
  const router = useRouter();
  const [today] = useState(() => parseDateKey(initialDateKey));
  const { selectedDate, calendarDays, previewScrums, handleSelect, loadMonth } =
    useCalendarData(today);

  const dateKey = toDateKey(selectedDate);
  const dayData = calendarDays.find(day => day.date === dateKey);
  const hasScrums = dayData?.hasScrums ?? false;
  const exceeded = isExceededDate(selectedDate);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="scrollbar-hide mt-9 flex flex-1 flex-col overflow-y-auto px-4">
        <div className="shrink-0">
          <CalendarSwiper
            selectedDate={selectedDate}
            today={today}
            scrumDates={calendarDays
              .filter(day => day.hasScrums && day.date)
              .map(day => new Date(day.date!))}
            exceededMatcher={exceededMatcher}
            onSelect={handleSelect}
            onMonthChange={loadMonth}
          />
        </div>

        <div className="mt-10.5 flex flex-1 flex-col px-1 pb-9">
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

export default CalendarPageClient;
