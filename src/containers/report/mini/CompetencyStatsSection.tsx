import CollaborationStone from "@/assets/images/report/collaboration_stone.svg";
import DiscoveryAnalysisStone from "@/assets/images/report/discovery_analysis_stone.svg";
import PlanningExecutionStone from "@/assets/images/report/planning_execution_stone.svg";
import ProblemSolvingStone from "@/assets/images/report/problem_solving_stone.svg";
import ReflectionGrowthStone from "@/assets/images/report/reflection_growth_stone.svg";
import type { Competency } from "@/types/competency";
import type { CompetencyStat } from "@/types/report/report";

const CATEGORY_META: Record<
  Competency,
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
  const countMap = Object.fromEntries(
    topCategories.map(({ competency, count }) => [competency, count]),
  );

  return (
    <div className="bg-gray-850 rounded-12 flex flex-row p-4">
      {(Object.keys(CATEGORY_META) as Competency[]).map(category => {
        const { icon: Icon, label } = CATEGORY_META[category];
        const count = countMap[category] ?? 0;
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
