"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import characterHome from "@/assets/images/home/character_home.webp";
import characterHomeGlaring from "@/assets/images/home/character_home_glaring.webp";
import glaringBlur from "@/assets/images/home/glaring_blur.png";
import CTA from "@/components/common/CTA";
import NavigationBar from "@/components/common/NavigationBar";
import NotificationPermission, {
  requestNotificationPermission,
} from "@/components/common/NotificationPermission";
import SpeechBubble from "@/components/home/SpeechBubble";
import HeatmapSection from "@/containers/home/HeatmapSection";
import RadarChartSection from "@/containers/home/RadarChartSection";
import { useInvalidateMe, useMe } from "@/lib/hooks/user/userClient";

const noop = () => () => {};

const Page = () => {
  const invalidateMe = useInvalidateMe();
  const { data: me } = useMe();

  useEffect(() => {
    invalidateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isFirstStar = useSyncExternalStore(
    noop,
    () => sessionStorage.getItem("isFirstStar") === "true",
    () => false,
  );
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" && sessionStorage.getItem("calendarGuideDismissed") === "true",
  );
  const showCalendarGuide = isFirstStar && !dismissed;

  const handleDismissCalendarGuide = () => {
    sessionStorage.setItem("calendarGuideDismissed", "true");
    setDismissed(true);
  };

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
          onClick={handleDismissCalendarGuide}
        />
      ) : null}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-12 pb-6">
        <p className="head-5 relative z-10 pb-3.5 text-center text-white">
          오늘의 경험을 기록하고 <br />
          <span suppressHydrationWarning>{me?.nickname ?? ""}</span>
          님의 강점을 확인해보세요
        </p>
        <div className="relative mx-auto w-fit">
          {me?.glaring && (
            <Image
              src={glaringBlur}
              alt="blur"
              width={340}
              height={340}
              aria-hidden
              className="pointer-events-none absolute top-[calc(50%-15px)] left-[calc(50%-20px)] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          )}
          {me?.glaring ? (
            <Image
              src={characterHomeGlaring}
              alt="캐릭터"
              width={228}
              height={188}
              priority
              className="relative z-10"
            />
          ) : (
            <Image
              src={characterHome}
              alt="캐릭터"
              width={228}
              height={198}
              priority
              className="relative z-10"
            />
          )}
        </div>
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
