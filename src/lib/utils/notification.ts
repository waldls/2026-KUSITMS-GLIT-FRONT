import type { Meridiem, TimeValue } from "@/components/my/WheelTimePicker";
import type { AlarmData, DayOfWeek } from "@/types/user/notification";

export type Day = "월" | "화" | "수" | "목" | "금" | "토" | "일";

const DAY_OF_WEEK_TO_DAY: Record<DayOfWeek, Day> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

export const fromNotifyTime = (notifyTime: string): TimeValue => {
  const [h, m] = notifyTime.split(":").map(Number);
  const minute = m as 0 | 30;
  if (h === 0) return { hour: 12, minute, meridiem: "Am" as Meridiem };
  if (h < 12) return { hour: h, minute, meridiem: "Am" as Meridiem };
  if (h === 12) return { hour: 12, minute, meridiem: "Pm" as Meridiem };
  return { hour: h - 12, minute, meridiem: "Pm" as Meridiem };
};

export const fromAlarmData = (data: AlarmData) => ({
  isActive: data.isActive,
  selectedDays: data.daysOfWeek.map(d => DAY_OF_WEEK_TO_DAY[d]),
  time: data.notifyTime
    ? fromNotifyTime(data.notifyTime)
    : ({ hour: 7, minute: 0, meridiem: "Am" } as const satisfies TimeValue),
});
