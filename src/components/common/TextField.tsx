import React, { forwardRef } from "react";

import { cn } from "@/lib/utils";

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
  errorMessage?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ variant = "default", rightIcon, errorMessage, className, id, ...props }, ref) => {
    const errorId = variant === "error" && errorMessage && id ? `${id}-error` : undefined;

    return (
      <div className="mx-auto flex w-full flex-col">
        <div
          className={cn(
            "relative flex w-full items-center border-b-[1.6px] pb-1.5 transition-colors",
            WRAPPER_VARIANT_STYLES[variant],
          )}>
          <input
            ref={ref}
            id={id}
            aria-invalid={variant === "error" ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              "body-2 w-full bg-transparent outline-none",
              TEXTFIELD_VARIANT_STYLES[variant],
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="ml-2 flex shrink-0 cursor-pointer items-center text-white [&_svg]:size-6">
              {rightIcon}
            </div>
          )}
        </div>
        {variant === "error" && errorMessage && (
          <p id={errorId} className="text-error-primary body-4 mt-1">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);
TextField.displayName = "TextField";

export default TextField;
