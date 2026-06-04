const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 캘린더·리포트 날짜 키 기준 타임존 (서버 prefetch와 클라이언트 초기값 통일) */
export const DEFAULT_CALENDAR_TIMEZONE = "Asia/Seoul";

export const parseDateKey = (dateKey: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    throw new Error(`Invalid date key format: "${dateKey}"`);
  }
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error(`Invalid date key value: "${dateKey}"`);
  }
  return date;
};

/** 지정 타임존 기준 "오늘"을 로컬 Date(연·월·일)로 반환 */
export const getCalendarDateInTimeZone = (timeZone: string = DEFAULT_CALENDAR_TIMEZONE): Date => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const year = Number(parts.find(part => part.type === "year")?.value);
  const month = Number(parts.find(part => part.type === "month")?.value);
  const day = Number(parts.find(part => part.type === "day")?.value);

  return new Date(year, month - 1, day);
};

export const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// 확정 : "YYYY-MM-DD" 형식의 문자열을 Date 객체로 변환
export const fromDateKeys = (dates: string[]): Date[] =>
  dates.map(d => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day);
  });

export const formatDateTitle = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  return `${month}/${day} (${weekday}) 작업`;
};

export const formatDateShort = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

export const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const parseApiDate = (dateStr: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);

  if (!match) {
    throw new RangeError(`Invalid API date format: ${dateStr}`);
  }

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    throw new RangeError(`Invalid API date value: ${dateStr}`);
  }

  return parsedDate;
};

export const isFutureDate = (date: Date) => startOfDay(date) > startOfDay(new Date());

export const getSelectableRecordDateRange = () => {
  const end = startOfDay(new Date());
  const start = new Date(end);

  start.setDate(end.getDate() - 13);

  return { start, end };
};

export const isWithinSelectableRecordRange = (date: Date) => {
  const { start, end } = getSelectableRecordDateRange();
  const target = startOfDay(date);

  return target >= start && target <= end;
};

export const isExceededDate = (date: Date) => {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 14;
};

export const exceededMatcher = (date: Date) => isExceededDate(date) && !isFutureDate(date);
