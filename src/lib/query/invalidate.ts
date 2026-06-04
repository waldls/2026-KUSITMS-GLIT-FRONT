import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";

export const invalidateMe = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: queryKeys.me });

export const invalidateProjects = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: queryKeys.projects() });

export const invalidateCalendar = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });

export const invalidateSelectableRecords = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: queryKeys.report.selectableAll });
