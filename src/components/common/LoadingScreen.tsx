"use client";

import Lottie from "lottie-react";

import loadingAnimation from "@/../public/lotties/loading.json";
import { cn } from "@/lib/utils/cn";

interface LoadingScreenProps {
  className?: string;
}

function LoadingScreen({ className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex size-full min-h-0 flex-col items-center justify-center bg-gray-900",
        className,
      )}
      role="status"
      aria-label="로딩 중">
      <Lottie animationData={loadingAnimation} loop autoplay className="h-7 w-13.75" />
    </div>
  );
}

export default LoadingScreen;
