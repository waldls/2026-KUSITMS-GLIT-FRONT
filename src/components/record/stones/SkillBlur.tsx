import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

interface SkillBlurProps {
  skillId: number;
  active?: boolean;
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
}

const getSkillBlurClassName = (skillId: number) => {
  switch (skillId) {
    case 1:
      return "bg-tag-200";
    case 2:
      return "bg-tag-100";
    case 3:
      return "bg-tag-300";
    case 4:
      return "bg-tag-400";
    case 5:
      return "bg-tag-500";
    default:
      return "bg-gray-100";
  }
};

const SkillBlur = ({
  skillId,
  active = true,
  animate = false,
  className,
  style,
}: SkillBlurProps) => (
  <span
    aria-hidden="true"
    className={cn(
      "pointer-events-none absolute inset-[4%] rounded-full mix-blend-screen blur-[22.65625cqw] transition-all duration-700 ease-out",
      getSkillBlurClassName(skillId),
      active ? "scale-100 opacity-95" : "scale-80 opacity-0",
      animate && "animate-[heart-blur-flash_5.5s_ease-in-out_infinite]",
      className,
    )}
    style={
      {
        "--heart-blur-opacity": 0.84,
        "--heart-blur-scale": 1,
        ...style,
      } as CSSProperties
    }
  />
);

export default SkillBlur;
