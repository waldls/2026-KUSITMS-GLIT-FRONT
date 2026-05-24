"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Header from "@/components/common/Header";
import LoadingScreen from "@/components/common/LoadingScreen";
import Modal from "@/components/common/Modal";
import NavigationBar from "@/components/common/NavigationBar";
import { cn } from "@/lib/utils/cn";
import { clearRecordSession } from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";

import DeepLogPage from "./deep-log/page";
import RecordHomePage from "./page";
import SelectSkillsPage from "./select-skills/page";
import SkillTaggingPage from "./skill-tagging/page";
import StarLogPage from "./star-log/page";
import TodayTaskPage from "./today-task/page";

const RECORD_ROUTE_CHANGE_EVENT = "record-route-change";

const navigateRecord = (href: string) => {
  window.history.pushState(window.history.state, "", href);
  window.dispatchEvent(
    new CustomEvent(RECORD_ROUTE_CHANGE_EVENT, {
      detail: {
        pathname: new URL(href, window.location.origin).pathname,
      },
    }),
  );
};

const getAnimationDirection = (prevPathname: string, pathname: string) => {
  const recordRouteOrder = [
    "/record",
    "/record/today-task",
    "/record/deep-log",
    "/record/select-skills",
    "/record/star-log",
    "/record/skill-tagging",
  ] as const;

  const prevIndex = recordRouteOrder.indexOf(prevPathname as (typeof recordRouteOrder)[number]);
  const currentIndex = recordRouteOrder.indexOf(pathname as (typeof recordRouteOrder)[number]);

  if (prevIndex === -1 || currentIndex === -1) return "right";

  return currentIndex < prevIndex ? "left" : "right";
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState(pathname);
  const isRecordHome = currentPathname === "/record";
  const isTodayTask = currentPathname === "/record/today-task";
  const isDeepLog = currentPathname === "/record/deep-log";
  const isSelectSkills = currentPathname === "/record/select-skills";
  const isStarLog = currentPathname === "/record/star-log";
  const isSkillTagging = currentPathname === "/record/skill-tagging";
  const [canGoDeepLog, setCanGoDeepLog] = useState(false);
  const [isTodayTaskDirty, setIsTodayTaskDirty] = useState(false);
  const [isTodayTaskSubmitting, setIsTodayTaskSubmitting] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [starLogTitle, setStarLogTitle] = useState("상황/과제");
  const [isRecordHeaderHidden, setIsRecordHeaderHidden] = useState(false);
  const prevPathnameRef = useRef(currentPathname);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right");

  useLayoutEffect(() => {
    const nextAnimationDirection = getAnimationDirection(prevPathnameRef.current, currentPathname);

    setAnimationDirection(nextAnimationDirection);
    prevPathnameRef.current = currentPathname;
  }, [currentPathname]);

  useEffect(() => {
    const handleRecordRouteChange = (event: Event) => {
      setIsExitModalOpen(false);
      setCurrentPathname((event as CustomEvent<{ pathname: string }>).detail.pathname);
    };
    const handlePopState = () => {
      setIsExitModalOpen(false);
      setCurrentPathname(window.location.pathname);
    };

    window.addEventListener(RECORD_ROUTE_CHANGE_EVENT, handleRecordRouteChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener(RECORD_ROUTE_CHANGE_EVENT, handleRecordRouteChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleTodayTaskReadyChange = (event: Event) => {
      setCanGoDeepLog((event as CustomEvent<boolean>).detail);
    };
    const handleTodayTaskDirtyChange = (event: Event) => {
      setIsTodayTaskDirty((event as CustomEvent<boolean>).detail);
    };

    const handleTodayTaskNavigateComplete = () => {
      setIsTodayTaskSubmitting(false);
    };

    window.addEventListener("today-task-ready-change", handleTodayTaskReadyChange);
    window.addEventListener("today-task-dirty-change", handleTodayTaskDirtyChange);
    window.addEventListener("today-task-navigate-complete", handleTodayTaskNavigateComplete);

    return () => {
      window.removeEventListener("today-task-ready-change", handleTodayTaskReadyChange);
      window.removeEventListener("today-task-dirty-change", handleTodayTaskDirtyChange);
      window.removeEventListener("today-task-navigate-complete", handleTodayTaskNavigateComplete);
    };
  }, []);

  const handleTodayTaskNextClick = () => {
    if (!canGoDeepLog || isTodayTaskSubmitting) return;

    setIsTodayTaskSubmitting(true);

    window.dispatchEvent(
      new CustomEvent("today-task-submit", {
        detail: {
          onSuccess: () => {
            navigateRecord("/record/deep-log");
          },
          onError: () => {
            setIsTodayTaskSubmitting(false);
          },
        },
      }),
    );
  };

  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    useRecordDraftStore.getState().reset();
    clearRecordSession();
    navigateRecord("/record");
  };

  const renderRecordPage = () => {
    switch (currentPathname) {
      case "/record":
        return <RecordHomePage />;
      case "/record/today-task":
        return <TodayTaskPage />;
      case "/record/deep-log":
        return <DeepLogPage />;
      case "/record/select-skills":
        return <SelectSkillsPage />;
      case "/record/star-log":
        return <StarLogPage />;
      case "/record/skill-tagging":
        return <SkillTaggingPage />;
      default:
        return children;
    }
  };

  useEffect(() => {
    const handleRecordTitleChange = (event: Event) => {
      setStarLogTitle((event as CustomEvent<string>).detail);
    };
    const handleRecordHeaderHiddenChange = (event: Event) => {
      setIsRecordHeaderHidden((event as CustomEvent<boolean>).detail);
    };

    window.addEventListener("record-title-change", handleRecordTitleChange);
    window.addEventListener("record-header-hidden-change", handleRecordHeaderHiddenChange);

    return () => {
      window.removeEventListener("record-title-change", handleRecordTitleChange);
      window.removeEventListener("record-header-hidden-change", handleRecordHeaderHiddenChange);
    };
  }, []);

  return (
    <div
      key={currentPathname}
      className={cn(
        "relative flex size-full min-h-0 flex-col overflow-hidden bg-gray-900",
        animationDirection === "left" ? "animate-slide-in-left" : "animate-slide-in-right",
      )}>
      {!((isStarLog && isRecordHeaderHidden) || isSkillTagging) && (
        <Header
          title={
            isRecordHome
              ? "기록하기"
              : isDeepLog
                ? "심화 기록할 작업"
                : isSelectSkills
                  ? "직무 역량 선택"
                  : isStarLog
                    ? starLogTitle
                    : isSkillTagging
                      ? "AI 역량 태깅"
                      : "오늘의 작업"
          }
          rightLabel={isTodayTask ? "다음" : undefined}
          onLeftClick={
            (isTodayTask && isTodayTaskDirty) || isDeepLog || isSelectSkills || isStarLog
              ? () => setIsExitModalOpen(true)
              : undefined
          }
          onRightClick={isTodayTask && canGoDeepLog ? handleTodayTaskNextClick : undefined}
          rightDisabled={isTodayTask && (!canGoDeepLog || isTodayTaskSubmitting)}
          rightLabelClassName={
            isTodayTask && canGoDeepLog && !isTodayTaskSubmitting ? "text-gray-100" : undefined
          }
        />
      )}

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 [-webkit-overflow-scrolling:touch]">
        {renderRecordPage()}
      </main>

      <Modal
        isOpen={(isTodayTask || isDeepLog || isSelectSkills || isStarLog) && isExitModalOpen}
        type="double"
        title="정말 그만두시겠어요?"
        contents="지금 나가면 작성 중인 내용이 없어져요"
        btnLLabel="나가기"
        btnRLabel="머무르기"
        onBtnLClick={handleExitConfirm}
        onBtnRClick={() => setIsExitModalOpen(false)}
        onClose={() => setIsExitModalOpen(false)}
      />

      {isRecordHome && <NavigationBar className="shrink-0" />}

      {isTodayTaskSubmitting && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-gray-900">
          <LoadingScreen className="bg-transparent" />
        </div>
      )}
    </div>
  );
}
