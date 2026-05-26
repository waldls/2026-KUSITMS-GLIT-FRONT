import Calendar from "@/components/calendar/Calendar";
import BottomSheet from "@/components/common/BottomSheet";
import { getSelectableRecordDateRange, isWithinSelectableRecordRange } from "@/lib/utils/calendar";
import { cn } from "@/lib/utils/cn";

interface CalendarSheetProps {
  isOpen: boolean;
  selectedDate: Date | null;
  isScrumDate: (date: Date) => boolean;
  isStarDate: (date: Date) => boolean;
  doneEnabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: (month: Date) => void;
  onCalendarDayClick: (date: Date) => void;
}

const CalendarSheet = ({
  isOpen,
  selectedDate,
  isScrumDate,
  isStarDate,
  doneEnabled,
  onClose,
  onConfirm,
  onSelectDate,
  onMonthChange,
  onCalendarDayClick,
}: CalendarSheetProps) => {
  const { start, end } = getSelectableRecordDateRange();
  const canConfirm =
    doneEnabled &&
    selectedDate !== null &&
    isWithinSelectableRecordRange(selectedDate) &&
    !isStarDate(selectedDate);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      height="55vh"
      hideScrollbar
      text="완료"
      onTextClick={onConfirm}
      textDisabled={!canConfirm}
      textClassName={cn(canConfirm && "text-sea-blue-500")}>
      <div className="w-full px-5 pt-2.5 pb-14 sm:pb-7.5">
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          defaultMonth={end}
          className="w-full p-0"
          classNames={{
            root: "w-full",
            months: "relative flex w-full flex-col gap-4 md:flex-row",
            month: "flex w-full flex-col gap-4",
          }}
          onSelect={newDate => {
            if (newDate) {
              onSelectDate(newDate);
            }
          }}
          onMonthChange={onMonthChange}
          onCalendarDayClick={onCalendarDayClick}
          disabled={[{ before: start }, { after: end }]}
          modifiers={{
            otherSelected: new Date(),
            calendar: isScrumDate,
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default CalendarSheet;
