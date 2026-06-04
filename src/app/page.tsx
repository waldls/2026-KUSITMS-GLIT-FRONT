"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import characterHome from "@/assets/images/home/character_home.webp";
import characterHomeGlaring from "@/assets/images/home/character_home_glaring.webp";
import glaringBlur from "@/assets/images/home/glaring_blur.png";
import CTA from "@/components/common/CTA";
import NavigationBar from "@/components/common/NavigationBar";
import HomeCharacterSkeleton from "@/components/common/skeleton/HomeCharacterSkeleton";
import HomeGreetingSkeleton from "@/components/common/skeleton/HomeGreetingSkeleton";
import HomeHeatmapSkeleton from "@/components/common/skeleton/HomeHeatmapSkeleton";
import HomeRadarSkeleton from "@/components/common/skeleton/HomeRadarSkeleton";
import SpeechBubble from "@/components/home/SpeechBubble";
import { useInvalidateMe, useMe } from "@/lib/hooks/user/userClient";
import { cn } from "@/lib/utils/cn";

const NotificationPermission = dynamic(() => import("@/components/common/NotificationPermission"), {
  ssr: false,
});

const HeatmapSection = dynamic(() => import("@/containers/home/HeatmapSection"), {
  ssr: false,
  loading: () => <HomeHeatmapSkeleton />,
});

const RadarChartSection = dynamic(() => import("@/containers/home/RadarChartSection"), {
  ssr: false,
  loading: () => <HomeRadarSkeleton />,
});

const noop = () => () => {};

const Page = () => {
  const invalidateMe = useInvalidateMe();
  const { data: me, isPending, isFetching } = useMe();
  const isHeroLoading = !me && (isPending || isFetching);
  const glaring = me?.glaring;
  const characterWidth = 228;
  const characterHeight = glaring ? 188 : 198;
  const [isCharacterLoaded, setIsCharacterLoaded] = useState(false);

  useEffect(() => {
    setIsCharacterLoaded(false);
  }, [glaring]);

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
    if (!("Notification" in window)) return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem("notification_asked")) return;
    localStorage.setItem("notification_asked", "true");
    import("@/components/common/NotificationPermission").then(m =>
      m.requestNotificationPermission(),
    );
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
        <div className="head-5 relative z-10 pb-3.5 text-center text-white">
          {isHeroLoading ? (
            <HomeGreetingSkeleton />
          ) : (
            <>
              오늘의 경험을 기록하고 <br />
              <span suppressHydrationWarning>{me?.nickname ?? ""}</span>
              님의 강점을 확인해보세요
            </>
          )}
        </div>
        {isHeroLoading ? (
          <HomeCharacterSkeleton className="mx-auto" />
        ) : (
          <div
            className="relative mx-auto shrink-0"
            style={{ width: characterWidth, height: characterHeight }}
            aria-busy={!isCharacterLoaded}
            aria-label="캐릭터 로딩 중">
            {!isCharacterLoaded && (
              <HomeCharacterSkeleton glaring={glaring} fill className="absolute inset-0" />
            )}
            {glaring && (
              <Image
                src={glaringBlur}
                alt="blur"
                width={340}
                height={340}
                priority
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-[calc(50%-15px)] left-[calc(50%-20px)] max-w-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200",
                  isCharacterLoaded ? "opacity-100" : "opacity-0",
                )}
                style={{ height: "auto" }}
              />
            )}
            <Image
              src={glaring ? characterHomeGlaring : characterHome}
              alt="캐릭터"
              width={characterWidth}
              height={characterHeight}
              priority
              className={cn(
                "relative z-10 transition-opacity duration-200",
                isCharacterLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setIsCharacterLoaded(true)}
            />
          </div>
        )}
        <div className="flex flex-col gap-7 pt-2">
          <Link href="/record">
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
