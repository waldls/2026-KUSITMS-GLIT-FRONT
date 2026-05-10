"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

const MAX_ITEMS = 5;
const MAX_CHARS = 50;
const TOTAL_MAX = MAX_ITEMS * MAX_CHARS;

interface ScrumTextAreaProps {
  className?: string;
  onChange?: (items: string[]) => void;
}

const ScrumTextArea = ({ className, onChange }: ScrumTextAreaProps) => {
  const [items, setItems] = useState<string[]>([]);
  const refs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const pendingFocus = useRef<number | null>(null);

  const totalChars = items.reduce((acc, s) => acc + s.length, 0);

  useEffect(() => {
    if (pendingFocus.current !== null) {
      const el = refs.current[pendingFocus.current];
      el?.focus();
      pendingFocus.current = null;
    }
  });

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const activate = (e: React.MouseEvent<HTMLDivElement>) => {
    if (items.length === 0) {
      pendingFocus.current = 0;
      setItems([""]);
    } else if (!(e.target as HTMLElement).closest("textarea")) {
      refs.current[items.length - 1]?.focus();
    }
  };

  const update = (next: string[]) => {
    setItems(next);
    onChange?.(next.filter(Boolean));
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    autoResize(e.target);
    const next = [...items];
    next[i] = val;
    update(next);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (i < MAX_ITEMS - 1) {
        pendingFocus.current = i + 1;
        const next = items.length > i + 1 ? [...items] : [...items, ""];
        update(next);
      }
    } else if (e.key === "Backspace" && items[i] === "" && i > 0) {
      e.preventDefault();
      pendingFocus.current = i - 1;
      const next = items.filter((_, j) => j !== i);
      update(next);
    }
  };

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (items.every(s => !s)) update([]);
    }
  };

  return (
    <div
      className={cn(
        "rounded-6 bg-gray-850 flex h-50.25 w-full flex-col justify-between p-4",
        className,
      )}
      onBlur={handleContainerBlur}>
      <div
        className="h-26.25 cursor-text overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={e => activate(e)}>
        {items.length === 0 ? (
          <div className="flex flex-col">
            {Array.from({ length: MAX_ITEMS }, (_, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="body-2 shrink-0 pt-px text-gray-800 select-none">{i + 1}.</span>
                {i === 0 && <span className="body-2 text-gray-800">어드민 페이지 화면 작업</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="body-2 shrink-0 pt-px text-gray-300 select-none">{i + 1}.</span>
                <textarea
                  ref={el => {
                    refs.current[i] = el;
                  }}
                  rows={1}
                  value={item}
                  maxLength={MAX_CHARS}
                  onChange={e => handleChange(i, e)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="body-2 w-full resize-none overflow-hidden bg-transparent text-gray-200 caret-white outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <span className="body-4 text-gray-700">
          {totalChars}/{TOTAL_MAX}
        </span>
      </div>
    </div>
  );
};

export default ScrumTextArea;
