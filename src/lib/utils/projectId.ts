import type { ProjectCreateResponse, ProjectSummary } from "@/types/record/project";

type ProjectIdSource = ProjectCreateResponse | ProjectSummary | null | undefined;

const toProjectId = (raw: unknown): number | null => {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;

  if (typeof raw === "string" && raw.trim().length > 0) {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const getProjectIdFromResponse = (
  project: ProjectIdSource | number | null | undefined,
): number | null => {
  if (project === null || project === undefined) return null;

  if (typeof project === "number") return toProjectId(project);

  const direct = toProjectId(project.projectId ?? (project as { id?: unknown }).id);
  if (direct !== null) return direct;

  const nested = (project as { project?: ProjectIdSource }).project;
  if (nested) return getProjectIdFromResponse(nested);

  return null;
};
