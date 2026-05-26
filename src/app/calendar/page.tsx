"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CalendarSwiper from "@/components/calendar/CalendarSwiper";
import NavigationBar from "@/components/common/NavigationBar";
import CalendarScrumPreview from "@/containers/calendar/CalendarScrumPreview";
import { useCalendarData } from "@/lib/hooks/calendar/useCalendarData";
import { exceededMatcher, isExceededDate, toDateKey } from "@/lib/utils/calendar";

const Page = () => {
  const router = useRouter();
  const [today] = useState(() => new Date());
  const { selectedDate, calendarDays, previewScrums, handleSelect, loadMonth } =
    useCalendarData(today);

  const dateKey = toDateKey(selectedDate);
  const dayData = calendarDays.find(day => day.date === dateKey);
  const hasScrums = dayData?.hasScrums ?? false;
  const exceeded = isExceededDate(selectedDate);

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
          onMonthChange={loadMonth}
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
