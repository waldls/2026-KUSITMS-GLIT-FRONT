import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import CalendarPageClient from "@/app/calendar/CalendarPageClient";
import { getServerQueryClient } from "@/lib/query/getServerQueryClient";
import {
  calendarDailyPreviewQueryOptions,
  calendarMonthlyQueryOptions,
} from "@/lib/query/queryOptions";
import { formatMonthKey, getCalendarDateInTimeZone, toDateKey } from "@/lib/utils/calendar";

const page = async () => {
  const today = getCalendarDateInTimeZone();
  const monthKey = formatMonthKey(today);
  const dateKey = toDateKey(today);
  const queryClient = getServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(calendarMonthlyQueryOptions(monthKey)),
    queryClient.prefetchQuery(calendarDailyPreviewQueryOptions(dateKey)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarPageClient initialDateKey={dateKey} />
    </HydrationBoundary>
  );
};

export default page;
