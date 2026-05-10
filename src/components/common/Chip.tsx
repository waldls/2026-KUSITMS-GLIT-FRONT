"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

type ChipState = "default" | "selected" | "unselected" | "input";

const STATE_STYLES: Record<ChipState, string> = {
  default: "border-gray-800 bg-gray-800/54 text-white active:bg-gray-800",
  selected: "border-sea-blue-400 bg-gray-800 text-white active:bg-gray-800",
  unselected: "border-transparent bg-gray-800 text-offwhite-400 opacity-30 active:bg-gray-800",
  input: "border-gray-800 bg-gray-800/54 text-white",
};

interface ChipBaseProps {
  state?: ChipState;
  leftIcon?: React.ReactNode;
  className?: string;
}

interface ChipDefaultProps extends ChipBaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: Exclude<ChipState, "input">;
  children: React.ReactNode;
}

interface ChipInputProps extends ChipBaseProps {
  state: "input";
  onConfirm?: (value: string) => void;
  inputClassName?: string;
}

type ChipProps = ChipDefaultProps | ChipInputProps;

const ChipInput = ({
  leftIcon,
  className,
  onConfirm,
  inputClassName,
}: Omit<ChipInputProps, "state">) => {
  const [value, setValue] = useState("");

  const baseClass = cn(
    "body-4 rounded-6 inline-flex w-fit cursor-pointer items-center border-[0.6px] px-2 py-2.5 transition",
    STATE_STYLES.input,
    className,
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirm?.(value);
    }
  };

  return (
    <div className={baseClass}>
      <div className="flex items-center gap-0.75 px-px [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0">
        {leftIcon}
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "body-4 [field-sizing:content] min-w-4 bg-transparent text-white caret-white outline-none",
            inputClassName,
          )}
        />
      </div>
    </div>
  );
};

const Chip = (props: ChipProps) => {
  if (props.state === "input") {
    return (
      <ChipInput
        leftIcon={props.leftIcon}
        className={props.className}
        onConfirm={props.onConfirm}
        inputClassName={props.inputClassName}
      />
    );
  }

  const {
    state = "default",
    leftIcon,
    children,
    className,
    ...buttonProps
  } = props as ChipDefaultProps;

  return (
    <button
      type="button"
      className={cn(
        "body-4 rounded-6 inline-flex w-fit cursor-pointer items-center border-[0.6px] px-2 py-2.5 transition active:opacity-[0.76]",
        STATE_STYLES[state],
        className,
      )}
      {...buttonProps}>
      <div className="flex items-center gap-0.75 px-px [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0">
        {leftIcon}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Chip;
