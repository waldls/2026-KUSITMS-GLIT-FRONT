import type { StaticImageData } from "next/image";

import collaboration from "@/assets/images/stones/collaboration.png";
import discoveryAnalysis from "@/assets/images/stones/discovery_analysis.png";
import planningExecution from "@/assets/images/stones/planning_execution.png";
import problemSolving from "@/assets/images/stones/problem_solving.png";
import reflectionGrowth from "@/assets/images/stones/reflection_growth.png";

export type SkillStoneId = 1 | 2 | 3 | 4 | 5;

export const SKILL_STONE_ASSETS: Record<
  SkillStoneId,
  { src: StaticImageData; label: string; width: number; height: number }
> = {
  1: {
    src: discoveryAnalysis,
    label: "발견/분석 원석",
    width: 144,
    height: 144,
  },
  2: {
    src: planningExecution,
    label: "기획/실행 원석",
    width: 144,
    height: 144,
  },
  3: {
    src: collaboration,
    label: "협업/조율 원석",
    width: 144,
    height: 144,
  },
  4: {
    src: problemSolving,
    label: "문제해결/개선 원석",
    width: 144,
    height: 144,
  },
  5: {
    src: reflectionGrowth,
    label: "성찰/성장 원석",
    width: 144,
    height: 144,
  },
};

import heartDefault from "@/assets/images/record/gems/heart-default.png";
import heartFilled from "@/assets/images/record/gems/heart-filled.png";

export const HEART_GEM_ASSETS = {
  default: {
    src: heartDefault,
    width: 256,
    height: 256,
  },
  filled: {
    src: heartFilled,
    width: 256,
    height: 256,
  },
} as const;
