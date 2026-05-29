import type { StaticImageData } from "next/image";
import Image from "next/image";

import { cn } from "@/lib/utils/cn";

interface SelectionCardProps {
  icon?: StaticImageData;
  selectedIcon?: StaticImageData;
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
      <div className="relative h-24.75 w-34 overflow-visible">
        {icon && (
          <Image
            src={icon}
            alt={label}
            fill
            sizes="136px"
            className={cn(
              "object-contain transition-opacity duration-200",
              selected ? "opacity-0" : "opacity-100",
            )}
            priority
          />
        )}
        {selectedIcon && (
          <Image
            src={selectedIcon}
            alt={label}
            fill
            sizes="136px"
            className={cn(
              "object-contain transition-opacity duration-200",
              selected ? "opacity-100" : "opacity-0",
            )}
            priority
          />
        )}
      </div>
      <span className={cn("body-3", selected ? "text-white" : "text-gray-600")}>{label}</span>
    </button>
  );
};

export default SelectionCard;
