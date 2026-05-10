"use client";

import { useId, useState } from "react";

import { CancelIcon, ChevronDownIcon, ChevronUpIcon, EditIcon, PlusIcon } from "@/assets/icons";
import Button from "@/components/common/Button";
import Chip from "@/components/common/Chip";
import TextField from "@/components/common/TextField";
import { cn } from "@/lib/utils/cn";

const chipLeadingIcon = (node: React.ReactNode) => (
  <span className="inline-flex shrink-0 [&_svg]:size-[16px]!">{node}</span>
);

interface DropDownProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  inputPlaceholder?: string;
  maxLength?: number;
  tags?: readonly string[];
  addScrapLabel?: string;
  addProjectLabel?: string;
  editTagsLabel?: string;
}

const DropDown = ({
  title,
  description,
  open,
  defaultOpen = false,
  onOpenChange,
  inputValue,
  defaultInputValue = "",
  onInputValueChange,
  inputPlaceholder = "제목을 작성해주세요",
  maxLength = 20,
  tags = [],
  addScrapLabel = "스크랩 추가",
  addProjectLabel = "프로젝트 추가",
  editTagsLabel = "태그 편집",
  className,
  ...props
}: DropDownProps) => {
  const panelId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalInput, setInternalInput] = useState(defaultInputValue);

  const isOpen = open ?? internalOpen;
  const isInputControlled = inputValue !== undefined;
  const fieldValue = isInputControlled ? inputValue : internalInput;
  const hasInputValue = fieldValue.length > 0;

  const updateFieldValue = (next: string) => {
    if (!isInputControlled) {
      setInternalInput(next);
    }
    onInputValueChange?.(next);
  };

  const toggleOpen = () => {
    const nextOpen = !isOpen;

    if (open === undefined) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-start justify-between gap-3 text-left"
        onClick={toggleOpen}>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="body-3 text-white">{title}</p>
          {description && <p className="body-4 text-gray-400">{description}</p>}
        </div>
        <span className="shrink-0 text-gray-100 [&_svg]:size-5">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </button>

      <div
        id={panelId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn("drop-panel", isOpen && "drop-panel-open")}>
        <div
          className={cn(
            "drop-list flex flex-col gap-3 [--drop-list-open-margin-top:1.5rem]",
            isOpen && "drop-list-open",
          )}>
          <TextField
            disabled={!isOpen}
            value={fieldValue}
            onChange={e => updateFieldValue(e.target.value)}
            placeholder={inputPlaceholder}
            maxLength={maxLength}
            showCount
            className="body-2 placeholder:text-gray-800"
            rightIcon={
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center [&_svg]:size-6",
                  !hasInputValue && "pointer-events-none opacity-0",
                )}>
                <CancelIcon />
              </span>
            }
            rightIconClassName="text-gray-800"
            onRightIconClick={hasInputValue ? () => updateFieldValue("") : undefined}
          />

          <Button
            disabled={!isOpen}
            variant="gray"
            size="md"
            leftIcon={chipLeadingIcon(<PlusIcon />)}
            className="text-offwhite-500 w-full bg-gray-800">
            {addScrapLabel}
          </Button>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <Chip
                key={`${tag}-${index}`}
                disabled={!isOpen}
                className="border-[0.6px] border-solid border-gray-800 bg-gray-800/54">
                {tag}
              </Chip>
            ))}

            <Chip
              disabled={!isOpen}
              leftIcon={chipLeadingIcon(<PlusIcon />)}
              className="overflow-hidden border-[0.6px] border-solid border-gray-800 bg-transparent">
              {addProjectLabel}
            </Chip>

            <Chip
              disabled={!isOpen}
              leftIcon={chipLeadingIcon(<EditIcon />)}
              className="overflow-hidden border-[0.6px] border-solid border-gray-800 bg-transparent">
              {editTagsLabel}
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
