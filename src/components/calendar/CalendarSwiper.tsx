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
  const swiperRef = useRef<SwiperType | null>(null);
  const slideContentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const slideMonths = [
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
    baseMonth,
    new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
  ];

  const updateHeight = (index = swiperRef.current?.activeIndex ?? 1) => {
    const target = slideContentRefs.current[index];

    if (!target) return;

    setSwiperHeight(Math.ceil(target.getBoundingClientRect().height));
  };

  useLayoutEffect(() => {
    updateHeight(1);

    const target = slideContentRefs.current[1];
    if (!target) return;

    const observer = new ResizeObserver(() => updateHeight(1));
    observer.observe(target);

    return () => observer.disconnect();
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
    requestAnimationFrame(() => updateHeight(1));
    isResettingRef.current = false;
    onMonthChange?.(nextBaseMonth);
  };

  return (
    <>
      <Swiper
        initialSlide={1}
        speed={250}
        onSwiper={swiper => {
          swiperRef.current = swiper;
          requestAnimationFrame(() => updateHeight(swiper.activeIndex));
        }}
        onSlideChange={swiper => updateHeight(swiper.activeIndex)}
        onTransitionEnd={handleTransitionEnd}
        style={{
          height: swiperHeight ? `${swiperHeight}px` : undefined,
          transition: "height 250ms ease",
        }}>
        {slideMonths.map((month, i) => (
          <SwiperSlide key={i}>
            <div ref={element => void (slideContentRefs.current[i] = element)}>
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
            </div>
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
