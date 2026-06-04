"use client";

import { useEffect, useRef, useState } from "react";

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
  height?: string;
  hideScrollbar?: boolean;
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
  height,
  hideScrollbar = false,
}: BottomSheetProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const closeCompleteRef = useRef<(() => void) | undefined>(undefined);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setHasEntered(false);
    } else {
      setIsClosing(true);
    }
  }

  useEffect(() => {
    if (isOpen) {
      closeCompleteRef.current = undefined;
    }
  }, [isOpen]);

  const finishClose = () => {
    const onComplete = closeCompleteRef.current;
    closeCompleteRef.current = undefined;
    setIsClosing(false);
    setHasEntered(false);
    setShouldRender(false);
    onComplete?.();
  };

  const startCloseAnimation = (onComplete?: () => void) => {
    closeCompleteRef.current = onComplete;
    setIsClosing(true);
  };

  const handleOverlayClick = () => {
    if (isClosing) return;

    if (onOverlayClick) {
      onOverlayClick();
      return;
    }

    if (!onClose) return;

    startCloseAnimation(onClose);
  };

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
        onClick={handleOverlayClick}
        className={cn(
          "absolute inset-0 cursor-default transition-opacity duration-250 ease-out",
          hasOverlay && "bg-gray-900/75",
          isClosing && "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={height ? { height } : undefined}
        className={cn(
          "rounded-t-20 bg-gray-850 relative flex w-full flex-col",
          height ? "shrink-0" : "max-h-dvh",
          isClosing ? "animate-slide-out-down" : !hasEntered && "animate-slide-in-up",
          className,
        )}
        onAnimationEnd={event => {
          if (event.target !== event.currentTarget) return;

          if (isClosing) {
            if (event.animationName === "slide-out-down") {
              finishClose();
            }
            return;
          }

          if (event.animationName === "slide-in-up") {
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

        <div
          className={cn(
            "mt-8.5 min-h-0 flex-1 overflow-y-auto",
            hideScrollbar &&
              "[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
