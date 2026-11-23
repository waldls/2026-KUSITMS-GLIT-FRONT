"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import characterHome from "@/assets/images/home/character_home.webp";
import characterHomeGlaring from "@/assets/images/home/character_home_glaring.webp";
import glaringBlur from "@/assets/images/home/glaring_blur.png";
import CTA from "@/components/common/CTA";
import Modal from "@/components/common/Modal";
import NavigationBar from "@/components/common/NavigationBar";
import HomeCharacterSkeleton from "@/components/common/skeleton/HomeCharacterSkeleton";
import HomeGreetingSkeleton from "@/components/common/skeleton/HomeGreetingSkeleton";
import HomeHeatmapSkeleton from "@/components/common/skeleton/HomeHeatmapSkeleton";
import HomeRadarSkeleton from "@/components/common/skeleton/HomeRadarSkeleton";
import SpeechBubble from "@/components/home/SpeechBubble";
import A2hsSheet from "@/containers/home/A2hsSheet";
import { useInvalidateMe, useMe } from "@/lib/hooks/user/userClient";
import { countA2hsVisit, markA2hsShown, shouldShowA2hs } from "@/lib/utils/a2hs";
import {
  dismissCalendarGuide,
  getIsFirstStar,
  hasDismissedCalendarGuide,
} from "@/lib/utils/calendarGuide";
import { cn } from "@/lib/utils/cn";
import { shouldAskNotification } from "@/lib/utils/notification";
import {
  consumePendingReportModal,
  subscribePendingReportModal,
} from "@/lib/utils/recordReportModal";
import type { ReportModalType } from "@/types/record/record";

const NotificationPermission = dynamic(() => import("@/components/common/NotificationPermission"), {
  ssr: false,
});

const NotificationModal = dynamic(() => import("@/containers/home/NotificationModal"), {
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
  const router = useRouter();
  const invalidateMe = useInvalidateMe();
  const { data: me, isPending, isFetching } = useMe();
  const isHeroLoading = !me && (isPending || isFetching);
  const glaring = me?.glaring;
  const characterWidth = 228;
  const characterHeight = glaring ? 188 : 198;
  const [isCharacterLoaded, setIsCharacterLoaded] = useState(false);
  const [reportModalType, setReportModalType] = useState<ReportModalType | null>(null);

  useEffect(() => {
    setIsCharacterLoaded(false);
  }, [glaring]);

  useEffect(() => {
    invalidateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const showPendingReportModal = () => {
      const pendingReportModalType = consumePendingReportModal();
      if (pendingReportModalType) setReportModalType(pendingReportModalType);
    };

    showPendingReportModal();

    return subscribePendingReportModal(showPendingReportModal);
  }, []);
  const isFirstStar = useSyncExternalStore(noop, getIsFirstStar, () => false);
  const [dismissed, setDismissed] = useState(hasDismissedCalendarGuide);
  const showCalendarGuide = isFirstStar && !dismissed;

  const [canShowA2hs, setCanShowA2hs] = useState(false);
  // 리포트 모달이 닫힌 뒤 노출
  const isA2hsOpen = canShowA2hs && reportModalType === null;

  useEffect(() => {
    countA2hsVisit();
    setCanShowA2hs(shouldShowA2hs());
  }, []);

  useEffect(() => {
    if (isA2hsOpen) markA2hsShown();
  }, [isA2hsOpen]);

  const [canAskNotification, setCanAskNotification] = useState(false);

  useEffect(() => {
    setCanAskNotification(shouldAskNotification());
  }, []);

  const handleDismissCalendarGuide = () => {
    dismissCalendarGuide();
    setDismissed(true);
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <NotificationPermission />
      {showCalendarGuide ? (
        <button
          type="button"
          aria-label="캘린더 안내 닫기"
          className="absolute inset-0 z-10 bg-gray-900/70"
          onClick={handleDismissCalendarGuide}
        />
      ) : null}
      {/* isolate: 내부 z-10 요소(슬로건·캐릭터)가 딤 위로 올라오지 않도록 */}
      <div className="scrollbar-hide isolate flex-1 overflow-y-auto px-5 pt-12 pb-6">
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
        // 가이드 중엔 nav 스태킹을 풀어 캘린더 탭만 딤 위로 올림
        className={cn("shrink-0", !showCalendarGuide && "z-20")}
        calendarOverlay={showCalendarGuide ? <SpeechBubble /> : null}
      />
      <A2hsSheet isOpen={isA2hsOpen} onClose={() => setCanShowA2hs(false)} />
      {canAskNotification && (
        <NotificationModal
          isOpen={reportModalType === null}
          onClose={() => setCanAskNotification(false)}
        />
      )}
      <Modal
        isOpen={reportModalType !== null}
        type="double"
        title={
          reportModalType === "MINI"
            ? "커리어 미니 리포트를 발행해보세요"
            : "커리어 리포트를 발행해보세요"
        }
        contents={
          <>
            지금까지 쌓인 기록으로 만들어진
            <br />
            커리어 {reportModalType === "MINI" ? "미니 " : ""}리포트를 확인해보세요
          </>
        }
        btnLLabel="다음에 보기"
        btnRLabel="리포트 만들기"
        onBtnLClick={() => setReportModalType(null)}
        onBtnRClick={() => router.push("/report")}
        onClose={() => setReportModalType(null)}
        contentClassName="px-7 py-5"
        btnLClassName="px-5"
        btnRClassName="px-5"
      />
    </div>
  );
};

export default Page;
