import type { HTMLAttributes, MouseEventHandler } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

type DatingMonthNavProps = {
  onPreviousClick?: MouseEventHandler<HTMLButtonElement>;
  onNextClick?: MouseEventHandler<HTMLButtonElement>;
  previousMonth?: Date;
  nextMonth?: Date;
} & HTMLAttributes<HTMLElement>;

const DatingMonthNav = ({
  className,
  onPreviousClick,
  onNextClick,
  previousMonth,
  nextMonth,
  ...props
}: DatingMonthNavProps) => (
  <nav
    className={cn(
      "absolute inset-x-0 top-0 grid h-6.25 grid-cols-7 items-center gap-x-5",
      className,
    )}
    {...props}>
    <button
      type="button"
      aria-disabled={previousMonth ? undefined : true}
      aria-label="지난 달"
      className="col-start-1 flex size-6 cursor-pointer items-center justify-center justify-self-center text-white disabled:cursor-default"
      disabled={!previousMonth}
      onClick={onPreviousClick}>
      <ChevronLeftIcon className="size-6" />
    </button>
    <button
      type="button"
      aria-disabled={nextMonth ? undefined : true}
      aria-label="다음 달"
      className="col-start-7 flex size-6 cursor-pointer items-center justify-center justify-self-center text-white disabled:cursor-default"
      disabled={!nextMonth}
      onClick={onNextClick}>
      <ChevronRightIcon className="size-6" />
    </button>
  </nav>
);

const DatingMonthCaption = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("body-3 text-white select-none", className)} {...props} />
);

export { DatingMonthCaption };
export default DatingMonthNav;
