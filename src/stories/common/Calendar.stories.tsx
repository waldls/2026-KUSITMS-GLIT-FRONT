import type { Meta, StoryObj } from "@storybook/nextjs";
import { CalendarDay, type DayButtonProps, type Modifiers } from "react-day-picker";

import Calendar from "@/components/common/calendar/Calendar";
import DatingDayButton from "@/components/common/calendar/DatingDay";
import DatingMonthNav, { DatingMonthCaption } from "@/components/common/calendar/DatingMonth";
import DatingWeekday from "@/components/common/calendar/DatingWeekday";

const meta = {
  title: "Common/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const april2026 = new Date(2026, 3);
const may2026 = new Date(2026, 4);
const february2026 = new Date(2026, 1);

const calendarDay = new CalendarDay(new Date(2026, 3, 1), april2026);

const createDayProps = (children: string, modifiers: Modifiers = {}): DayButtonProps => ({
  children,
  day: calendarDay,
  modifiers,
});

const Surface = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black p-10 text-white">{children}</div>
);

const MonthPreview = ({ width = "w-82.5" }: { width?: string }) => (
  <section className={`rounded-8 bg-gray-850 relative ${width}`}>
    <DatingMonthNav
      className="h-10"
      previousMonth={new Date(2026, 2)}
      nextMonth={new Date(2026, 4)}
    />
    <div className="flex h-10 w-full items-center justify-center">
      <DatingMonthCaption>4월</DatingMonthCaption>
    </div>
  </section>
);

const DayPreview = () => (
  <div className="rounded-8 bg-gray-850 grid w-fit grid-cols-5 gap-6 p-6">
    <DatingDayButton {...createDayProps("1")} />
    <DatingDayButton {...createDayProps("1", { outside: true })} />
    <DatingDayButton {...createDayProps("1", { selected: true })} />
    <DatingDayButton {...createDayProps("1", { otherSelected: true })} />
    <DatingDayButton {...createDayProps("1", { scrum: true })} />
  </div>
);

const WeekdayPreview = () => (
  <table className="rounded-8 bg-gray-850 w-fit">
    <thead>
      <tr className="grid grid-cols-7 gap-x-5">
        {["일", "월", "화", "수", "목", "금", "토"].map(day => (
          <DatingWeekday key={day} className="w-10 p-3">
            {day}
          </DatingWeekday>
        ))}
      </tr>
    </thead>
  </table>
);

export const DatingMonth: Story = {
  render: () => (
    <Surface>
      <MonthPreview />
    </Surface>
  ),
};

export const DatingDay: Story = {
  render: () => (
    <Surface>
      <DayPreview />
    </Surface>
  ),
};

export const DatingWeekDay: Story = {
  render: () => (
    <Surface>
      <WeekdayPreview />
    </Surface>
  ),
};

export const CalendarFourRows: Story = {
  name: "Calendar (4 lines)",
  args: {
    defaultMonth: february2026,
  },
};

export const CalendarFiveRows: Story = {
  name: "Calendar (5 lines)",
  args: {
    defaultMonth: april2026,
  },
};

export const CalendarSixRows: Story = {
  name: "Calendar (6 lines)",
  args: {
    defaultMonth: may2026,
  },
};

export const AllVariants: Story = {
  name: "All Variant",
  parameters: { layout: "fullscreen" },
  render: () => (
    <Surface>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <p className="body-3 text-offwhite-300">Dating_Month</p>
          <MonthPreview width="w-124" />
        </section>

        <section className="flex flex-col gap-4">
          <p className="body-3 text-offwhite-300">Dating_day</p>
          <DayPreview />
        </section>

        <section className="flex flex-col gap-4">
          <p className="body-3 text-offwhite-300">Dating_weekday</p>
          <WeekdayPreview />
        </section>

        <section className="flex flex-col gap-4">
          <p className="body-3 text-offwhite-300">Calendar 4/5/6 lines</p>
          <div className="flex flex-wrap items-start gap-6">
            <Calendar defaultMonth={february2026} />
            <Calendar defaultMonth={april2026} />
            <Calendar defaultMonth={may2026} />
          </div>
        </section>
      </div>
    </Surface>
  ),
};
