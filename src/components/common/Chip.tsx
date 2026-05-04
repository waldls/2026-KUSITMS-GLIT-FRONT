import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Chip = ({ selected = false, leftIcon, children, className, ...props }: ChipProps) => {
  return (
    <button
      type="button"
      className={cn(
        "body-4 rounded-6 inline-flex w-fit cursor-pointer items-center bg-gray-800 px-2 py-2.5 text-white transition-opacity active:opacity-[0.76]",
        selected ? "opacity-100" : "opacity-30",
        className,
      )}
      {...props}>
      <div className="flex items-center gap-0.75 px-px [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0">
        {leftIcon}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Chip;
