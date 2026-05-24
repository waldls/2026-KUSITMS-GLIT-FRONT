import Chip from "@/components/common/Chip";
import { cn } from "@/lib/utils/cn";

export const RECORD_SKILL_TAGS = [
  {
    id: 1,
    label: "발견/분석",
    colorClassName: "bg-tag-200",
    textClassName: "text-white",
  },
  {
    id: 2,
    label: "기획/실행",
    colorClassName: "bg-tag-100",
    textClassName: "text-white",
  },
  {
    id: 4,
    label: "문제해결/개선",
    colorClassName: "bg-tag-400",
    textClassName: "text-white",
  },
  {
    id: 3,
    label: "협업/조율",
    colorClassName: "bg-tag-300",
    textClassName: "text-white",
  },
  {
    id: 5,
    label: "성찰/성장",
    colorClassName: "bg-tag-500",
    textClassName: "text-white",
  },
] as const;

interface SkillTagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  skillId?: number;
}

const SkillTag = ({ skillId, className, children, ...props }: SkillTagProps) => {
  const selectedSkill = RECORD_SKILL_TAGS.find(skill => skill.id === skillId);

  return (
    <Chip
      state="default"
      className={cn(
        "h-7.5 py-0",
        selectedSkill && [
          "border-transparent",
          selectedSkill.colorClassName,
          selectedSkill.textClassName,
        ],
        className,
      )}
      {...props}>
      {children ?? selectedSkill?.label ?? "역량 선택"}
    </Chip>
  );
};

export default SkillTag;
