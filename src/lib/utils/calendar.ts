const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

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

export const isFutureDate = (date: Date) => startOfDay(date) > startOfDay(new Date());

export const isExceededDate = (date: Date) => {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 14;
};

export const exceededMatcher = (date: Date) => isExceededDate(date) && !isFutureDate(date);
