import { type ComponentProps } from "react";
import { type Day, type DayButton } from "react-day-picker";

import { cn } from "@/lib/utils/cn";

const datingDayStyle = {
  default: "size-7.5 rounded-full text-white",
  outside: "text-gray-600",
  disabled: "text-gray-600",
  selected: "bg-gray-300 text-gray-900",
  otherSelected: "bg-gray-800/50 text-gray-600",
  scrum:
    "after:absolute after:right-0.75 after:top-0.75 after:size-1.25 after:rounded-full after:bg-gray-700",
};

const DatingDayContent = ({
  children,
  modifiers,
}: Pick<ComponentProps<typeof Day>, "children" | "modifiers">) => (
  <span
    className={cn(
      "relative flex items-center justify-center",
      datingDayStyle.default,
      modifiers.outside && datingDayStyle.outside,
      modifiers.disabled && datingDayStyle.disabled,
      modifiers.selected && datingDayStyle.selected,
      modifiers.otherSelected && !modifiers.selected && datingDayStyle.otherSelected,
      modifiers.scrum && datingDayStyle.scrum,
    )}>
    {children}
  </span>
);

const DatingDay = ({ className, children, ...props }: ComponentProps<typeof Day>) => (
  <td className={cn(className, "body-2 p-0 text-center")} {...props}>
    {children}
  </td>
);

const DatingDayButton = ({
  className,
  children,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) => (
  <button
    type="button"
    className={cn(
      className,
      "body-2 flex aspect-square w-full cursor-pointer items-center justify-center disabled:cursor-default",
    )}
    {...props}>
    <DatingDayContent modifiers={modifiers}>{children}</DatingDayContent>
  </button>
);

export { DatingDay };
export default DatingDayButton;
