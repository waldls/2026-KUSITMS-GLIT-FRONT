"use client";

import { useQueries, useQuery } from "@tanstack/react-query";

import { competencyStatsQueryOptions, radarQueryOptions } from "@/lib/query/queryOptions";

export const getLastThreeMonths = (): string[] => {
  const now = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
};

export const useCompetencyStatsQueries = (months: string[]) =>
  useQueries({
    queries: months.map(month => competencyStatsQueryOptions(month)),
  });

export const useRadarStats = () => useQuery(radarQueryOptions());
