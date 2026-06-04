"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { queryKeys } from "@/lib/query/queryKeys";
import { selectableRecordsQueryOptions } from "@/lib/query/queryOptions";
import type { DailySelectableRecord } from "@/types/report/report";

export type SelectableRecord = DailySelectableRecord & { date: string };

export const useSelectableRecordsByDate = (dateKey: string) =>
  useQuery(selectableRecordsQueryOptions(dateKey));

export const useSelectableRecords = (initialRecords: SelectableRecord[] = [], dateKey: string) => {
  const queryClient = useQueryClient();
  const dateQuery = useSelectableRecordsByDate(dateKey);

  const allRecords = useMemo(() => {
    const byId = new Map<number, SelectableRecord>();

    for (const record of initialRecords) {
      byId.set(record.starRecordId, record);
    }

    const cachedQueries = queryClient.getQueriesData<DailySelectableRecord[]>({
      queryKey: queryKeys.report.selectableAll,
    });

    for (const [queryKey, records] of cachedQueries) {
      if (!records) continue;

      const cachedDateKey = queryKey[2];
      if (typeof cachedDateKey !== "string") continue;

      for (const record of records) {
        if (byId.has(record.starRecordId)) continue;
        byId.set(record.starRecordId, { ...record, date: cachedDateKey });
      }
    }

    if (dateQuery.data) {
      for (const record of dateQuery.data) {
        if (byId.has(record.starRecordId)) continue;
        byId.set(record.starRecordId, { ...record, date: dateKey });
      }
    }

    return Array.from(byId.values());
  }, [dateKey, dateQuery.data, initialRecords, queryClient]);

  return {
    dateRecords: dateQuery.data ?? [],
    allRecords,
    isLoading: dateQuery.isPending,
    isFetching: dateQuery.isFetching,
  };
};
