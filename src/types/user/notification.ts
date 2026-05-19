export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type AlarmData = {
  isActive: boolean;
  daysOfWeek: DayOfWeek[];
  notifyTime: string;
};
