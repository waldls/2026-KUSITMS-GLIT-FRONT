import type { ThHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

const DatingWeekday = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn("body-5 first:text-error-primary text-center text-white", className)}
    {...props}
  />
);

export default DatingWeekday;
