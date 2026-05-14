import Calendar from "@/components/calendar/Calendar";
import BottomSheet from "@/components/common/BottomSheet";
import { cn } from "@/lib/utils/cn";

interface CalendarSheetProps {
  isOpen: boolean;
  selectedDate: Date | null;
  scrumDates: Date[];
  doneEnabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSelectDate: (date: Date) => void;
  onScrumDateClick: () => void;
}

const CalendarSheet = ({
  isOpen,
  selectedDate,
  scrumDates,
  doneEnabled,
  onClose,
  onConfirm,
  onSelectDate,
  onScrumDateClick,
}: CalendarSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      text="완료"
      onTextClick={onConfirm}
      textDisabled={!doneEnabled}
      textClassName={cn(doneEnabled && "text-sea-blue-500")}>
      <div className="w-full px-5 pt-2.5 pb-7.5">
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
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
          onScrumDateClick={onScrumDateClick}
          modifiers={{
            otherSelected: new Date(),
            scrum: scrumDates,
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default CalendarSheet;
