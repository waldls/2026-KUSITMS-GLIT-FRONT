export type RadarCategory =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

export interface RadarChartData {
  min: number;
  max: number;
  categories: Record<RadarCategory, number>;
}

export const mockRadarChartData: RadarChartData = {
  min: 2,
  max: 7,
  categories: {
    DISCOVERY_ANALYSIS: 5,
    PLANNING_EXECUTION: 3,
    COLLABORATION: 7,
    PROBLEM_SOLVING: 2,
    REFLECTION_GROWTH: 4,
  },
};
