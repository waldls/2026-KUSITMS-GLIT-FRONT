import { type Meridiem, normalizeAlarmTime, type TimeValue } from "@/lib/utils/alarmTime";
import type { AlarmData, DayOfWeek } from "@/types/user/notification";

export type Day = "월" | "화" | "수" | "목" | "금" | "토" | "일";

const DAY_TO_DAY_OF_WEEK: Record<Day, DayOfWeek> = {
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
  일: "SUN",
};

export const toNotifyTime = (time: TimeValue): string => {
  const normalizedTime = normalizeAlarmTime(time);
  let h = normalizedTime.hour;

  if (normalizedTime.meridiem === "Am") {
    h = h === 12 ? 0 : h;
  } else {
    h = h === 12 ? 12 : h + 12;
  }

  return `${String(h).padStart(2, "0")}:${String(normalizedTime.minute).padStart(2, "0")}`;
};

export const toAlarmData = (settings: {
  isActive: boolean;
  selectedDays: Day[];
  time: TimeValue;
}): AlarmData => ({
  isActive: settings.isActive,
  daysOfWeek: settings.selectedDays.map(d => DAY_TO_DAY_OF_WEEK[d]),
  notifyTime: toNotifyTime(settings.time),
});

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

  if (h === 0) {
    return normalizeAlarmTime({ hour: 12, minute, meridiem: "Am" as Meridiem });
  }

  if (h < 12) {
    return normalizeAlarmTime({ hour: h, minute, meridiem: "Am" as Meridiem });
  }

  if (h === 12) {
    return normalizeAlarmTime({ hour: 12, minute, meridiem: "Pm" as Meridiem });
  }

  return normalizeAlarmTime({ hour: h - 12, minute, meridiem: "Pm" as Meridiem });
};

export const fromAlarmData = (data: AlarmData) => ({
  isActive: data.isActive,
  selectedDays: data.daysOfWeek.map(d => DAY_OF_WEEK_TO_DAY[d]),
  time: data.notifyTime
    ? fromNotifyTime(data.notifyTime)
    : ({ hour: 7, minute: 0, meridiem: "Am" } as const satisfies TimeValue),
});
