const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

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
