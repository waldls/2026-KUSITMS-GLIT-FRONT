import { cn } from "@/lib/utils/cn";

import Skeleton from "./Skeleton";

interface HomeHeatmapSkeletonProps {
  className?: string;
}

const HomeHeatmapSkeleton = ({ className }: HomeHeatmapSkeletonProps) => (
  <div aria-busy aria-label="히트맵 로딩 중">
    <Skeleton className={cn("rounded-12 h-52.5 w-full", className)} />
  </div>
);

export default HomeHeatmapSkeleton;
