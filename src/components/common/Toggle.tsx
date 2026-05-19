"use client";

import { cn } from "@/lib/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Toggle = ({ checked, onChange }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative h-7.5 w-12 rounded-full transition-colors",
      checked ? "bg-sea-blue-600" : "bg-gray-300",
    )}>
    <span
      className={cn(
        "absolute top-1 size-5.5 rounded-full bg-white transition-[left]",
        checked ? "left-5.25" : "left-1.25",
      )}
    />
  </button>
);

export default Toggle;
