import Image from "next/image";

import { SKILL_STONE_ASSETS, type SkillStoneId } from "@/constants/skillStoneAssets";
import { cn } from "@/lib/utils/cn";

import SkillBlur from "./SkillBlur";

export type { SkillStoneId };

interface GlowingSkillStoneProps {
  skillId: SkillStoneId;
  animate?: boolean;
  ariaLabel?: string;
  className?: string;
  blurClassName?: string;
  priority?: boolean;
}

const GlowingSkillStone = ({
  skillId,
  animate = false,
  ariaLabel,
  className,
  blurClassName,
  priority = false,
}: GlowingSkillStoneProps) => {
  const stone = SKILL_STONE_ASSETS[skillId];
  const resolvedAriaLabel = ariaLabel ?? stone.label;

  return (
    <div
      className={cn(
        "@container-[size] relative flex size-10 items-center justify-center overflow-visible",
        className,
      )}>
      <Image
        src={stone.src}
        alt={resolvedAriaLabel}
        width={stone.src.width}
        height={stone.src.height}
        priority={priority}
        sizes={`${stone.src.width}px`}
        className="relative z-10 size-full object-contain"
      />
      <SkillBlur
        skillId={skillId}
        animate={animate}
        className={cn("inset-[-16%] z-20 blur-[8.75cqw]", blurClassName)}
      />
    </div>
  );
};

export const DiscoveryAnalysisGlowingStone = (props: Omit<GlowingSkillStoneProps, "skillId">) => (
  <GlowingSkillStone skillId={1} {...props} />
);

export const PlanningExecutionGlowingStone = (props: Omit<GlowingSkillStoneProps, "skillId">) => (
  <GlowingSkillStone skillId={2} {...props} />
);

export const CollaborationGlowingStone = (props: Omit<GlowingSkillStoneProps, "skillId">) => (
  <GlowingSkillStone skillId={3} {...props} />
);

export const ProblemSolvingGlowingStone = (props: Omit<GlowingSkillStoneProps, "skillId">) => (
  <GlowingSkillStone skillId={4} {...props} />
);

export const ReflectionGrowthGlowingStone = (props: Omit<GlowingSkillStoneProps, "skillId">) => (
  <GlowingSkillStone skillId={5} {...props} />
);

export default GlowingSkillStone;
