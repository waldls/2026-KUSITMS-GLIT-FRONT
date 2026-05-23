export type Meridiem = "Am" | "Pm";

export interface TimeValue {
  hour: number;
  minute: number;
  meridiem: Meridiem;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 30] as const;
const AM_HOURS = [12, 7, 8, 9, 10, 11] as const;

export const MERIDIEMS = ["Am", "Pm"] as const satisfies readonly Meridiem[];

export const getAvailableHours = (meridiem: Meridiem): number[] =>
  meridiem === "Am" ? [...AM_HOURS] : HOURS;

export const getAvailableMinutes = (time: TimeValue): number[] =>
  time.meridiem === "Am" && time.hour === 12 ? [0] : [...MINUTES];

export const normalizeAlarmTime = (time: TimeValue): TimeValue => {
  if (time.meridiem !== "Am") return time;

  if (time.hour === 12 && time.minute === 30) {
    return { ...time, minute: 0 };
  }

  if (time.hour >= 1 && time.hour <= 6) {
    return { hour: 7, minute: 0, meridiem: "Am" };
  }

  return time;
};
