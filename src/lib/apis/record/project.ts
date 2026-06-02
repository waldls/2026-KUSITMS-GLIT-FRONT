import { api } from "@/lib/apis/client";
import type {
  GetProjectsParams,
  ProjectCreateResponse,
  ProjectNameRequest,
  ProjectsResponse,
  ProjectSummary,
} from "@/types/record/project";

export type { ProjectCreateResponse, ProjectSummary };

const getProjectsParams = (params?: GetProjectsParams) => {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter((entry): entry is [string, number] => entry[1] !== undefined),
  );
};

// 프로젝트 태그 조회
export const getProjects = (params?: GetProjectsParams) =>
  api.get<ProjectsResponse>("/api/projects", getProjectsParams(params));

// 프로젝트 태그 추가
export const postProjects = (body: ProjectNameRequest) =>
  api.post<ProjectCreateResponse>("/api/projects", body);

// 프로젝트 태그 삭제
export const deleteProjectId = (projectId: number) =>
  api.delete<null>(`/api/projects/${projectId}`);

// 프로젝트 태그 수정
export const patchProjectId = (projectId: number, body: ProjectNameRequest) =>
  api.patch<null>(`/api/projects/${projectId}`, body);
