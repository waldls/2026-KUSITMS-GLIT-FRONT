import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import Header from "@/components/common/Header";
import CreateReportForm from "@/containers/report/create/CreateReportForm";
import { getSelectableInfo } from "@/lib/apis/report/report.server";
import { getServerQueryClient } from "@/lib/query/getServerQueryClient";
import { selectableRecordsQueryOptions } from "@/lib/query/queryOptions";
import { getCalendarDateInTimeZone, toDateKey } from "@/lib/utils/calendar";

const page = async () => {
  const info = await getSelectableInfo().catch(() => null);
  if (!info) return null;

  const reportTypeLabel = info.reportType === "MINI" ? "미니" : "커리어";
  const initialDateKey = toDateKey(getCalendarDateInTimeZone());
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery(selectableRecordsQueryOptions(initialDateKey));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full w-full flex-col">
        <Header title={`${reportTypeLabel} 리포트 생성`} />
        <CreateReportForm {...info} initialDateKey={initialDateKey} />
      </div>
    </HydrationBoundary>
  );
};

export default page;
