import Chip from "@/components/common/Chip";
import { cn } from "@/lib/utils/cn";

interface ChipGroupProps {
  title: string;
  options: { label: string; Icon: React.ComponentType }[];
  selectedValue: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

const ChipGroup = ({ title, options, selectedValue, isEditing, onChange }: ChipGroupProps) => (
  <div className="flex flex-col gap-3">
    <p className="body-2 text-gray-300">{title}</p>
    <div className={cn("flex flex-wrap gap-3 p-px", !isEditing && "pointer-events-none")}>
      {options.map(({ label, Icon }) => (
        <Chip
          key={label}
          state={selectedValue === label ? "selected" : isEditing ? "default" : "unselected"}
          leftIcon={<Icon />}
          onClick={() => onChange(label)}>
          {label}
        </Chip>
      ))}
    </div>
  </div>
);

export default ChipGroup;
