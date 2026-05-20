import CollaborationStone from "@/assets/images/report/collaboration_stone.svg";
import DiscoveryAnalysisStone from "@/assets/images/report/discovery_analysis_stone.svg";
import PlanningExecutionStone from "@/assets/images/report/planning_execution_stone.svg";
import ProblemSolvingStone from "@/assets/images/report/problem_solving_stone.svg";
import ReflectionGrowthStone from "@/assets/images/report/reflection_growth_stone.svg";
import type { CompetencyCategory, CompetencyStat } from "@/data/report";

const CATEGORY_META: Record<
  CompetencyCategory,
  { icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }
> = {
  DISCOVERY_ANALYSIS: { icon: DiscoveryAnalysisStone, label: "발견/분석" },
  PLANNING_EXECUTION: { icon: PlanningExecutionStone, label: "기획/실행" },
  PROBLEM_SOLVING: { icon: ProblemSolvingStone, label: "문제해결/개선" },
  COLLABORATION: { icon: CollaborationStone, label: "협업/조율" },
  REFLECTION_GROWTH: { icon: ReflectionGrowthStone, label: "성찰/성장" },
};

interface Props {
  topCategories: CompetencyStat[];
}

const CompetencyStatsSection = ({ topCategories = [] }: Props) => {
  return (
    <div className="bg-gray-850 rounded-12 flex flex-row p-4">
      {topCategories.map(({ category, count }) => {
        const { icon: Icon, label } = CATEGORY_META[category];
        return (
          <div key={category} className="flex flex-1 flex-col items-center">
            <Icon className="size-9" />
            <p className="body-5 pt-0.75 whitespace-nowrap text-gray-400">{label}</p>
            <p className="body-3 text-gray-100">{count}회</p>
          </div>
        );
      })}
    </div>
  );
};

export default CompetencyStatsSection;
