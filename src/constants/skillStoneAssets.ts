export type SkillStoneId = 1 | 2 | 3 | 4 | 5;

export const SKILL_STONE_ASSETS: Record<
  SkillStoneId,
  { src: string; label: string; width: number; height: number }
> = {
  1: {
    src: "/images/stones/discovery_analysis.png",
    label: "발견/분석 원석",
    width: 144,
    height: 144,
  },
  2: {
    src: "/images/stones/planning_execution.png",
    label: "기획/실행 원석",
    width: 144,
    height: 144,
  },
  3: {
    src: "/images/stones/collaboration.png",
    label: "협업/조율 원석",
    width: 144,
    height: 144,
  },
  4: {
    src: "/images/stones/problem_solving.png",
    label: "문제해결/개선 원석",
    width: 144,
    height: 144,
  },
  5: {
    src: "/images/stones/reflection_growth.png",
    label: "성찰/성장 원석",
    width: 144,
    height: 144,
  },
};

export const HEART_GEM_ASSETS = {
  default: {
    src: "/images/record/gems/heart-default.png",
    width: 256,
    height: 256,
  },
  filled: {
    src: "/images/record/gems/heart-filled.png",
    width: 256,
    height: 256,
  },
} as const;
