"use client";

import "swiper/css";

import { useLayoutEffect, useRef, useState } from "react";
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
  const [swiperHeight, setSwiperHeight] = useState<number>();
  const isResettingRef = useRef(false);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const slideMonths = [
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
    baseMonth,
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
  ];

  useLayoutEffect(() => {
    if (measureRef.current) {
      setSwiperHeight(measureRef.current.offsetHeight);
    }
  }, [baseMonth]);

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
    <>
      <div className="relative">
        {/* Swiper 외부에서 현재 달 높이 측정 — Swiper CSS 영향 없음 */}
        <div className="pointer-events-none invisible absolute w-full" aria-hidden="true">
          <div ref={measureRef}>
            <Calendar
              type="page"
              mode="single"
              month={baseMonth}
              selected={selectedDate}
              onSelect={() => {}}
              modifiers={{ calendar: scrumDates, exceeded: exceededMatcher, otherSelected: today }}
            />
          </div>
        </div>
        <Swiper
          initialSlide={1}
          speed={250}
          style={{ height: swiperHeight ? `${swiperHeight}px` : undefined }}
          onTransitionEnd={handleTransitionEnd}>
          {slideMonths.map((month, i) => (
            <SwiperSlide key={i} style={{ height: "auto" }}>
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
    </>
  );
};

export default CalendarSwiper;
