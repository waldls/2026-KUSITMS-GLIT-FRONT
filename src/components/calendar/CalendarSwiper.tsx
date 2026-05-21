"use client";

import "swiper/css";

import { useState } from "react";
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
}

const CalendarSwiper = ({
  selectedDate,
  today,
  scrumDates,
  exceededMatcher,
  onSelect,
}: CalendarSwiperProps) => {
  const [baseMonth, setBaseMonth] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth()),
  );

  const slideMonths = [
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
    baseMonth,
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
  ];

  const handleTransitionEnd = (swiper: SwiperType) => {
    if (swiper.activeIndex === 1) return;
    const delta = swiper.activeIndex === 0 ? -1 : 1;
    flushSync(() => {
      setBaseMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta));
    });
    swiper.slideTo(1, 0, false);
  };

  return (
    <>
      <Swiper initialSlide={1} speed={250} onTransitionEnd={handleTransitionEnd}>
        {slideMonths.map((month, i) => (
          <SwiperSlide key={i}>
            <Calendar
              type="page"
              mode="single"
              month={month}
              selected={selectedDate}
              onSelect={onSelect}
              modifiers={{ scrum: scrumDates, exceeded: exceededMatcher, otherSelected: today }}
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
