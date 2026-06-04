import { cn } from "@/lib/utils/cn";

import Skeleton from "./Skeleton";

interface HomeRadarSkeletonProps {
  className?: string;
}

const HomeRadarSkeleton = ({ className }: HomeRadarSkeletonProps) => (
  <div aria-busy aria-label="역량 기록 분포 로딩 중">
    <Skeleton className={cn("rounded-12 h-88 w-full", className)} />
  </div>
);

export default HomeRadarSkeleton;
