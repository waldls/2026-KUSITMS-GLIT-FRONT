"use client";

import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Header from "@/components/common/Header";
import LoadingScreen from "@/components/common/LoadingScreen";
import Modal from "@/components/common/Modal";
import NavigationBar from "@/components/common/NavigationBar";
import { preloadSkillStoneImages } from "@/constants/skillStoneAssets";
import {
  invalidateCalendar,
  invalidateProjects,
  invalidateSelectableRecords,
} from "@/lib/query/invalidate";
import { cn } from "@/lib/utils/cn";
import { clearCreatedProjectTagIds } from "@/lib/utils/recordCreatedProjectTags";
import { resolveRecordFlowPath } from "@/lib/utils/recordFlowGuard";
import {
  navigateRecord,
  RECORD_ROUTE_CHANGE_EVENT,
  replaceRecordHistory,
} from "@/lib/utils/recordNavigation";
import { clearRecordSession } from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";

import RecordHomePage from "./page";
import TodayTaskPage from "./today-task/page";

const DeepLogPage = dynamic(() => import("./deep-log/page"));
const SelectSkillsPage = dynamic(() => import("./select-skills/page"));
const StarLogPage = dynamic(() => import("./star-log/page"));
const SkillTaggingPage = dynamic(() => import("./skill-tagging/page"));

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

const isRecordFlowPath = (path: string) => path.startsWith("/record/");

const exitsRecordFlow = (path: string) => path === "/record" || !path.startsWith("/record");

