import type { CSSProperties } from "react";

import CollaborationStone from "@/assets/images/report/collaboration_stone.svg";
import DiscoveryAnalysisStone from "@/assets/images/report/discovery_analysis_stone.svg";
import PlanningExecutionStone from "@/assets/images/report/planning_execution_stone.svg";
import ProblemSolvingStone from "@/assets/images/report/problem_solving_stone.svg";
import ReflectionGrowthStone from "@/assets/images/report/reflection_growth_stone.svg";
import { cn } from "@/lib/utils/cn";

interface SkillStoneGemProps {
  selectedSkillIds: number[];
  isComplete: boolean;
  className?: string;
}

const STONE_ITEMS = [
  {
    id: 1,
    label: "발견/분석 원석",
    Stone: DiscoveryAnalysisStone,
    glowClassName: "bg-tag-200",
    positionClassName: "top-[22%] left-[31%] z-30 rotate-[-14deg]",
  },
  {
    id: 2,
    label: "기획/실행 원석",
    Stone: PlanningExecutionStone,
    glowClassName: "bg-tag-100",
    positionClassName: "top-[20%] right-[30%] z-20 rotate-[13deg]",
  },
  {
    id: 3,
    label: "협업/조율 원석",
    Stone: CollaborationStone,
    glowClassName: "bg-tag-300",
    positionClassName: "top-[40%] left-[20%] z-10 rotate-[9deg]",
  },
  {
    id: 4,
    label: "문제해결/개선 원석",
    Stone: ProblemSolvingStone,
    glowClassName: "bg-tag-400",
    positionClassName: "top-[40%] right-[20%] z-10 rotate-[-8deg]",
  },
  {
    id: 5,
    label: "성찰/성장 원석",
    Stone: ReflectionGrowthStone,
    glowClassName: "bg-tag-500",
    positionClassName: "bottom-[19%] left-1/2 z-40 -translate-x-1/2 rotate-[4deg]",
  },
] as const;

const SkillStoneGem = ({ selectedSkillIds, isComplete, className }: SkillStoneGemProps) => {
  const selectedSkillIdSet = new Set(selectedSkillIds);
  const hasSelectedSkill = selectedSkillIds.length > 0;

  return (
    <div
      className={cn(
        "@container-[size] relative flex size-32 items-center justify-center",
        isComplete && "animate-[heart-blur-flash_5.5s_ease-in-out_infinite]",
        className,
      )}
      style={
        {
          "--heart-blur-opacity": 0.32,
          "--heart-blur-scale": 1,
        } as CSSProperties
      }>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-[14%] rounded-full bg-gray-100 opacity-20 blur-[17.1875cqw] transition-opacity duration-500",
          hasSelectedSkill ? "opacity-30" : "opacity-10",
        )}
      />

      {isComplete && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-4%] rounded-full bg-white/45 blur-[18.75cqw]"
        />
      )}

      {STONE_ITEMS.map(item => {
        const isSelected = selectedSkillIdSet.has(item.id);
        const Stone = item.Stone;

        return (
          <div
            key={item.id}
            className={cn(
              "absolute size-13 transition-all duration-500 ease-out",
              item.positionClassName,
              isSelected ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}>
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-[-22%] rounded-full blur-[7.8125cqw] transition-opacity duration-500",
                item.glowClassName,
                isSelected ? "opacity-90" : "opacity-0",
                isComplete && "animate-[heart-blur-flash_5.5s_ease-in-out_infinite]",
              )}
              style={
                {
                  "--heart-blur-opacity": 0.72,
                  "--heart-blur-scale": 0.82,
                } as CSSProperties
              }
            />
            <Stone
              role="img"
              aria-label={item.label}
              className="relative z-10 size-full object-contain drop-shadow-[0_0_0.875rem_rgba(255,255,255,0.24)]"
            />
          </div>
        );
      })}
    </div>
  );
};

export default SkillStoneGem;
