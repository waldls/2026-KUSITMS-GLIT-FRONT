import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  exceededMatcher,
  formatDateShort,
  formatDateTitle,
  formatMonthKey,
  fromDateKeys,
  isExceededDate,
  isFutureDate,
  isWithinSelectableRecordRange,
  parseDateKey,
  startOfDay,
  toDateKey,
} from "@/lib/utils/calendar";

describe("parseDateKey", () => {
  it("유효한 날짜 문자열을 Date로 변환해야 한다", () => {
    const date = parseDateKey("2026-06-05");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(5);
  });

  it("YYYY-MM-DD 형식이 아니면 오류를 던져야 한다", () => {
    expect(() => parseDateKey("20260605")).toThrow();
    expect(() => parseDateKey("2026/06/05")).toThrow();
    expect(() => parseDateKey("06-05-2026")).toThrow();
    expect(() => parseDateKey("")).toThrow();
  });

  it("존재하지 않는 날짜면 오류를 던져야 한다", () => {
    expect(() => parseDateKey("2026-02-30")).toThrow();
    expect(() => parseDateKey("2026-13-01")).toThrow();
  });
});

describe("formatMonthKey", () => {
  it("Date를 'YYYY-MM' 형식으로 변환해야 한다", () => {
    expect(formatMonthKey(new Date(2026, 0, 1))).toBe("2026-01");
    expect(formatMonthKey(new Date(2026, 11, 31))).toBe("2026-12");
    expect(formatMonthKey(new Date(2026, 5, 5))).toBe("2026-06");
  });

  it("월이 한 자리이면 0으로 패딩해야 한다", () => {
    expect(formatMonthKey(new Date(2026, 8, 1))).toBe("2026-09");
  });
});

describe("toDateKey", () => {
  it("Date를 'YYYY-MM-DD' 형식으로 변환해야 한다", () => {
    expect(toDateKey(new Date(2026, 0, 1))).toBe("2026-01-01");
    expect(toDateKey(new Date(2026, 5, 5))).toBe("2026-06-05");
    expect(toDateKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  it("월·일이 한 자리이면 0으로 패딩해야 한다", () => {
    expect(toDateKey(new Date(2026, 2, 9))).toBe("2026-03-09");
  });
});

describe("fromDateKeys", () => {
  it("날짜 문자열 배열을 Date 배열로 변환해야 한다", () => {
    const result = fromDateKeys(["2026-01-01", "2026-06-05"]);
    expect(result).toHaveLength(2);
    expect(result[0].getFullYear()).toBe(2026);
    expect(result[0].getMonth()).toBe(0);
    expect(result[0].getDate()).toBe(1);
    expect(result[1].getDate()).toBe(5);
  });

  it("빈 배열을 입력하면 빈 배열을 반환해야 한다", () => {
    expect(fromDateKeys([])).toEqual([]);
  });
});

describe("formatDateTitle", () => {
  it("'M/D (요일) 작업' 형식으로 반환해야 한다", () => {
    const thursday = new Date(2026, 5, 4);
    expect(formatDateTitle(thursday)).toBe("6/4 (목) 작업");
  });

  it("월·일을 패딩 없이 반환해야 한다", () => {
    const firstOfJan = new Date(2026, 0, 1);
    expect(formatDateTitle(firstOfJan)).toBe("1/1 (목) 작업");
  });
});

describe("formatDateShort", () => {
  it("'M/D' 형식으로 반환해야 한다", () => {
    expect(formatDateShort(new Date(2026, 5, 5))).toBe("6/5");
    expect(formatDateShort(new Date(2026, 0, 1))).toBe("1/1");
  });
});

describe("isFutureDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 5));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("오늘 이후 날짜는 true를 반환해야 한다", () => {
    expect(isFutureDate(new Date(2026, 5, 6))).toBe(true);
    expect(isFutureDate(new Date(2027, 0, 1))).toBe(true);
  });

  it("오늘은 false를 반환해야 한다", () => {
    expect(isFutureDate(new Date(2026, 5, 5))).toBe(false);
  });

  it("과거 날짜는 false를 반환해야 한다", () => {
    expect(isFutureDate(new Date(2026, 5, 4))).toBe(false);
    expect(isFutureDate(new Date(2025, 0, 1))).toBe(false);
  });
});

describe("isExceededDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 5));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("14일 초과한 과거 날짜는 true를 반환해야 한다", () => {
    expect(isExceededDate(new Date(2026, 4, 20))).toBe(true);
    expect(isExceededDate(new Date(2026, 4, 21))).toBe(true);
  });

  it("딱 14일 전은 false를 반환해야 한다", () => {
    expect(isExceededDate(new Date(2026, 4, 22))).toBe(false);
  });

  it("14일 이내 날짜는 false를 반환해야 한다", () => {
    expect(isExceededDate(new Date(2026, 4, 25))).toBe(false);
    expect(isExceededDate(new Date(2026, 5, 5))).toBe(false);
  });
});

describe("isWithinSelectableRecordRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 5));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("오늘은 범위 내여야 한다", () => {
    expect(isWithinSelectableRecordRange(new Date(2026, 5, 5))).toBe(true);
  });

  it("13일 전은 범위 내여야 한다", () => {
    expect(isWithinSelectableRecordRange(new Date(2026, 4, 23))).toBe(true);
  });

  it("14일 전은 범위 밖이어야 한다", () => {
    expect(isWithinSelectableRecordRange(new Date(2026, 4, 22))).toBe(false);
  });

  it("미래 날짜는 범위 밖이어야 한다", () => {
    expect(isWithinSelectableRecordRange(new Date(2026, 5, 6))).toBe(false);
  });
});

describe("startOfDay", () => {
  it("시분초를 0으로 초기화한 Date를 반환해야 한다", () => {
    const date = new Date(2026, 5, 5, 13, 30, 45, 999);
    const result = startOfDay(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
    expect(result.getDate()).toBe(5);
  });

  it("원본 Date 객체를 변경하지 않아야 한다", () => {
    const original = new Date(2026, 5, 5, 13, 30, 0);
    startOfDay(original);
    expect(original.getHours()).toBe(13);
  });
});

describe("exceededMatcher", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 5));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("14일 초과한 과거 날짜는 true를 반환해야 한다", () => {
    expect(exceededMatcher(new Date(2026, 4, 20))).toBe(true);
  });

  it("미래 날짜는 false를 반환해야 한다 (exceeded이어도)", () => {
    expect(exceededMatcher(new Date(2026, 5, 6))).toBe(false);
  });

  it("14일 이내 날짜는 false를 반환해야 한다", () => {
    expect(exceededMatcher(new Date(2026, 5, 1))).toBe(false);
  });
});