const abandonRecordFlow = async (queryClient: QueryClient) => {
  clearCreatedProjectTagIds();
  await Promise.all([
    invalidateProjects(queryClient),
    invalidateCalendar(queryClient),
    invalidateSelectableRecords(queryClient),
  ]);
  useRecordDraftStore.getState().reset();
  clearRecordSession();
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState(pathname);
  const isRecordHome = currentPathname === "/record";
  const isTodayTask = currentPathname === "/record/today-task";
  const isDeepLog = currentPathname === "/record/deep-log";
  const isSelectSkills = currentPathname === "/record/select-skills";
  const isStarLog = currentPathname === "/record/star-log";
  const isSkillTagging = currentPathname === "/record/skill-tagging";
  const [canGoDeepLog, setCanGoDeepLog] = useState(false);
  const isTodayWithExistingRecord = useRecordDraftStore(state => state.isTodayWithExistingRecord);
  const [isTodayTaskDirty, setIsTodayTaskDirty] = useState(false);
  const [isTodayTaskSubmitting, setIsTodayTaskSubmitting] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [starLogTitle, setStarLogTitle] = useState("상황/과제");
  const [isRecordHeaderHidden, setIsRecordHeaderHidden] = useState(false);
  const prevPathnameRef = useRef(currentPathname);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right");
  const [hasRouteTransition, setHasRouteTransition] = useState(false);
  const [hasVisitedTodayTask, setHasVisitedTodayTask] = useState(pathname === "/record/today-task");
  const keepTodayTaskMounted = hasVisitedTodayTask && (isTodayTask || isDeepLog);
  const pageAnimationClass =
    hasRouteTransition &&
    (animationDirection === "left" ? "animate-slide-in-left" : "animate-slide-in-right");

  useEffect(() => {
    if (currentPathname !== "/record") return;

    const prefetchTodayTask = () => {
      void import("./today-task/page");
    };

    const idleCallback = window.requestIdleCallback?.(prefetchTodayTask);
    if (idleCallback !== undefined) {
      return () => window.cancelIdleCallback(idleCallback);
    }

    const timer = window.setTimeout(prefetchTodayTask, 2000);
    return () => window.clearTimeout(timer);
  }, [currentPathname]);

  useEffect(() => {
    if (currentPathname !== "/record/deep-log") return;

    const prefetchSelectSkills = () => {
      void import("./select-skills/page");
      preloadSkillStoneImages();
    };

    const idleCallback = window.requestIdleCallback?.(prefetchSelectSkills);
    if (idleCallback !== undefined) {
      return () => window.cancelIdleCallback(idleCallback);
    }

    const timer = window.setTimeout(prefetchSelectSkills, 500);
    return () => window.clearTimeout(timer);
  }, [currentPathname]);

  useEffect(() => {
    const initialHref = `${window.location.pathname}${window.location.search}`;
    const resolvedInitialHref = resolveRecordFlowPath(initialHref);
    const resolvedInitialPathname = new URL(resolvedInitialHref, window.location.origin).pathname;

    if (resolvedInitialHref !== initialHref) {
      replaceRecordHistory(resolvedInitialHref);
      prevPathnameRef.current = resolvedInitialPathname;
      setCurrentPathname(resolvedInitialPathname);
    }

    const updateCurrentPathname = (nextPathname: string) => {
      const currentHref = `${nextPathname}${window.location.pathname === nextPathname ? window.location.search : ""}`;
      const resolvedHref = resolveRecordFlowPath(currentHref);
      const resolvedPathname = new URL(resolvedHref, window.location.origin).pathname;

      if (resolvedHref !== `${window.location.pathname}${window.location.search}`) {
        replaceRecordHistory(resolvedHref);
      }

      const prevPathname = prevPathnameRef.current;

      setIsExitModalOpen(false);
      setAnimationDirection(getAnimationDirection(prevPathname, resolvedPathname));
      setHasRouteTransition(prevPathname !== resolvedPathname);

      if (isRecordFlowPath(prevPathname) && exitsRecordFlow(resolvedPathname)) {
        setHasVisitedTodayTask(false);
        void (async () => {
          await abandonRecordFlow(queryClient);
        })();
      } else if (resolvedPathname === "/record/today-task") {
        setHasVisitedTodayTask(true);
      }

      prevPathnameRef.current = resolvedPathname;
      setCurrentPathname(resolvedPathname);
    };

    const handlePopState = () => {
      const resolvedHref = resolveRecordFlowPath(
        `${window.location.pathname}${window.location.search}`,
      );

      if (resolvedHref !== `${window.location.pathname}${window.location.search}`) {
        replaceRecordHistory(resolvedHref);
      }

      updateCurrentPathname(new URL(resolvedHref, window.location.origin).pathname);
    };

    const handleRecordRouteChange = (event: Event) => {
      updateCurrentPathname((event as CustomEvent<{ pathname: string }>).detail.pathname);
    };

    window.addEventListener(RECORD_ROUTE_CHANGE_EVENT, handleRecordRouteChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener(RECORD_ROUTE_CHANGE_EVENT, handleRecordRouteChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [queryClient]);

  useEffect(() => {
    if (pathname === currentPathname) return;
    if (pathname !== window.location.pathname) return;

    window.dispatchEvent(
      new CustomEvent(RECORD_ROUTE_CHANGE_EVENT, {
        detail: { pathname },
      }),
    );
  }, [pathname, currentPathname]);

  useEffect(() => {
    return () => {
      if (!isRecordFlowPath(prevPathnameRef.current)) return;
      if (window.location.pathname.startsWith("/record")) return;

      void abandonRecordFlow(queryClient);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!hasRouteTransition) return;

    const timer = window.setTimeout(() => {
      setHasRouteTransition(false);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentPathname, hasRouteTransition]);

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
    if (isTodayTaskSubmitting) return;

    if (isTodayWithExistingRecord) {
      window.dispatchEvent(new CustomEvent("today-task-locked-next-click"));
      return;
    }

    if (!canGoDeepLog) return;

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

    void (async () => {
      const path = window.location.pathname;
      if (isRecordFlowPath(path)) {
        setHasVisitedTodayTask(false);
        await abandonRecordFlow(queryClient);
        navigateRecord("/record");
        return;
      }

      navigateRecord("/record");
    })();
  };

  const renderRecordPage = () => {
    switch (currentPathname) {
      case "/record":
        return <RecordHomePage />;
      case "/record/today-task":
      case "/record/deep-log":
        return (
          <>
            {keepTodayTaskMounted && (
              <div
                className={cn(
                  "flex w-full flex-col",
                  !isTodayTask && "hidden",
                  isTodayTask && pageAnimationClass,
                )}>
                <TodayTaskPage />
              </div>
            )}
            {isDeepLog && (
              <div className={cn("flex min-h-0 flex-1 flex-col", pageAnimationClass)}>
                <DeepLogPage />
              </div>
            )}
          </>
        );
      case "/record/select-skills":
        return (
          <div className={cn("flex min-h-0 flex-1 flex-col", pageAnimationClass)}>
            <SelectSkillsPage />
          </div>
        );
      case "/record/star-log":
        return (
          <div className={cn("flex min-h-0 flex-1 flex-col", pageAnimationClass)}>
            <StarLogPage />
          </div>
        );
      case "/record/skill-tagging":
        return (
          <div className={cn("flex min-h-0 flex-1 flex-col", pageAnimationClass)}>
            <SkillTaggingPage />
          </div>
        );
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
    <div className="relative flex size-full min-h-0 flex-col overflow-hidden bg-gray-900">
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
          leftIcon={isRecordHome ? null : undefined}
          onLeftClick={
            (isTodayTask && isTodayTaskDirty) || isDeepLog || isSelectSkills || isStarLog
              ? () => setIsExitModalOpen(true)
              : undefined
          }
          onRightClick={isTodayTask ? handleTodayTaskNextClick : undefined}
          rightDisabled={
            isTodayTask && !isTodayWithExistingRecord && (!canGoDeepLog || isTodayTaskSubmitting)
          }
          rightLabelClassName={
            isTodayTask && !isTodayWithExistingRecord && canGoDeepLog && !isTodayTaskSubmitting
              ? "text-sea-blue-500"
              : undefined
          }
        />
      )}

      <main className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-5 [-webkit-overflow-scrolling:touch]">
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
