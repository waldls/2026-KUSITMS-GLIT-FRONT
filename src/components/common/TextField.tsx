import React, { forwardRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

type TextFieldVariant = "default" | "error";

const WRAPPER_VARIANT_STYLES: Record<TextFieldVariant, string> = {
  default:
    "border-gray-800 has-[input:not(:placeholder-shown):focus]:border-gray-300 has-[input:not(:placeholder-shown):not(:focus)]:border-gray-500",
  error: "border-error-primary",
};

const TEXTFIELD_VARIANT_STYLES: Record<TextFieldVariant, string> = {
  default: "text-gray-500 focus:text-gray-300 placeholder:text-gray-800",
  error: "text-gray-300 placeholder:text-gray-500",
};

export interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "color"
> {
  variant?: TextFieldVariant;
  rightIcon?: React.ReactNode;
  rightIconClassName?: string;
  onRightIconClick?: () => void;
  wrapperClassName?: string;
  errorMessage?: string;
  showCount?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      variant = "default",
      rightIcon,
      rightIconClassName,
      onRightIconClick,
      wrapperClassName,
      errorMessage,
      showCount,
      className,
      id,
      maxLength,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const errorId = variant === "error" && errorMessage && id ? `${id}-error` : undefined;
    const [internalCount, setInternalCount] = useState(
      typeof value === "string" ? value.length : 0,
    );
    const count = value !== undefined ? String(value).length : internalCount;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maxLength !== undefined && e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
      }
      setInternalCount(e.target.value.length);
      onChange?.(e);
    };

    const hasBottom =
      (variant === "error" && !!errorMessage) || (showCount && maxLength !== undefined);

    return (
      <div className="mx-auto flex w-full flex-col">
        <div
          className={cn(
            "relative flex w-full items-center border-b-[1.6px] pb-1.5 transition-colors",
            WRAPPER_VARIANT_STYLES[variant],
            wrapperClassName,
          )}>
          <input
            ref={ref}
            id={id}
            maxLength={maxLength}
            value={value}
            aria-invalid={variant === "error" ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              "body-2 w-full bg-transparent outline-none",
              TEXTFIELD_VARIANT_STYLES[variant],
              className,
            )}
            onChange={handleChange}
            {...props}
          />
          {rightIcon && (
            <div
              className={cn(
                "ml-2 flex shrink-0 items-center [&_svg]:size-6",
                onRightIconClick && "cursor-pointer",
                rightIconClassName ?? "text-white",
              )}
              onClick={onRightIconClick}>
              {rightIcon}
            </div>
          )}
        </div>
        {hasBottom && (
          <div className="mt-1.5 flex items-start justify-between">
            {variant === "error" && errorMessage ? (
              <p id={errorId} className="body-5 text-error-primary">
                {errorMessage}
              </p>
            ) : (
              <span />
            )}
            {showCount && maxLength !== undefined && (
              <p className="body-5 shrink-0 text-white">
                {count}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);
TextField.displayName = "TextField";

export default TextField;
