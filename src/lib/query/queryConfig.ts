/** React Query staleTime / gcTime 팀 공통 기준 */
export const STALE = {
  profile: Infinity,
  list: 1000 * 60 * 5,
  calendar: 1000 * 60 * 2,
  reportByDate: 1000 * 60 * 5,
  homeStats: 1000 * 60 * 10,
} as const;

export const GC = {
  default: 1000 * 60 * 30,
  calendar: 1000 * 60 * 60,
} as const;
