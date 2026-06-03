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

// 7열 사이 6개 gap (gap-x-5.5 = 22px)
const COL_GAP = 22;
// 날짜 그리드 위 고정 영역 높이: 월 캡션(25px) + gap-5(20px) + 요일 헤더(20px) + mt-5(20px) = 85px
const CALENDAR_FIXED_HEIGHT = 85;
// 주 행 사이 간격 (gap-y-5 = 20px)
const ROW_GAP = 20;

function getWeekCount(month: Date): number {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return Math.ceil((firstDay + daysInMonth) / 7);
}

function calcMonthHeight(containerWidth: number, month: Date): number {
  const weeks = getWeekCount(month);
  const cellSize = (containerWidth - 6 * COL_GAP) / 7;
  return Math.ceil(weeks * cellSize + CALENDAR_FIXED_HEIGHT + (weeks - 1) * ROW_GAP);
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
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slideHeights = containerWidth
    ? [
        calcMonthHeight(
          containerWidth,
          new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
        ),
        calcMonthHeight(containerWidth, baseMonth),
        calcMonthHeight(
          containerWidth,
          new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
        ),
      ]
    : null;

  const slideMonths = [
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
    baseMonth,
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
  ];

  const activeHeight = slideHeights?.[1];

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
      <div
        style={
          activeHeight
            ? { height: `${activeHeight}px`, overflow: "hidden", transition: "height 200ms ease" }
            : undefined
        }>
        <Swiper
          initialSlide={1}
          speed={250}
          className="[&_.swiper-wrapper]:!h-auto"
          onTransitionEnd={handleTransitionEnd}>
          {slideMonths.map((month, i) => (
            <SwiperSlide
              key={i}
              style={slideHeights?.[i] != null ? { minHeight: `${slideHeights[i]}px` } : undefined}>
              <Calendar
                type="page"
                mode="single"
                month={month}
                selected={selectedDate}
                onSelect={onSelect}
                modifiers={{
                  calendar: scrumDates,
                  exceeded: exceededMatcher,
                  otherSelected: today,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mt-4.5 flex items-center gap-1 px-1.5">
        <div className="size-2 rounded-full bg-gray-700" />
        <span className="body-5 text-gray-100">기록 남긴 날</span>
      </div>
    </div>
  );
};

export default CalendarSwiper;
