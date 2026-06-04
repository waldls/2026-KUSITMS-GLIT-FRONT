import CTA from "@/components/common/CTA";
import Tag from "@/components/common/Tag";
import GlowingSkillStone, { type SkillStoneId } from "@/components/record/stones/GlowingSkillStone";

interface StarTask {
  id: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: SkillStoneId;
}

interface StarTaskCompleteProps {
  completedTaskNumber: number;
  completedTaskSkillId: SkillStoneId;
  nextTask: StarTask;
  onNextTaskClick: () => void;
}

const KOREAN_ORDINALS = [
  "첫",
  "두",
  "세",
  "네",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
  "아홉",
  "열",
  "열한",
  "열두",
  "열세",
  "열네",
  "열다섯",
  "열여섯",
  "열일곱",
  "열여덟",
  "열아홉",
  "스무",
] as const;

const StarTaskComplete = ({
  completedTaskNumber,
  completedTaskSkillId,
  nextTask,
  onNextTaskClick,
}: StarTaskCompleteProps) => {
  const completedTaskOrdinal =
    KOREAN_ORDINALS[completedTaskNumber - 1] ?? `${completedTaskNumber}번째`;

  return (
    <section className="flex min-h-full flex-col items-center justify-center py-10">
      <div className="flex flex-col items-center justify-center">
        <GlowingSkillStone
          skillId={completedTaskSkillId}
          animate
          ariaLabel={`${completedTaskOrdinal} 번째 기록 완료 원석`}
          className="size-26.25"
        />
        <p className="head-4 mt-3.75 text-white">{completedTaskOrdinal} 번째 기록 완료!</p>
        <div className="rounded-8 bg-gray-850/60 mt-3 flex flex-col items-center p-3">
          <p className="body-5 text-sea-blue-400">다음 기록 목록</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Tag variant="gray">{nextTask.projectTag}</Tag>
            <span className="body-5 text-gray-200">{nextTask.title}</span>
          </div>
        </div>
      </div>
      <div className="w-full shrink-0 pt-6">
        <CTA onClick={onNextTaskClick}>다음 기록하기</CTA>
      </div>
    </section>
  );
};

export default StarTaskComplete;
