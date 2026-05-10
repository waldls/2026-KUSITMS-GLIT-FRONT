"use client";

import { CheckIcon } from "@/assets/icons";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox = ({ checked = false, disabled = false, onChange, className }: CheckboxProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-[0.8px] transition",
        disabled
          ? "bg-gray-850 cursor-not-allowed border-gray-800 text-gray-800"
          : checked
            ? "border-gray-850 text-sea-blue-900 bg-gray-300"
            : "bg-gray-850 border-gray-800",
        className,
      )}>
      {(checked || disabled) && <CheckIcon className="size-4" />}
    </button>
  );
};

export default Checkbox;
