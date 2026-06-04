import GlowingSkillStone, { type SkillStoneId } from "@/components/record/stones/GlowingSkillStone";
import type { Competency } from "@/types/competency";
import type { CompetencyStat } from "@/types/report/report";

const CATEGORY_META: Record<Competency, { skillId: SkillStoneId; label: string }> = {
  DISCOVERY_ANALYSIS: { skillId: 1, label: "발견/분석" },
  PLANNING_EXECUTION: { skillId: 2, label: "기획/실행" },
  PROBLEM_SOLVING: { skillId: 4, label: "문제해결/개선" },
  COLLABORATION: { skillId: 3, label: "협업/조율" },
  REFLECTION_GROWTH: { skillId: 5, label: "성찰/성장" },
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
        const { skillId, label } = CATEGORY_META[category];
        const count = countMap[category] ?? 0;
        return (
          <div key={category} className="flex flex-1 flex-col items-center">
            <GlowingSkillStone
              skillId={skillId}
              ariaLabel={label}
              className="size-9"
              blurClassName="inset-[-10%] blur-[16cqw]"
              priority
            />
            <p className="body-5 pt-0.75 whitespace-nowrap text-gray-400">{label}</p>
            <p className="body-3 text-gray-100">{count}회</p>
          </div>
        );
      })}
    </div>
  );
};

export default CompetencyStatsSection;
