"use client";

import type React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

import DatingDayButton, { DatingDay } from "./DatingDay";
import DatingMonthNav, { DatingMonthCaption } from "./DatingMonth";
import DatingWeekday from "./DatingWeekday";

type CalendarProps =
  React.ComponentProps<typeof DayPicker> extends infer Props
    ? Props extends object
      ? Omit<Props, "captionLayout">
      : never
    : never;

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  locale,
  formatters,
  components,
  ...props
}: CalendarProps) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn("body-2 group/calendar bg-gray-850 rounded-8 p-2 text-white", className)}
    captionLayout="label"
    locale={locale}
    formatters={{
      formatCaption: date => `${date.getMonth() + 1}월`,
      formatWeekdayName: date => ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
      ...formatters,
    }}
    classNames={{
      root: "w-fit max-w-full",
      months: "relative flex w-fit max-w-full flex-col gap-4 md:flex-row",
      month: "flex w-fit max-w-full flex-col gap-4",
      month_caption: "flex h-6.25 w-full items-center justify-center",
      table: "w-full border-collapse",
      weekdays: "grid grid-cols-7 gap-x-5",
      weeks: "mt-4 flex flex-col gap-y-4",
      week: "grid w-full grid-cols-7 gap-x-5",
      day: "body-2 p-0 text-center",
      today: "text-white data-[selected=true]:rounded-none",
      outside: "text-gray-600",
      disabled: "text-gray-600",
      hidden: "invisible",
      ...classNames,
    }}
    components={{
      Root: ({ className, rootRef, ...props }) => {
        return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
      },
      Nav: DatingMonthNav,
      CaptionLabel: DatingMonthCaption,
      Weekday: DatingWeekday,
      Day: DatingDay,
      DayButton: DatingDayButton,
      ...components,
    }}
    {...props}
  />
);

export default Calendar;
