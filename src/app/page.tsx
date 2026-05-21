"use client";

import Image from "next/image";
import Link from "next/link";

import CTA from "@/components/common/CTA";
import NavigationBar from "@/components/common/NavigationBar";
import NotificationPermission, {
  requestNotificationPermission,
} from "@/components/common/NotificationPermission";
import HeatmapSection from "@/containers/home/HeatmapSection";
import RadarChartSection from "@/containers/home/RadarChartSection";

const page = () => {
  const handleFirstClick = () => {
    if (typeof window === "undefined") return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem("notification_asked")) return;
    localStorage.setItem("notification_asked", "true");
    requestNotificationPermission();
  };

  return (
    <div className="flex h-full w-full flex-col" onClick={handleFirstClick}>
      <NotificationPermission />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-12 pb-6">
        <p className="head-5 pb-3.5 text-center text-white">
          오늘의 경험을 기록하고 <br /> 다솔님의 강점을 확인해보세요
        </p>
        {/* TODO: gif로 추후 수정 */}
        <Image
          src="/images/home/character_home.svg"
          alt="캐릭터"
          width={228}
          height={182}
          loading="eager"
          className="mx-auto block"
        />
        <div className="flex flex-col gap-7 pt-2">
          <Link href="/record/today-task">
            <CTA>기록하러 가기</CTA>
          </Link>
          <div className="flex flex-col gap-8">
            <HeatmapSection />
            <RadarChartSection />
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};

export default page;
