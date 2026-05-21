import type { CSSProperties } from "react";

import HeartFilledImage from "@/assets/images/record/heart-filled.svg";
import { cn } from "@/lib/utils/cn";

interface FilledHeartGemProps {
  animateGlow?: boolean;
  ariaHidden?: boolean;
  ariaLabel?: string;
  className?: string;
}

const FilledHeartGem = ({
  animateGlow = true,
  ariaHidden,
  ariaLabel = "완성된 하트 원석",
  className,
}: FilledHeartGemProps) => (
  <div
    className={cn(
      "[container-type:size] relative flex size-32 items-center justify-center",
      className,
    )}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span
        className={cn(
          "absolute top-[-7.8125%] left-[-32.8125%] z-20 size-[136.71875%] rounded-full bg-[radial-gradient(ellipse_at_38%_32%,#FEFEFE_0%,#BCFFF6_20%,#AEFAFF_38%,#DFFDFF_58%,#C0FCFF_77%,#26EAF1_97%)] opacity-55 mix-blend-screen blur-[17.9296875cqw]",
          animateGlow && "animate-[heart-blur-flash_5.5s_ease-in-out_infinite]",
        )}
        style={
          {
            "--heart-blur-opacity": 0.56,
            "--heart-blur-scale": 0.56,
          } as CSSProperties
        }
      />
      <span
        className={cn(
          "absolute top-[-25%] left-[-21.875%] z-0 size-[144.53125%] rounded-full bg-[#7B72D8]/60 opacity-70 blur-[15.625cqw]",
          animateGlow && "animate-[heart-blur-flash_5.5s_ease-in-out_infinite]",
        )}
        style={
          {
            "--heart-blur-opacity": 0.66,
            "--heart-blur-scale": 0.78,
          } as CSSProperties
        }
      />
      <span
        className={cn(
          "bg-sea-blue-100 absolute top-[7.8125%] right-[-21.875%] z-20 size-[104.6875%] rounded-full opacity-60 mix-blend-screen blur-[15.625cqw]",
          animateGlow && "animate-[heart-blur-flash_5.5s_ease-in-out_infinite]",
        )}
        style={
          {
            "--heart-blur-opacity": 0.58,
            "--heart-blur-scale": 0.58,
          } as CSSProperties
        }
      />
    </div>
    <HeartFilledImage
      role="img"
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : ariaLabel}
      className="relative z-10 size-full object-contain"
    />
  </div>
);

export default FilledHeartGem;
