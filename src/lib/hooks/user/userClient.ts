import { type QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import { invalidateMe as invalidateMeQueries } from "@/lib/query/invalidate";
import { meQueryKey } from "@/lib/query/queryKeys";
import { getMeQueryKey, meQueryOptions } from "@/lib/query/queryOptions";
import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types/user/user";

export { getMeQueryKey, meQueryKey };

export const invalidateMe = invalidateMeQueries;

export const updateMeCache = (
  queryClient: QueryClient,
  accessToken: string | null,
  updater: (profile: UserProfile) => UserProfile,
) => {
  const currentProfile = queryClient.getQueryData<UserProfile>(getMeQueryKey(accessToken));

  if (!currentProfile) return;

  const nextProfile = updater(currentProfile);
  queryClient.setQueryData(getMeQueryKey(accessToken), nextProfile);
};

interface UseMeOptions {
  enabled?: boolean;
}

export const useMe = (options?: UseMeOptions) => {
  const accessToken = useAuthStore(state => state.accessToken);
  const enabled = options?.enabled !== false;

  return useQuery(meQueryOptions(accessToken, enabled));
};

export const useInvalidateMe = () => {
  const queryClient = useQueryClient();

  return () => invalidateMe(queryClient);
};
