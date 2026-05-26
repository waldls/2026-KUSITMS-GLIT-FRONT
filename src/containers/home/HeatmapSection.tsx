"use client";

import "swiper/css";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import SwipeIndicator from "@/components/common/SwipeIndicator";
import Heatmap from "@/components/home/Heatmap";
import { getCompetencyStats } from "@/lib/apis/home/home";
import type { MonthlyGrassData } from "@/types/home/home";

const getLastThreeMonths = (): string[] => {
  const now = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
};

const months = getLastThreeMonths();
const initialIndex = months.length - 1;

const HeatmapSection = () => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [dataList, setDataList] = useState<(MonthlyGrassData | null)[] | null>(null);

  useEffect(() => {
    Promise.all(months.map(month => getCompetencyStats(month).catch(() => null))).then(setDataList);
  }, []);

  if (!dataList) return null;

  return (
    <div className="flex flex-col gap-2">
      <Swiper
        className="w-full"
        initialSlide={initialIndex}
        loop
        onSlideChange={swiper => setActiveIndex(swiper.realIndex)}>
        {months.map((month, i) => {
          const monthNum = Number(month.split("-")[1]);
          const data = dataList[i];
          return (
            <SwiperSlide key={month} className="h-auto!">
              <div className="bg-card rounded-12 flex w-full flex-col gap-4 p-4">
                <p className="body-3 text-white">{monthNum}월 기록 출석부</p>
                {data && <Heatmap data={data} />}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <SwipeIndicator total={months.length} current={activeIndex} />
    </div>
  );
};

export default HeatmapSection;
