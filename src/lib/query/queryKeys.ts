export const queryKeys = {
  me: ["me"] as const,
  projects: (page = 0, size = 100) => ["projects", { page, size }] as const,
  calendar: {
    all: ["calendar"] as const,
    monthly: (monthKey: string) => ["calendar", "monthly", monthKey] as const,
    dailyPreview: (dateKey: string) => ["calendar", "daily-preview", dateKey] as const,
  },
  report: {
    selectableAll: ["reports", "selectable-records"] as const,
    selectableByDate: (dateKey: string) => ["reports", "selectable-records", dateKey] as const,
  },
  home: {
    competencyStats: (month: string) => ["home", "competency-stats", month] as const,
    radar: ["home", "radar"] as const,
  },
} as const;

/** @deprecated queryKeys.projects(0, 100) 사용 */
export const projectsQueryKey = queryKeys.projects(0, 100);

export const meQueryKey = queryKeys.me;
