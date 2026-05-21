"use client";

import "swiper/css";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import Heatmap from "@/components/home/Heatmap";
import HeatmapIndicator from "@/components/home/HeatmapIndicator";
import { type HeatmapData, mockHeatmapDataList } from "@/data/heatmap";

const getCurrentMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getInitialIndex = (dataList: HeatmapData[]) => {
  const currentMonthIndex = dataList.findIndex(
    ({ month }) => month === getCurrentMonthKey(new Date()),
  );

  return currentMonthIndex >= 0 ? currentMonthIndex : dataList.length - 1;
};

const HeatmapSection = () => {
  const initialIndex = getInitialIndex(mockHeatmapDataList);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <div className="flex flex-col gap-2">
      <Swiper
        className="w-full"
        initialSlide={initialIndex}
        loop
        onSlideChange={swiper => setActiveIndex(swiper.realIndex)}>
        {mockHeatmapDataList.map(data => {
          const month = Number(data.month.split("-")[1]);
          return (
            <SwiperSlide key={data.month} className="h-auto!">
              <div className="bg-card rounded-12 flex w-full flex-col gap-4 p-4">
                <p className="body-3 text-white">{month}월 기록 출석부</p>
                <Heatmap data={data} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <HeatmapIndicator total={mockHeatmapDataList.length} current={activeIndex} />
    </div>
  );
};

export default HeatmapSection;
