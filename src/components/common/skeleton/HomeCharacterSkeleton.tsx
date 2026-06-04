import { cn } from "@/lib/utils/cn";

import Skeleton from "./Skeleton";

interface HomeCharacterSkeletonProps {
  glaring?: boolean;
  className?: string;
  fill?: boolean;
}

const HomeCharacterSkeleton = ({ glaring, className, fill }: HomeCharacterSkeletonProps) => {
  const width = 228;
  const height = glaring ? 188 : 198;

  return (
    <Skeleton
      className={cn("rounded-16", fill && "size-full", className)}
      style={fill ? undefined : { width, height }}
    />
  );
};

export default HomeCharacterSkeleton;
