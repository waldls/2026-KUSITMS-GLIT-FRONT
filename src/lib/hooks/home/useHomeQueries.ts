"use client";

import { useQueries, useQuery } from "@tanstack/react-query";

import { competencyStatsQueryOptions, radarQueryOptions } from "@/lib/query/queryOptions";

const MAX_HEATMAP_MONTHS = 3;

const toMonthKey = (year: number, monthIndex: number) => {
  const d = new Date(year, monthIndex, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// 가입 월 ~ 현재 월 범위를 노출하되, 최대 최근 3개월까지만 노출
export const getHeatmapMonths = (joinedAt?: string | null): string[] => {
  const now = new Date();
  const [joinedYear, joinedMonth] = (joinedAt ?? "").split("-").map(Number);
  const monthsSinceJoined =
    joinedYear && joinedMonth
      ? (now.getFullYear() - joinedYear) * 12 + (now.getMonth() + 1 - joinedMonth) + 1
      : MAX_HEATMAP_MONTHS;
  const length = Math.min(Math.max(monthsSinceJoined, 1), MAX_HEATMAP_MONTHS);

  return Array.from({ length }, (_, i) =>
    toMonthKey(now.getFullYear(), now.getMonth() - (length - 1 - i)),
  );
};

export const useCompetencyStatsQueries = (months: string[]) =>
  useQueries({
    queries: months.map(month => competencyStatsQueryOptions(month)),
  });

export const useRadarStats = () => useQuery(radarQueryOptions());
