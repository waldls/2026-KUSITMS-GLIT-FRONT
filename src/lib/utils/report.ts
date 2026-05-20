import type { CompetencyStat } from "@/data/report";

export const sumCompetencyCount = (topCategories: CompetencyStat[]): number =>
  topCategories.reduce((sum, item) => sum + item.count, 0);

export const getProgressStep = (progress: number): { delay: number; step: number } => {
  if (progress < 20) return { delay: 80, step: 3 };
  if (progress < 50) return { delay: 220, step: 2 };
  if (progress < 75) return { delay: 600, step: 1 };
  if (progress < 90) return { delay: 1400, step: 1 };
  return { delay: 3000, step: 1 };
};
