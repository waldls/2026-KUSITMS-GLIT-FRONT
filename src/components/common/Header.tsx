"use client";

import { useRouter } from "next/navigation";

import { ChevronLeftIcon } from "@/assets/icons";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  onLeftClick?: () => void;
  leftButtonAriaLabel?: string;
  rightIcon?: React.ReactNode;
  rightLabel?: string;
  onRightClick?: () => void;
  rightDisabled?: boolean;
  rightButtonAriaLabel?: string;
  rightLabelClassName?: string;
  className?: string;
}

const Header = ({
  title,
  leftIcon,
  onLeftClick,
  leftButtonAriaLabel = "뒤로 가기",
  rightIcon,
  rightLabel,
  onRightClick,
  rightDisabled = false,
  rightButtonAriaLabel,
  rightLabelClassName,
  className,
}: HeaderProps) => {
  const router = useRouter();
  const renderLeftIcon =
    leftIcon === undefined ? <ChevronLeftIcon className="size-7 text-gray-100" /> : leftIcon;
  const hasRightContent = rightLabel !== undefined || rightIcon !== undefined;

  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick();
      return;
    }

    router.back();
  };

  const handleRightClick = () => {
    onRightClick?.();
  };

  return (
    <header
      className={cn("grid w-full grid-cols-[1fr_auto_1fr] items-center px-4.25 py-4.5", className)}>
      <div>
        {renderLeftIcon && (
          <button
            type="button"
            onClick={handleLeftClick}
            aria-label={leftButtonAriaLabel}
            className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-80">
            {renderLeftIcon}
          </button>
        )}
      </div>
      {title && <h1 className="head-4 truncate text-center text-white">{title}</h1>}
      <div className="flex justify-end">
        {hasRightContent && (
          <button
            type="button"
            data-testid="header-right-button"
            disabled={rightDisabled}
            aria-label={rightButtonAriaLabel}
            className="flex cursor-pointer items-center justify-end gap-1 disabled:cursor-default"
            onClick={handleRightClick}>
            {rightLabel && (
              <span className={cn("body-2 text-gray-700", rightLabelClassName)}>{rightLabel}</span>
            )}
            {rightIcon && (
              <span className="flex size-6 items-center justify-center">{rightIcon}</span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
