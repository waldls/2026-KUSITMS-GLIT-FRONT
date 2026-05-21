"use client";

import type React from "react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils/cn";
import { CalendarContext, type CalendarType } from "@/providers/CalendarContext";

import DatingDayButton, { DatingDay } from "./DatingDay";
import DatingMonthNav, { DatingMonthCaption } from "./DatingMonth";
import DatingWeekday from "./DatingWeekday";

export type { CalendarType };
export { CalendarContext };

type CalendarProps =
  React.ComponentProps<typeof DayPicker> extends infer Props
    ? Props extends object
      ? Omit<Props, "captionLayout"> & {
          onScrumDateClick?: (date: Date) => void;
          type?: CalendarType;
        }
      : never
    : never;

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  locale,
  formatters,
  components,
  onScrumDateClick,
  type = "default",
  ...props
}: CalendarProps) => {
  const [monthState, setMonthState] = useState<Date>(
    props.month || props.defaultMonth || new Date(),
  );
  const [direction, setDirection] = useState<"left" | "right" | "">("");

  const currentMonth = props.month || monthState;
  const isPage = type === "page";

  return (
    <CalendarContext.Provider value={type}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        animate={false}
        month={currentMonth}
        onMonthChange={newMonth => {
          setDirection(newMonth < currentMonth ? "left" : "right");
          setMonthState(newMonth);
          props.onMonthChange?.(newMonth);
        }}
        className={cn(
          "body-2 group/calendar rounded-8 p-2 text-white",
          isPage && "w-full p-0",
          className,
        )}
        captionLayout="label"
        locale={locale}
        formatters={{
          formatCaption: date =>
            isPage
              ? `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`
              : `${date.getMonth() + 1}월`,
          formatWeekdayName: date => ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
          ...formatters,
        }}
        classNames={{
          root: cn("max-w-full", isPage ? "w-full" : "w-fit"),
          months: "relative flex w-full flex-col",
          month: cn("flex max-w-full flex-col", isPage ? "w-full gap-5" : "w-fit gap-5"),
          month_caption: isPage
            ? "flex w-full items-center px-1.5"
            : "flex h-6.25 w-full items-center justify-center",
          table: "w-full border-collapse",
          weekdays: cn("grid grid-cols-7", isPage ? "gap-x-5.5" : "gap-x-5"),
          weeks: "flex flex-col mt-5 gap-y-5",
          week: cn("grid w-full grid-cols-7", isPage ? "gap-x-5.5" : "gap-x-5"),
          day: "body-2 p-0 text-center",
          today: "text-white data-[selected=true]:rounded-none",
          outside: "text-gray-600",
          disabled: "text-gray-600",
          hidden: "invisible",
          ...classNames,
        }}
        components={{
          Root: ({ className, rootRef, ...rootProps }) => (
            <div data-slot="calendar" ref={rootRef} className={cn(className)} {...rootProps} />
          ),
          Months: ({ className, ...monthsProps }) => (
            <div
              {...monthsProps}
              key={currentMonth.toISOString()}
              onAnimationEnd={() => setDirection("")}
              className={cn(
                className,
                direction === "left"
                  ? "animate-slide-in-left"
                  : direction === "right"
                    ? "animate-slide-in-right"
                    : "",
              )}
            />
          ),
          Nav: isPage ? () => <></> : DatingMonthNav,
          CaptionLabel: isPage
            ? ({ className: captionClassName, ...captionProps }) => (
                <span
                  className={cn("head-5 text-white select-none", captionClassName)}
                  {...captionProps}
                />
              )
            : DatingMonthCaption,
          Weekday: DatingWeekday,
          Day: DatingDay,
          DayButton: dayButtonProps => {
            if (isPage) {
              return <DatingDayButton {...dayButtonProps} />;
            }

            const stopScrumDateSelection = (event: React.SyntheticEvent<HTMLButtonElement>) => {
              if (!dayButtonProps.modifiers.scrum) return false;
              event.preventDefault();
              event.stopPropagation();
              return true;
            };

            const handleDayButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              if (stopScrumDateSelection(event)) {
                onScrumDateClick?.(dayButtonProps.day.date);
                return;
              }
              dayButtonProps.onClick?.(event);
            };

            return <DatingDayButton {...dayButtonProps} onClick={handleDayButtonClick} />;
          },
          ...components,
        }}
        {...props}
      />
    </CalendarContext.Provider>
  );
};

export default Calendar;
