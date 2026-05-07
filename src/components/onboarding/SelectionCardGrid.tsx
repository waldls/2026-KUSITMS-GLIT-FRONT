import SelectionCard from "@/components/onboarding/SelectionCard";
import { cn } from "@/lib/utils";

interface SelectionOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
}

interface SelectionCardGridProps {
  options: readonly SelectionOption[];
  value: string;
  onChange: (value: string) => void;
}

const SelectionCardGrid = ({ options, value, onChange }: SelectionCardGridProps) => {
  const isOddTotal = options.length % 2 !== 0;

  return (
    <div className="mx-auto grid w-fit grid-cols-2 gap-3.75">
      {options.map((option, i) => {
        const isLastOdd = isOddTotal && i === options.length - 1;
        return (
          <SelectionCard
            key={option.value}
            icon={option.icon}
            selectedIcon={option.selectedIcon}
            label={option.label}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn("cursor-pointer", isLastOdd && "col-span-2 mx-auto")}
          />
        );
      })}
    </div>
  );
};

export default SelectionCardGrid;
