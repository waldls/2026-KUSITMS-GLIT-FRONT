"use client";

import HomeRadarSkeleton from "@/components/common/skeleton/HomeRadarSkeleton";
import RadarChart from "@/components/home/RadarChart";
import { useRadarStats } from "@/lib/hooks/home/useHomeQueries";
import { useMe } from "@/lib/hooks/user/userClient";

const RadarChartSection = () => {
  const { data: me } = useMe();
  const { data, isPending } = useRadarStats();

  if (isPending || !data) {
    return <HomeRadarSkeleton />;
  }

  return (
    <div className="bg-card rounded-12 flex w-full flex-col p-4">
      <p className="body-3 text-white">
        <span suppressHydrationWarning>{me?.nickname ?? ""}</span>님의 역량 기록 분포
      </p>
      <div className="flex items-center justify-center">
        <RadarChart data={data} />
      </div>
    </div>
  );
};

export default RadarChartSection;
