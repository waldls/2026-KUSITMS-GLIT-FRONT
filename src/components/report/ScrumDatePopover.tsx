"use client";

import type { CSSProperties } from "react";

import Checkbox from "@/components/common/Checkbox";
import type { DailySelectableRecord } from "@/types/report/report";

interface ScrumDatePopoverProps {
  scrums: DailySelectableRecord[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  style?: CSSProperties;
}

const ScrumDatePopover = ({ scrums, selectedIds, onToggle, style }: ScrumDatePopoverProps) => (
  <div
    className="border-linear-100 rounded-8 absolute z-10 flex w-65.5 -translate-y-[calc(100%+8px)] flex-col gap-2 px-4 py-3"
    style={style}>
    {scrums.map(scrum => (
      <div
        key={scrum.starRecordId}
        role="button"
        tabIndex={0}
        onClick={() => onToggle(scrum.starRecordId)}
        onKeyDown={e => e.key === "Enter" && onToggle(scrum.starRecordId)}
        className="flex cursor-pointer items-center gap-2">
        <Checkbox checked={selectedIds.has(scrum.starRecordId)} className="shrink-0" />
        <span className="body-5 shrink-0 text-gray-200">{scrum.projectName}</span>
        <span className="body-5 flex-1 truncate text-gray-400">{scrum.scrumContent}</span>
      </div>
    ))}
  </div>
);

export default ScrumDatePopover;
