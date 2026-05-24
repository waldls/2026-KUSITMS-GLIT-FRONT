"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

const MAX_ITEMS = 5;
const MAX_CHARS = 50;

interface ScrumTextAreaProps {
  className?: string;
  value?: string[];
  onChange?: (items: string[]) => void;
  maxItems?: number;
  placeholder?: string;
}

const ScrumTextArea = ({
  className,
  value,
  onChange,
  maxItems = MAX_ITEMS,
  placeholder = "어드민 페이지 화면 작업",
}: ScrumTextAreaProps) => {
  const [internalItems, setInternalItems] = useState<string[]>([]);
  const refs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const pendingFocus = useRef<number | null>(null);
  const items = value ?? internalItems;
  const itemLimit = Math.max(1, Math.min(MAX_ITEMS, maxItems));
  const totalMax = itemLimit * MAX_CHARS;

  const totalChars = items.reduce((acc, s) => acc + s.length, 0);

  useEffect(() => {
    if (pendingFocus.current === null) return;

    const el = refs.current[pendingFocus.current];
    el?.focus({ preventScroll: true });
    pendingFocus.current = null;
  });

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const activate = () => {
    if (items.length === 0) {
      update([""]);
    }
  };

  const update = (next: string[]) => {
    if (value === undefined) {
      setInternalItems(next);
    }
    onChange?.(next);
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
      if (i < itemLimit - 1) {
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
        "rounded-6 bg-gray-850 flex h-50.25 w-full flex-col justify-between border-1 border-gray-800 p-4",
        className,
      )}
      onBlur={handleContainerBlur}>
      <div
        className="h-26.25 cursor-text overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={activate}>
        {items.length === 0 ? (
          <div className="flex flex-col">
            {Array.from({ length: itemLimit }, (_, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="body-2 shrink-0 pt-px text-gray-800 select-none">{i + 1}.</span>
                {i === 0 && <span className="body-2 text-gray-800">{placeholder}</span>}
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
        <span className="body-5 text-gray-700">
          {totalChars}/{totalMax}
        </span>
      </div>
    </div>
  );
};

export default ScrumTextArea;
