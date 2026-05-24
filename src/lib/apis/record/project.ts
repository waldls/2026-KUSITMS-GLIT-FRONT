import { api } from "@/api/client";

interface ProjectNameRequest {
  name: string;
}

export interface ProjectCreateResponse {
  projectId?: number;
  name?: string;
}

interface GetProjectsParams {
  page?: number;
  size?: number;
}

export interface ProjectSummary {
  projectId?: number;
  name?: string;
  deletable?: boolean;
}

interface ProjectsResponse {
  page?: number;
  size?: number;
  totalPages?: number;
  projects?: ProjectSummary[];
}

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
export const createProject = (body: ProjectNameRequest) =>
  api.post<ProjectCreateResponse>("/api/projects", body);

// 프로젝트 태그 삭제
export const deleteProject = (projectId: number) => api.delete<null>(`/api/projects/${projectId}`);

// 프로젝트 태그 수정
export const updateProject = (projectId: number, body: ProjectNameRequest) =>
  api.patch<null>(`/api/projects/${projectId}`, body);
