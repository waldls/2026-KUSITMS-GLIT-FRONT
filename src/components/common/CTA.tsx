import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type CTAVariant = "default" | "tap";

const VARIANT_STYLES: Record<CTAVariant, string> = {
  default: "bg-cta-gradient active:bg-cta-gradient-tap text-gray-900",
  tap: "bg-cta-gradient-tap text-gray-900",
};

interface CTAProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  variant?: CTAVariant;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  ({ variant = "default", leftIcon, children, className, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "body-3 rounded-12 inline-flex h-13 w-83.75 cursor-pointer flex-row items-center justify-center gap-1 px-6 transition-colors [&_svg]:size-6",
          VARIANT_STYLES[variant],
          className,
        )}
        {...props}>
        {leftIcon && (
          <span className="flex shrink-0 items-center justify-center [&_svg]:block">
            {leftIcon}
          </span>
        )}
        <span className="body-3 truncate text-center">{children}</span>
      </button>
    );
  },
);
CTA.displayName = "CTA";

export default CTA;
