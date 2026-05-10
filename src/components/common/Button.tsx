import { forwardRef } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "default" | "gray";
export type ButtonSize = "lg" | "md";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  default: "bg-sea-blue-400 active:bg-sea-blue-400/[.93] text-typo-primary",
  gray: "bg-gray-400/40 text-offwhite-500",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  lg: "h-13 py-3 px-6 rounded-12 gap-1 body-3 [&_svg]:size-6",
  md: "h-10 py-2.5 px-3.5 rounded-8 gap-0.5 body-4 [&_svg]:size-4",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      className,
      type,
      disabled,
      ...props
    },
    ref,
  ) => {
    const activeVariant = disabled ? "gray" : variant;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={disabled}
        className={cn(
          "inline-flex cursor-pointer flex-row items-center justify-center transition-colors disabled:cursor-not-allowed",
          VARIANT_STYLES[activeVariant],
          SIZE_STYLES[size],
          className,
        )}
        {...props}>
        {leftIcon && (
          <span className="flex shrink-0 items-center justify-center [&_svg]:block">
            {leftIcon}
          </span>
        )}
        <span className="truncate text-center">{children}</span>
        {rightIcon && (
          <span className="flex shrink-0 items-center justify-center [&_svg]:block">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export default Button;
