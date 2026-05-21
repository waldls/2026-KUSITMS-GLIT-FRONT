"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CalendarSwiper from "@/components/calendar/CalendarSwiper";
import NavigationBar from "@/components/common/NavigationBar";
import CalendarScrumPreview from "@/containers/calendar/CalendarScrumPreview";
import { CALENDAR_DAILY_PREVIEW_MOCK, CALENDAR_MONTHLY_MOCK } from "@/data/calendar/mock";
import { exceededMatcher, isExceededDate, toDateKey } from "@/lib/utils/calendar";

const scrumDates = CALENDAR_MONTHLY_MOCK.days.filter(d => d.hasScrums).map(d => new Date(d.date));

const Page = () => {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const dateKey = toDateKey(selectedDate);
  const dayData = CALENDAR_MONTHLY_MOCK.days.find(d => d.date === dateKey);
  const hasScrums = dayData?.hasScrums ?? false;
  const exceeded = isExceededDate(selectedDate);
  const previewScrums = CALENDAR_DAILY_PREVIEW_MOCK[dateKey]?.scrums ?? [];

  const handleSelect = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="scrollbar-hide mt-9 flex-1 overflow-y-auto px-4">
        <CalendarSwiper
          selectedDate={selectedDate}
          today={today}
          scrumDates={scrumDates}
          exceededMatcher={exceededMatcher}
          onSelect={handleSelect}
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
