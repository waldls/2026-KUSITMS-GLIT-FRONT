import type { Competency } from "@/types/competency";
import type { CompetencyStat } from "@/types/report/report";

const CATEGORY_LABEL: Record<Competency, string> = {
  DISCOVERY_ANALYSIS: "발견/분석",
  PLANNING_EXECUTION: "기획/실행",
  PROBLEM_SOLVING: "문제해결/개선",
  COLLABORATION: "협업/조율",
  REFLECTION_GROWTH: "성찰/성장",
};

interface Props {
  topCategories: CompetencyStat[];
  topDetailTags: string[];
}

const MostRecordSection = ({ topCategories = [], topDetailTags = [] }: Props) => {
  const maxCount = Math.max(...topCategories.map(c => c.count));
  const tops = topCategories.filter(c => c.count === maxCount);
  const topLabel = tops
    .map(c => `${CATEGORY_LABEL[c.competency].replace(/\//g, "⁠/⁠")}⁠(${maxCount}회)`)
    .join(", ");
  const tags = topDetailTags.slice(0, 3).join(", ");

  return (
    <div className="border-linear-100 rounded-8 bg-gray-900 p-4 text-center text-white">
      <p className="break-keep">
        가장 많이 기록한 영역은 <span className="text-sea-blue-400">{topLabel}</span>이에요.
        <br />
        자주 등장한 활동은 <br />
        <span className="text-sea-blue-400">{tags}</span>이에요
      </p>
    </div>
  );
};

export default MostRecordSection;
