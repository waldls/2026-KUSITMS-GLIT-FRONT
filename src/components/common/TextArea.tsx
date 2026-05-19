"use client";

import { forwardRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

interface TextAreaProps {
  className?: string;
  placeholder?: string;
  maxLength?: number;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, placeholder, maxLength = 300, value, defaultValue, disabled, onChange }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const count = value !== undefined ? value.length : internalValue.length;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value.slice(0, maxLength);
      if (value === undefined) setInternalValue(val);
      onChange?.(val);
    };

    return (
      <div
        className={cn(
          "rounded-6 bg-gray-850 flex h-50.25 w-full flex-col justify-between p-4",
          className,
        )}>
        <textarea
          ref={ref}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          onChange={handleChange}
          className="body-2 h-34.5 w-full resize-none overflow-y-auto bg-transparent text-gray-200 caret-white outline-none [scrollbar-width:none] placeholder:text-gray-800 [&::-webkit-scrollbar]:hidden"
        />
        <div className="flex justify-end">
          <span className="body-5 text-gray-700">
            {count}/{maxLength}
          </span>
        </div>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
