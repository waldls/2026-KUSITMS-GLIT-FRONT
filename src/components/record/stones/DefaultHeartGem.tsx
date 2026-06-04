import Image from "next/image";
import type { CSSProperties } from "react";

import { HEART_GEM_ASSETS } from "@/constants/skillStoneAssets";
import { cn } from "@/lib/utils/cn";

interface DefaultHeartGemProps {
  animateGlow?: boolean;
  ariaHidden?: boolean;
  ariaLabel?: string;
  className?: string;
  glowLevel?: number;
  priority?: boolean;
}

const DefaultHeartGem = ({
  animateGlow = true,
  ariaHidden,
  ariaLabel = "하트 원석",
  className,
  glowLevel = 2,
  priority = false,
}: DefaultHeartGemProps) => (
  <div
    className={cn("@container-[size] relative flex size-32 items-center justify-center", className)}
    style={
      {
        "--heart-blur-opacity": glowLevel === 0 ? 0 : 0.3 + glowLevel * 0.16,
        "--heart-blur-scale": 0.82 + glowLevel * 0.16,
      } as CSSProperties
    }>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <span
        className={cn(
          "size-[61.71875%] rounded-full bg-gray-100 opacity-(--heart-blur-opacity) blur-[19.53125cqw] transition-opacity duration-500 ease-out",
          animateGlow && "animate-[heart-blur-flash_5.5s_ease-in-out_infinite]",
        )}
      />
    </div>
    <Image
      src={HEART_GEM_ASSETS.default.src}
      alt={ariaHidden ? "" : ariaLabel}
      aria-hidden={ariaHidden}
      width={HEART_GEM_ASSETS.default.src.width}
      height={HEART_GEM_ASSETS.default.src.height}
      priority={priority}
      quality={95}
      sizes={`${HEART_GEM_ASSETS.default.src.width}px`}
      className="relative z-10 size-full object-contain"
    />
  </div>
);

export default DefaultHeartGem;
