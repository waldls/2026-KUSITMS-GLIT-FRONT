"use client";

import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

import CalendarSwiper from "@/components/calendar/CalendarSwiper";
import ScrumDatePopover from "@/components/report/ScrumDatePopover";
import { toDateKey } from "@/lib/utils/calendar";
import { getScrumPopoverStyle } from "@/lib/utils/report";
import type { DailySelectableRecord } from "@/types/report/report";

interface StarCalendarSectionProps {
  selectedDate: Date;
  scrumDates: Date[];
  dateRecords: DailySelectableRecord[];
  selectedIds: Set<number>;
  onSelect: (date: Date | undefined) => void;
  onToggle: (id: number) => void;
}

const StarCalendarSection = ({
  selectedDate,
  scrumDates,
  dateRecords,
  selectedIds,
  onSelect,
  onToggle,
}: StarCalendarSectionProps) => {
  const today = new Date();
  const dateKey = toDateKey(selectedDate);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  const [popoverPlacement, setPopoverPlacement] = useState<"top" | "bottom">("top");
  const [popoverActive, setPopoverActive] = useState(false);

  const isPopoverVisible = popoverActive && dateRecords.length > 0;

  useLayoutEffect(() => {
    if (!calendarRef.current || dateRecords.length === 0) return;
    const result = getScrumPopoverStyle(calendarRef.current);
    if (result) {
      setPopoverStyle(result.style);
      setPopoverPlacement(result.placement);
      setPopoverActive(true);
    }
  }, [dateKey, dateRecords.length]);

  return (
    <div className="relative" ref={calendarRef}>
      <CalendarSwiper
        selectedDate={selectedDate}
        today={today}
        scrumDates={scrumDates}
        exceededMatcher={() => false}
        onSelect={onSelect}
        onMonthChange={() => setPopoverActive(false)}
      />
      {isPopoverVisible && (
        <ScrumDatePopover
          key={dateKey}
          scrums={dateRecords}
          selectedIds={selectedIds}
          onToggle={onToggle}
          style={popoverStyle}
          placement={popoverPlacement}
        />
      )}
    </div>
  );
};

export default StarCalendarSection;
