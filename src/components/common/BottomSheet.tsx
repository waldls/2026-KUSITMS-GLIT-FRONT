"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  onIconClick?: () => void;
  onTextClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  textDisabled?: boolean;
  hasOverlay?: boolean;
  onOverlayClick?: () => void;
}

const BottomSheet = ({
  isOpen,
  onClose,
  onIconClick,
  onTextClick,
  text,
  icon,
  children,
  className,
  textClassName,
  textDisabled = false,
  hasOverlay = true,
  onOverlayClick,
}: BottomSheetProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [hasEntered, setHasEntered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      const openTimer = window.setTimeout(() => {
        setShouldRender(true);
        setIsClosing(false);
        setHasEntered(false);
      }, 0);

      return () => {
        window.clearTimeout(openTimer);
      };
    }

    if (!shouldRender) return;

    const closingTimer = window.setTimeout(() => {
      setIsClosing(true);
    }, 0);
    const closeTimer = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      setHasEntered(false);
    }, 250);

    return () => {
      window.clearTimeout(closingTimer);
      window.clearTimeout(closeTimer);
    };
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const hasHeader = text !== undefined || icon !== undefined;

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-107.5 min-w-93.75 -translate-x-1/2 items-end">
      <button
        type="button"
        aria-label="바텀시트 닫기"
        onClick={onOverlayClick ?? onClose}
        className={cn("absolute inset-0 cursor-default", hasOverlay && "bg-gray-900/75")}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "rounded-t-20 bg-gray-850 relative flex max-h-dvh w-full flex-col",
          isClosing ? "animate-slide-out-down" : !hasEntered && "animate-slide-in-up",
          className,
        )}
        onAnimationEnd={() => {
          if (!isClosing) {
            setHasEntered(true);
          }
        }}>
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
                  disabled={textDisabled}
                  className={cn(
                    "body-3 cursor-pointer text-gray-600 disabled:cursor-default",
                    textClassName,
                  )}>
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
