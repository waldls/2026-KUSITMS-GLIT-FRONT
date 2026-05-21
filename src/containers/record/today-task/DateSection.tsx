import { CalendarIcon, ChevronDownIcon } from "@/assets/icons";
import TextField from "@/components/common/TextField";
import { cn } from "@/lib/utils/cn";

interface DateSectionProps {
  value: string;
  placeholder: string;
  selected: boolean;
  onOpenCalendar: () => void;
}

const DateSection = ({ value, placeholder, selected, onOpenCalendar }: DateSectionProps) => {
  return (
    <div className="mt-5.5 mb-8 flex flex-col gap-2">
      <button
        type="button"
        onClick={onOpenCalendar}
        className="flex w-fit cursor-pointer items-center gap-0.25 text-left">
        <CalendarIcon className="size-5 text-gray-100" />
        <span className="body-2 text-gray-100">날짜</span>
      </button>
      <TextField
        readOnly
        value={value}
        placeholder={placeholder}
        onClick={onOpenCalendar}
        rightIcon={<ChevronDownIcon />}
        onRightIconClick={onOpenCalendar}
        rightIconClassName="text-gray-800"
        wrapperClassName="border-gray-800 has-[input:not(:placeholder-shown):focus]:border-gray-800 has-[input:not(:placeholder-shown):not(:focus)]:border-gray-800"
        className={cn("body-2 cursor-pointer", selected ? "text-gray-100" : "text-gray-800")}
      />
    </div>
  );
};

export default DateSection;
