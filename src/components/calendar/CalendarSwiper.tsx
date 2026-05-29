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
  const swiperRef = useRef<SwiperType | null>(null);

  const slideMonths = [
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
    baseMonth,
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
  ];

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const activeSlide = swiper.slides[swiper.activeIndex];
    if (!activeSlide) return;

    swiper.updateAutoHeight(0);

    const ro = new ResizeObserver(() => swiper.updateAutoHeight(0));
    ro.observe(activeSlide);
    return () => ro.disconnect();
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
    swiper.updateAutoHeight(0);
    isResettingRef.current = false;
    onMonthChange?.(nextBaseMonth);
  };

  return (
    <>
      <Swiper
        initialSlide={1}
        speed={250}
        autoHeight
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        onTransitionEnd={handleTransitionEnd}>
        {slideMonths.map((month, i) => (
          <SwiperSlide key={i} style={{ height: "auto", alignSelf: "flex-start" }}>
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
      <div className="mt-4.5 flex items-center gap-1 px-1.5">
        <div className="size-2 rounded-full bg-gray-700" />
        <span className="body-5 text-gray-100">기록 남긴 날</span>
      </div>
    </>
  );
};

export default CalendarSwiper;
