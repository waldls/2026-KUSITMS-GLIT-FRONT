import { forwardRef } from "react";

import { cn } from "@/lib/utils/cn";

type CTAVariant = "default" | "tap";

interface CTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CTAVariant;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  ({ variant = "default", leftIcon, children, className, type, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={disabled}
        suppressHydrationWarning
        className={cn(
          "body-3 rounded-12 group relative inline-flex h-13 w-full cursor-pointer flex-row items-center justify-center gap-1 overflow-hidden bg-gray-400/40 px-6 text-gray-900 [&_svg]:size-6",
          disabled && "cursor-not-allowed",
          className,
        )}
        {...props}>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity",
            variant === "tap"
              ? "bg-cta-gradient-tap"
              : "bg-cta-gradient group-active:bg-cta-gradient-tap",
            disabled ? "opacity-0" : "opacity-100",
          )}
        />
        {leftIcon && (
          <span className="relative z-10 flex shrink-0 items-center justify-center [&_svg]:block">
            {leftIcon}
          </span>
        )}
        <span className="body-3 relative z-10 truncate text-center">{children}</span>
      </button>
    );
  },
);
CTA.displayName = "CTA";

export default CTA;
