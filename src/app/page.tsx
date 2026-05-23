"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import CTA from "@/components/common/CTA";
import NavigationBar from "@/components/common/NavigationBar";
import NotificationPermission, {
  requestNotificationPermission,
} from "@/components/common/NotificationPermission";
import SpeechBubble from "@/components/home/SpeechBubble";
import HeatmapSection from "@/containers/home/HeatmapSection";
import RadarChartSection from "@/containers/home/RadarChartSection";

const noop = () => () => {};

const Page = () => {
  const isFirstStar = useSyncExternalStore(
    noop,
    () => sessionStorage.getItem("isFirstStar") === "true",
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  const showCalendarGuide = isFirstStar && !dismissed;

  const handleFirstClick = () => {
    if (typeof window === "undefined") return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem("notification_asked")) return;
    localStorage.setItem("notification_asked", "true");
    requestNotificationPermission();
  };

  return (
    <div className="relative flex h-full w-full flex-col" onClick={handleFirstClick}>
      <NotificationPermission />
      {showCalendarGuide ? (
        <button
          type="button"
          aria-label="캘린더 안내 닫기"
          className="absolute inset-0 z-10 bg-gray-900/70"
          onClick={() => setDismissed(true)}
        />
      ) : null}
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
      <NavigationBar
        activeHrefOverride={showCalendarGuide ? "/calendar" : undefined}
        className="z-20 shrink-0"
        calendarOverlay={showCalendarGuide ? <SpeechBubble /> : null}
      />
    </div>
  );
};

export default Page;
