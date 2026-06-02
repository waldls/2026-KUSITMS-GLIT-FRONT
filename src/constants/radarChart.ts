import type { Competency } from "@/types/competency";

export const RADAR_CATEGORIES: { key: Competency; label: string }[] = [
  { key: "DISCOVERY_ANALYSIS", label: "발견/분석" },
  { key: "REFLECTION_GROWTH", label: "성찰/성장" },
  { key: "COLLABORATION", label: "협업/조율" },
  { key: "PROBLEM_SOLVING", label: "문제해결/개선" },
  { key: "PLANNING_EXECUTION", label: "기획/실행" },
];

export const RADAR_COUNT = RADAR_CATEGORIES.length;

export const CHART_MARGIN = 2;
export const OUTER_RADIUS_PERCENT = 70;
export const OUTER_RADIUS = `${OUTER_RADIUS_PERCENT}%`;
export const INNER_RATIO = 0.6;
export const GRID_RATIOS = [0.33, 0.66, 1.0];
export const AXIS_TICK_INSET = 8;
export const AXIS_TICK_GAP = 8;
export const AXIS_STROKE = "var(--gray-700, #999)";
export const AXIS_STROKE_WIDTH = 0.6;
export const INNER_CORNER_ROUNDING = 0.05;
