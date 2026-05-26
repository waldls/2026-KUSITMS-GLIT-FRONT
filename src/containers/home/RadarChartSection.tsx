"use client";

import { useEffect, useState } from "react";

import RadarChart from "@/components/home/RadarChart";
import { getRadar } from "@/lib/apis/home/home";
import { useMe } from "@/lib/hooks/user/userClient";
import type { ActivityStatsData } from "@/types/home/home";

const emptyData: ActivityStatsData = {
  min: 0,
  max: 0,
  categories: {
    DISCOVERY_ANALYSIS: 0,
    PLANNING_EXECUTION: 0,
    COLLABORATION: 0,
    PROBLEM_SOLVING: 0,
    REFLECTION_GROWTH: 0,
  },
};

const RadarChartSection = () => {
  const { data: me } = useMe();
  const [data, setData] = useState<ActivityStatsData | null>(null);

  useEffect(() => {
    getRadar().then(res => {
      if (res) setData(res);
    });
  }, []);

  return (
    <div className="bg-card rounded-12 flex w-full flex-col p-4">
      <p className="body-3 text-white">
        <span suppressHydrationWarning>{me?.nickname ?? ""}</span>님의 역량 기록 분포
      </p>
      <div className="flex items-center justify-center">
        <RadarChart data={data ?? emptyData} />
      </div>
    </div>
  );
};

export default RadarChartSection;
