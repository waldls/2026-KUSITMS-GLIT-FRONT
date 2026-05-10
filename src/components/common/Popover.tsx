import { cn } from "@/lib/utils/cn";

export type PopoverItem = {
  label: string;
  dotColor?: string;
  selected?: boolean;
  onClick?: () => void;
};

interface PopoverProps {
  items: PopoverItem[];
  className?: string;
}

const Popover = ({ items, className }: PopoverProps) => {
  return (
    <div className={cn("rounded-8 bg-gray-850 flex w-37.5 flex-col gap-1 px-1.5 py-2", className)}>
      {items.map(item => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          className={cn(
            "rounded-6 flex w-full cursor-pointer items-center gap-2.5 px-2 py-1 text-left",
            item.selected ? "bg-gray-900" : "bg-transparent",
          )}>
          {item.dotColor && (
            <span
              className="block size-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.dotColor }}
            />
          )}
          <span className={cn("body-2", item.selected ? "text-gray-100" : "text-gray-600")}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Popover;
