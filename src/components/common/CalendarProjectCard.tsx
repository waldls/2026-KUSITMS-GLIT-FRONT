"use client";

import { useEffect, useRef, useState } from "react";

import { DeleteIcon, ThreeDotsIcon } from "@/assets/icons";
import Popover from "@/components/common/Popover";
import type { TagVariant } from "@/components/common/Tag";
import Tag from "@/components/common/Tag";
import { TAG_BORDER_CLASS } from "@/constants/competency";
import { cn } from "@/lib/utils/cn";

interface CalendarProjectCardProps {
  type?: "default" | "delete";
  name: string;
  pjName: string;
  date?: string;
  skillTags?: { label: string; variant: TagVariant }[];
  scrumItems?: { content: string; highlight?: TagVariant; onClick?: () => void }[];
  onDelete?: () => void;
  onScrumDelete?: (index: number) => void;
  className?: string;
}

const CalendarProjectCard = ({
  type = "default",
  name,
  pjName,
  date,
  skillTags,
  scrumItems,
  onDelete,
  onScrumDelete,
  className,
}: CalendarProjectCardProps) => {
  const isDelete = type === "delete";
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPopoverOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopoverOpen]);

  return (
    <article className={cn("rounded-8 bg-gray-850/60 flex w-full flex-col gap-2 p-3", className)}>
      <div className="flex flex-col gap-0.5">
        <div className="relative flex items-center gap-2">
          {!isDelete && date && <span className="body-5 text-gray-300">{date}</span>}
          <span className="body-5 text-gray-300">{pjName}</span>
          {onDelete && (
            <div ref={popoverRef} className="absolute right-0">
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => setIsPopoverOpen(prev => !prev)}
                aria-label="더보기">
                <ThreeDotsIcon className="size-5 text-gray-500" />
              </button>
              {isPopoverOpen && (
                <Popover
                  className="absolute top-full right-0 z-10 mt-1"
                  items={[
                    {
                      label: "삭제하기",
                      onClick: () => {
                        onDelete();
                        setIsPopoverOpen(false);
                      },
                    },
                  ]}
                  onClose={() => setIsPopoverOpen(false)}
                />
              )}
            </div>
          )}
        </div>
        <p className="body-3 text-gray-100">{name}</p>
      </div>

      {skillTags && skillTags.length > 0 && (
        <div className="scrollbar-hide flex gap-1 overflow-x-auto">
          {skillTags.map(tag => (
            <Tag key={tag.label} variant={tag.variant} className="shrink-0">
              {tag.label}
            </Tag>
          ))}
        </div>
      )}

      {scrumItems && scrumItems.length > 0 && (
        <div className="flex flex-col gap-1">
          {scrumItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {isDelete && (
                <button
                  type="button"
                  className="flex size-4 shrink-0 cursor-pointer items-center justify-center"
                  onClick={() => onScrumDelete?.(i)}
                  aria-label="삭제">
                  <DeleteIcon className="size-4" />
                </button>
              )}
              <div
                className={cn(
                  "flex items-center border-l-4 py-0.5 pl-0.5",
                  item.highlight ? TAG_BORDER_CLASS[item.highlight] : "border-transparent",
                  !isDelete && item.onClick ? "cursor-pointer" : "",
                )}
                onClick={!isDelete ? item.onClick : undefined}
                role={!isDelete && item.onClick ? "button" : undefined}>
                <span className="body-4 text-gray-400">
                  {i + 1}. {item.content}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default CalendarProjectCard;
