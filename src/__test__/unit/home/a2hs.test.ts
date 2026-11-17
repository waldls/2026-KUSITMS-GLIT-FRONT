import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  A2HS_INTERVAL_MS,
  countA2hsVisit,
  markA2hsShown,
  saveA2hsHasRecord,
  shouldShowA2hs,
} from "@/lib/utils/a2hs";

// 새 세션(앱을 다시 연 상황)
const newSession = () => window.sessionStorage.clear();

const setStandalone = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
};

describe("shouldShowA2hs", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    setStandalone(false);
  });

  it("첫 홈 진입에는 노출하지 않는다", () => {
    countA2hsVisit();
    expect(shouldShowA2hs()).toBe(false);
  });

  it("같은 세션에서 홈에 다시 와도 진입 횟수가 늘지 않는다", () => {
    countA2hsVisit();
    countA2hsVisit();
    expect(shouldShowA2hs()).toBe(false);
  });

  it("두 번째 홈 진입에 노출한다", () => {
    countA2hsVisit();
    newSession();
    countA2hsVisit();
    expect(shouldShowA2hs()).toBe(true);
  });

  it("첫 기록 저장 후에는 첫 진입 세션에서도 노출한다", () => {
    countA2hsVisit();
    saveA2hsHasRecord();
    expect(shouldShowA2hs()).toBe(true);
  });

  it("standalone이면 노출하지 않는다", () => {
    saveA2hsHasRecord();
    setStandalone(true);
    expect(shouldShowA2hs()).toBe(false);
  });

  it("노출한 세션에서는 다시 노출하지 않는다", () => {
    saveA2hsHasRecord();
    markA2hsShown();
    expect(shouldShowA2hs()).toBe(false);
  });

  it("마지막 노출 후 72시간이 지나야 다시 노출한다", () => {
    const shownAt = 1_000_000;
    saveA2hsHasRecord();
    markA2hsShown(shownAt);
    newSession();

    expect(shouldShowA2hs(shownAt + A2HS_INTERVAL_MS - 1)).toBe(false);
    expect(shouldShowA2hs(shownAt + A2HS_INTERVAL_MS)).toBe(true);
  });

  it("같은 세션에서 다시 열려도 노출 횟수는 한 번만 센다", () => {
    saveA2hsHasRecord();
    markA2hsShown(0);
    markA2hsShown(0);

    expect(window.localStorage.getItem("a2hsShownCount")).toBe("1");
  });

  it("최대 3회까지만 노출한다", () => {
    saveA2hsHasRecord();
    let now = 0;
    for (let i = 0; i < 3; i++) {
      newSession();
      now += A2HS_INTERVAL_MS;
      expect(shouldShowA2hs(now)).toBe(true);
      markA2hsShown(now);
    }

    newSession();
    expect(shouldShowA2hs(now + A2HS_INTERVAL_MS)).toBe(false);
  });
});
