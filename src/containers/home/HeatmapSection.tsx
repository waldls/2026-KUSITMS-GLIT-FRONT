"use client";

import "swiper/css";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import HomeHeatmapSkeleton from "@/components/common/skeleton/HomeHeatmapSkeleton";
import SwipeIndicator from "@/components/common/SwipeIndicator";
import Heatmap from "@/components/home/Heatmap";
import { getLastThreeMonths, useCompetencyStatsQueries } from "@/lib/hooks/home/useHomeQueries";

const months = getLastThreeMonths();
const initialIndex = months.length - 1;

const HeatmapSection = () => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const statsQueries = useCompetencyStatsQueries(months);
  const isLoading = statsQueries.some(query => query.isPending);
  const dataList = statsQueries.map(query => query.data ?? null);

  if (isLoading) return <HomeHeatmapSkeleton />;

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
