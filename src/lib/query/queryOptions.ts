import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getDailyPreview, getMonthly } from "@/lib/apis/calendar/calendar";
import { api } from "@/lib/apis/client";
import { getCompetencyStats, getRadar } from "@/lib/apis/home/home";
import { getProjects, type ProjectSummary } from "@/lib/apis/record/project";
import { getSelectableRecords } from "@/lib/apis/report/report";
import { GC, STALE } from "@/lib/query/queryConfig";
import { queryKeys } from "@/lib/query/queryKeys";
import { getProjectIdFromResponse } from "@/lib/utils/projectId";
import type { CalendarTitlePreview } from "@/types/calendar/calendar";
import type { MonthlyGrassData } from "@/types/home/home";
import type { DailySelectableRecord } from "@/types/report/report";
import type { UserProfile } from "@/types/user/user";

export type ProjectTag = {
  id: number;
  name: string;
  deletable: boolean;
};

export const getMeQueryKey = (accessToken: string | null) =>
  [...queryKeys.me, accessToken ? accessToken.slice(-12) : "anonymous"] as const;

const fetchMe = () => api.get<UserProfile>("/api/users/me");

export const meQueryOptions = (accessToken: string | null, enabled = true) =>
  queryOptions({
    queryKey: getMeQueryKey(accessToken),
    queryFn: fetchMe,
    enabled: enabled && Boolean(accessToken),
    retry: false,
    staleTime: STALE.profile,
    gcTime: STALE.profile,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

const toProjectTag = (project: ProjectSummary): ProjectTag | null => {
  const projectId = getProjectIdFromResponse(project);
  if (projectId === null || !project.name) return null;

  return {
    id: projectId,
    name: project.name,
    deletable: project.deletable ?? false,
  };
};

const isProjectTag = (projectTag: ProjectTag | null): projectTag is ProjectTag =>
  projectTag !== null;

export const projectsQueryOptions = (page = 0, size = 100) =>
  queryOptions({
    queryKey: queryKeys.projects(page, size),
    queryFn: async () => {
      const response = await getProjects({ page, size });
      return response?.projects?.map(toProjectTag).filter(isProjectTag) ?? [];
    },
    staleTime: STALE.list,
  });

export const calendarMonthlyQueryOptions = (monthKey: string) =>
  queryOptions({
    queryKey: queryKeys.calendar.monthly(monthKey),
    queryFn: async () => {
      const data = await getMonthly(monthKey);
      return data?.days ?? [];
    },
    staleTime: STALE.calendar,
    gcTime: GC.calendar,
    placeholderData: keepPreviousData,
  });

export const calendarDailyPreviewQueryOptions = (dateKey: string) =>
  queryOptions({
    queryKey: queryKeys.calendar.dailyPreview(dateKey),
    queryFn: async (): Promise<CalendarTitlePreview[]> => {
      const data = await getDailyPreview(dateKey);
      return data?.titles ?? [];
    },
    enabled: Boolean(dateKey),
    staleTime: STALE.calendar,
    gcTime: GC.calendar,
  });

export const selectableRecordsQueryOptions = (dateKey: string) =>
  queryOptions({
    queryKey: queryKeys.report.selectableByDate(dateKey),
    queryFn: async (): Promise<DailySelectableRecord[]> => {
      const data = await getSelectableRecords(dateKey);
      return data?.starRecords ?? [];
    },
    enabled: Boolean(dateKey),
    staleTime: STALE.reportByDate,
  });

export const competencyStatsQueryOptions = (month: string) =>
  queryOptions({
    queryKey: queryKeys.home.competencyStats(month),
    queryFn: async (): Promise<MonthlyGrassData | null> => {
      try {
        return (await getCompetencyStats(month)) ?? null;
      } catch {
        return null;
      }
    },
    staleTime: STALE.homeStats,
  });

export const radarQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.home.radar,
    queryFn: async () => getRadar(),
    staleTime: STALE.homeStats,
  });
