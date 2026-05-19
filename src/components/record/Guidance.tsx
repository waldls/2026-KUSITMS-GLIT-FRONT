"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils/cn";

interface GuidanceProps extends React.PropsWithChildren<
  Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">
> {
  defaultOpen?: boolean;
  items?: readonly string[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Guidance = ({
  defaultOpen = false,
  items = [],
  children,
  className,
  onClick,
  ...props
}: GuidanceProps) => {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const canDrop = items.length > 0;

  const handleTitleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    onClick?.(event);

    if (event.defaultPrevented || !canDrop) {
      return;
    }

    setIsOpen(prev => !prev);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <button
        type="button"
        aria-expanded={canDrop ? isOpen : undefined}
        aria-controls={canDrop ? panelId : undefined}
        className="body-3 text-sea-blue-400 w-fit cursor-pointer text-left underline underline-offset-4"
        onClick={handleTitleClick}>
        {children}
      </button>
      {canDrop && (
        <div
          id={panelId}
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={cn("drop-panel", isOpen && "drop-panel-open")}>
          <ul
            className={cn(
              "drop-list body-5 flex flex-col items-start text-left text-gray-800",
              isOpen && "drop-list-open",
            )}>
            {items.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Guidance;
