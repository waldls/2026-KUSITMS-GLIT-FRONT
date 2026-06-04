export interface ProjectNameRequest {
  name: string;
}

export interface ProjectCreateResponse {
  projectId?: number;
  id?: number;
  name?: string;
}

export interface GetProjectsParams {
  page?: number;
  size?: number;
}

export interface ProjectSummary {
  projectId?: number;
  name?: string;
  deletable?: boolean;
}

export interface ProjectsResponse {
  page?: number;
  size?: number;
  totalPages?: number;
  projects?: ProjectSummary[];
}
