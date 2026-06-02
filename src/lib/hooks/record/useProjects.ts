import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteProjectId,
  getProjects,
  patchProjectId,
  postProjects,
  type ProjectSummary,
} from "@/lib/apis/record/project";

export type ProjectTag = {
  id: number;
  name: string;
  deletable: boolean;
};

const toProjectTag = (project: ProjectSummary): ProjectTag | null => {
  if (project.projectId == null || !project.name) return null;

  return {
    id: project.projectId,
    name: project.name,
    deletable: project.deletable ?? false,
  };
};

const isProjectTag = (projectTag: ProjectTag | null): projectTag is ProjectTag =>
  projectTag !== null;

const projectsQueryKey = ["projects", { page: 0, size: 100 }] as const;

export const useProjects = () =>
  useQuery({
    queryKey: projectsQueryKey,
    queryFn: async () => {
      const response = await getProjects({ page: 0, size: 100 });

      return response?.projects?.map(toProjectTag).filter(isProjectTag) ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postProjects,
    onSuccess: createdProject => {
      if (!createdProject?.projectId || !createdProject.name) return;

      queryClient.setQueryData<ProjectTag[]>(projectsQueryKey, currentProjects => {
        if (currentProjects?.some(project => project.id === createdProject.projectId)) {
          return currentProjects;
        }

        return [
          {
            id: createdProject.projectId!,
            name: createdProject.name!,
            deletable: true,
          },
          ...(currentProjects ?? []),
        ].slice(0, 100);
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: number; name: string }) =>
      patchProjectId(projectId, { name }),
    onSuccess: (_, { projectId, name }) => {
      queryClient.setQueryData<ProjectTag[]>(
        projectsQueryKey,
        currentProjects =>
          currentProjects?.map(project =>
            project.id === projectId ? { ...project, name } : project,
          ) ?? [],
      );
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectId,
    onSuccess: (_, projectId) => {
      queryClient.setQueryData<ProjectTag[]>(
        projectsQueryKey,
        currentProjects => currentProjects?.filter(project => project.id !== projectId) ?? [],
      );
    },
  });
};
