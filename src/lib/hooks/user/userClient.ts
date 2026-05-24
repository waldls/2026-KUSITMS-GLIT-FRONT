import { type QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types/user/user";

export const meQueryKey = ["me"] as const;

export const getMeQueryKey = (accessToken: string | null) =>
  [...meQueryKey, accessToken ? accessToken.slice(-12) : "anonymous"] as const;

const fetchMeClient = () => api.get<UserProfile>("/api/users/me");

export const invalidateMe = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: meQueryKey });

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

  return useQuery({
    queryKey: getMeQueryKey(accessToken),
    queryFn: fetchMeClient,
    enabled: options?.enabled !== false && !!accessToken,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export const useInvalidateMe = () => {
  const queryClient = useQueryClient();

  return () => invalidateMe(queryClient);
};
