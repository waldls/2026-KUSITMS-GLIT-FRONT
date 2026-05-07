import { cn } from "@/lib/utils";

interface SelectionCardProps {
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const SelectionCard = ({
  icon,
  selectedIcon,
  label,
  selected = false,
  onClick,
  className,
}: SelectionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-16 bg-gray-850 relative flex h-40 w-40 cursor-pointer flex-col items-center justify-start gap-2 pt-3 pb-5 transition-all",
        selected
          ? "border-sea-blue-500 border-[1.6px] opacity-100"
          : "border-[1.6px] border-transparent opacity-[0.76]",
        className,
      )}>
      <div className="relative h-24.75 w-34 overflow-visible [&_img]:h-full [&_img]:w-full [&_svg]:h-full [&_svg]:w-full">
        {selected ? (selectedIcon ?? icon) : icon}
      </div>
      <span className={cn("body-3", selected ? "text-white" : "text-gray-600")}>{label}</span>
    </button>
  );
};

export default SelectionCard;
