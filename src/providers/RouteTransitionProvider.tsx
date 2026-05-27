"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

type Direction = "left" | "right";
type RouteHistoryState = {
  stack: string[];
  index: number;
};

const ROUTE_HISTORY_STORAGE_KEY = "route-transition-history";

const getFallbackHistoryState = (pathname: string): RouteHistoryState => ({
  stack: [pathname],
  index: 0,
});

const isRouteHistoryState = (value: unknown): value is RouteHistoryState => {
  if (!value || typeof value !== "object") return false;
  if (!("stack" in value) || !("index" in value)) return false;

  const { stack, index } = value as RouteHistoryState;

  return (
    Array.isArray(stack) &&
    stack.every(path => typeof path === "string") &&
    typeof index === "number" &&
    Number.isInteger(index) &&
    index >= 0 &&
    index < stack.length
  );
};

const readRouteHistoryState = (pathname: string) => {
  if (typeof window === "undefined") return getFallbackHistoryState(pathname);

  try {
    const stored = window.sessionStorage.getItem(ROUTE_HISTORY_STORAGE_KEY);
    if (!stored) return getFallbackHistoryState(pathname);

    const parsed = JSON.parse(stored) as unknown;
    return isRouteHistoryState(parsed) ? parsed : getFallbackHistoryState(pathname);
  } catch {
    return getFallbackHistoryState(pathname);
  }
};

const writeRouteHistoryState = (state: RouteHistoryState) => {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(ROUTE_HISTORY_STORAGE_KEY, JSON.stringify(state));
};

const resolveRouteTransition = (state: RouteHistoryState, pathname: string) => {
  const currentPath = state.stack[state.index];

  if (currentPath === pathname) {
    return { direction: "right" as Direction, nextState: state };
  }

  const previousPath = state.stack[state.index - 1];
  if (previousPath === pathname) {
    return {
      direction: "left" as Direction,
      nextState: { ...state, index: state.index - 1 },
    };
  }

  const forwardPath = state.stack[state.index + 1];
  if (forwardPath === pathname) {
    return {
      direction: "right" as Direction,
      nextState: { ...state, index: state.index + 1 },
    };
  }

  return {
    direction: "right" as Direction,
    nextState: {
      stack: [...state.stack.slice(0, state.index + 1), pathname],
      index: state.index + 1,
    },
  };
};

const RouteTransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const historyStateRef = useRef<RouteHistoryState>(getFallbackHistoryState(pathname));
  const [animationDirection, setAnimationDirection] = useState<Direction>("right");

  useEffect(() => {
    const historyState = readRouteHistoryState(pathname);

    if (historyState.stack[historyState.index] === pathname) {
      historyStateRef.current = historyState;
      return;
    }

    const { nextState } = resolveRouteTransition(historyState, pathname);

    historyStateRef.current = nextState;
    writeRouteHistoryState(nextState);
  }, [pathname]);

  useLayoutEffect(() => {
    const { direction, nextState } = resolveRouteTransition(historyStateRef.current, pathname);

    historyStateRef.current = nextState;
    writeRouteHistoryState(nextState);
    setAnimationDirection(direction);
  }, [pathname]);

  if (pathname.startsWith("/record/")) return <>{children}</>;

  return (
    <div
      key={pathname}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden",
        animationDirection === "left" ? "animate-slide-in-left" : "animate-slide-in-right",
      )}>
      {children}
    </div>
  );
};

export default RouteTransitionProvider;
