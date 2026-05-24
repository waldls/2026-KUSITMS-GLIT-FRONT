import CollaborationStone from "@/assets/images/report/collaboration_stone.svg";
import DiscoveryAnalysisStone from "@/assets/images/report/discovery_analysis_stone.svg";
import PlanningExecutionStone from "@/assets/images/report/planning_execution_stone.svg";
import ProblemSolvingStone from "@/assets/images/report/problem_solving_stone.svg";
import ReflectionGrowthStone from "@/assets/images/report/reflection_growth_stone.svg";
import { cn } from "@/lib/utils/cn";

import SkillBlur from "./SkillBlur";

export type SkillStoneId = 1 | 2 | 3 | 4 | 5;

interface GlowingSkillStoneProps {
  skillId: SkillStoneId;
  animate?: boolean;
  ariaLabel?: string;
  className?: string;
}

const getStoneElement = (skillId: SkillStoneId, ariaLabel: string) => {
  const className = "relative z-10 size-full object-contain";

  switch (skillId) {
    case 1:
      return <DiscoveryAnalysisStone role="img" aria-label={ariaLabel} className={className} />;
    case 2:
      return <PlanningExecutionStone role="img" aria-label={ariaLabel} className={className} />;
    case 3:
      return <CollaborationStone role="img" aria-label={ariaLabel} className={className} />;
    case 4:
      return <ProblemSolvingStone role="img" aria-label={ariaLabel} className={className} />;
    case 5:
      return <ReflectionGrowthStone role="img" aria-label={ariaLabel} className={className} />;
  }
};

const getAriaLabel = (skillId: SkillStoneId) => {
  switch (skillId) {
    case 1:
      return "발견/분석 원석";
    case 2:
      return "기획/실행 원석";
    case 3:
      return "협업/조율 원석";
    case 4:
      return "문제해결/개선 원석";
    case 5:
      return "성찰/성장 원석";
  }
};

const GlowingSkillStone = ({
  skillId,
  animate = false,
  ariaLabel,
  className,
}: GlowingSkillStoneProps) => {
  const resolvedAriaLabel = ariaLabel ?? getAriaLabel(skillId);

  return (
    <div
      className={cn(
        "@container-[size] relative flex size-10 items-center justify-center overflow-visible",
        className,
      )}>
      {getStoneElement(skillId, resolvedAriaLabel)}
      <SkillBlur skillId={skillId} animate={animate} className="inset-[-16%] z-20 blur-[8.75cqw]" />
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
