"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

export type PopoverItem = {
  label: string;
  dotClassName?: string;
  selected?: boolean;
  onClick?: () => void;
};

interface PopoverProps {
  items: PopoverItem[];
  className?: string;
  onClose?: () => void;
}

const Popover = ({ items, className, onClose }: PopoverProps) => {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const selectedIndex = items.findIndex(item => item.selected);
    const initialIndex = selectedIndex >= 0 ? selectedIndex : 0;

    itemRefs.current[initialIndex]?.focus();
  }, [items]);

  const focusItem = (index: number) => {
    itemRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = itemRefs.current.findIndex(item => item === document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose?.();
      return;
    }

    if (currentIndex === -1) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem((currentIndex + 1) % items.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem((currentIndex - 1 + items.length) % items.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusItem(items.length - 1);
    }
  };

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      className={cn("rounded-8 bg-gray-850 flex w-37.5 flex-col gap-1 px-1.5 py-2", className)}>
      {items.map((item, index) => (
        <button
          key={item.label}
          ref={element => {
            itemRefs.current[index] = element;
          }}
          type="button"
          role={item.selected === undefined ? "menuitem" : "menuitemradio"}
          aria-checked={item.selected}
          onClick={item.onClick}
          className={cn(
            "group rounded-6 flex w-full cursor-pointer items-center gap-2.5 px-2 py-1 text-left focus-visible:bg-gray-900 active:bg-gray-900",
            item.selected ? "bg-gray-900" : "bg-transparent",
          )}>
          {item.dotClassName && (
            <span className={cn("block size-2 shrink-0 rounded-full", item.dotClassName)} />
          )}
          <span
            className={cn(
              "body-2 group-focus-visible:text-gray-100 group-active:text-gray-100",
              item.selected ? "text-gray-100" : "text-gray-600",
            )}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Popover;
