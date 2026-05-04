"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onIconClick?: () => void;
  onTextClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const BottomSheet = ({
  isOpen,
  onIconClick,
  onTextClick,
  text,
  icon,
  children,
  className,
}: BottomSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasHeader = text !== undefined || icon !== undefined;

  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <div className="absolute inset-0" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "rounded-t-20 bg-gray-850 relative flex max-h-dvh w-full flex-col",
          className,
        )}>
        <div className="absolute top-4 flex w-full justify-center">
          <div className="h-1.25 w-13.5 rounded-full bg-gray-100" />
        </div>

        {hasHeader && (
          <div className="absolute top-2.5 flex w-full items-center justify-end px-5">
            <div className="flex items-center gap-0.5">
              {text !== undefined && (
                <button
                  type="button"
                  onClick={onTextClick}
                  className="body-3 cursor-pointer px-1 text-gray-600">
                  {text}
                </button>
              )}
              {icon !== undefined && (
                <button
                  type="button"
                  onClick={onIconClick}
                  aria-label="닫기"
                  className="flex size-6 cursor-pointer items-center justify-center text-white">
                  {icon}
                </button>
              )}
            </div>
          </div>
        )}

        <div className={cn("mt-8.5 flex-1 overflow-y-auto")}>{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
