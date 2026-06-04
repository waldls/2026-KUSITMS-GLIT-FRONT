import { QueryClient } from "@tanstack/react-query";

import { GC, STALE } from "@/lib/query/queryConfig";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: STALE.list,
        gcTime: GC.default,
      },
    },
  });
