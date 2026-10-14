import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getHeatmapMonths } from "@/lib/hooks/home/useHomeQueries";

const setToday = (date: string) => vi.setSystemTime(new Date(`${date}T12:00:00`));

describe("getHeatmapMonths", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("가입 월에 접속하면 가입 월만 노출해야 한다", () => {
    setToday("2026-05-20");
    expect(getHeatmapMonths("2026-05-18")).toEqual(["2026-05"]);
  });

  it("가입 다음 달에 접속하면 2개월을 노출해야 한다", () => {
    setToday("2026-06-01");
    expect(getHeatmapMonths("2026-05-18")).toEqual(["2026-05", "2026-06"]);
  });

  it("가입 후 2개월이 지나면 3개월을 노출해야 한다", () => {
    setToday("2026-07-10");
    expect(getHeatmapMonths("2026-05-18")).toEqual(["2026-05", "2026-06", "2026-07"]);
  });

  it("3개월을 초과하면 최근 3개월만 노출해야 한다", () => {
    setToday("2026-08-10");
    expect(getHeatmapMonths("2026-05-18")).toEqual(["2026-06", "2026-07", "2026-08"]);
  });

  it("연도가 바뀌어도 월 차이를 올바르게 계산해야 한다", () => {
    setToday("2027-01-05");
    expect(getHeatmapMonths("2026-12-30")).toEqual(["2026-12", "2027-01"]);
  });

  it("joinedAt이 없으면 최근 3개월을 노출해야 한다", () => {
    setToday("2026-10-02");
    expect(getHeatmapMonths(undefined)).toEqual(["2026-08", "2026-09", "2026-10"]);
  });
});
