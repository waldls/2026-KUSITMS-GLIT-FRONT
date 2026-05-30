"use client";

import "swiper/css";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Calendar from "@/components/calendar/Calendar";

interface CalendarSwiperProps {
  selectedDate: Date;
  today: Date;
  scrumDates: Date[];
  exceededMatcher: (date: Date) => boolean;
  onSelect: (date: Date | undefined) => void;
  onMonthChange?: (date: Date) => void;
}

// gap-x-5.5 = 22px (6 gaps)
// caption(head-5: 18*1.4=25.2) + gap-5(20) + weekday(body-5: 12*1.65=19.8) + mt-5(20) + 5*gap-y-5(100)
const CALENDAR_NON_CELL_HEIGHT = 185;
const COL_GAP = 22;

function calcSixWeekHeight(containerWidth: number) {
  const cellHeight = (containerWidth - 6 * COL_GAP) / 7;
  return Math.ceil(6 * cellHeight + CALENDAR_NON_CELL_HEIGHT);
}

const CalendarSwiper = ({
  selectedDate,
  today,
  scrumDates,
  exceededMatcher,
  onSelect,
  onMonthChange,
}: CalendarSwiperProps) => {
  const [baseMonth, setBaseMonth] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth()),
  );
  const isResettingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideHeight, setSlideHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSlideHeight(calcSixWeekHeight(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slideMonths = [
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
    baseMonth,
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
  ];

  const handleTransitionEnd = (swiper: SwiperType) => {
    if (isResettingRef.current || swiper.activeIndex === 1) return;
    const delta = swiper.activeIndex === 0 ? -1 : 1;
    const nextBaseMonth = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + delta);

    isResettingRef.current = true;
    flushSync(() => {
      setBaseMonth(nextBaseMonth);
    });
    swiper.slideTo(1, 0, false);
    isResettingRef.current = false;
    onMonthChange?.(nextBaseMonth);
  };

  return (
    <div ref={containerRef}>
      <Swiper
        initialSlide={1}
        speed={250}
        className="[&_.swiper-wrapper]:!h-auto"
        onTransitionEnd={handleTransitionEnd}>
        {slideMonths.map((month, i) => (
          <SwiperSlide key={i} style={slideHeight ? { minHeight: `${slideHeight}px` } : undefined}>
            <Calendar
              type="page"
              mode="single"
              month={month}
              selected={selectedDate}
              onSelect={onSelect}
              fixedWeeks
              modifiers={{
                calendar: scrumDates,
                exceeded: exceededMatcher,
                otherSelected: today,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4.5 flex items-center gap-1 px-1.5">
        <div className="size-2 rounded-full bg-gray-700" />
        <span className="body-5 text-gray-100">기록 남긴 날</span>
      </div>
    </div>
  );
};

export default CalendarSwiper;
