import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

const Skeleton = ({ className, style }: SkeletonProps) => (
  <div aria-hidden className={cn("bg-card relative overflow-hidden", className)} style={style}>
    <span className="skeleton-shimmer absolute inset-0 block" />
  </div>
);

export default Skeleton;
