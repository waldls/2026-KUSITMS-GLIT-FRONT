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
          onCalendarDayClick?: (date: Date) => void;
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
  onCalendarDayClick,
  type = "default",
  onMonthChange,
  month: monthProp,
  defaultMonth,
  ...props
}: CalendarProps) => {
  const [monthState, setMonthState] = useState<Date>(monthProp || defaultMonth || new Date());
  const [direction, setDirection] = useState<"left" | "right" | "">("");

  const currentMonth = monthProp || monthState;
  const isPage = type === "page";

  const handleMonthChange = (newMonth: Date) => {
    setDirection(newMonth < currentMonth ? "left" : "right");
    setMonthState(newMonth);
    onMonthChange?.(newMonth);
  };

  return (
    <CalendarContext.Provider value={type}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        animate={false}
        defaultMonth={defaultMonth}
        month={currentMonth}
        onMonthChange={handleMonthChange}
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
            : "pointer-events-none flex h-6.25 w-full items-center justify-center",
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

            const handleDayButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              const {
                calendar: hasScrum,
                recordLocked,
                disabled: isDisabled,
              } = dayButtonProps.modifiers;

              if (isDisabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
              }

              if ((hasScrum || recordLocked) && onCalendarDayClick) {
                event.preventDefault();
                event.stopPropagation();
                onCalendarDayClick(dayButtonProps.day.date);
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
