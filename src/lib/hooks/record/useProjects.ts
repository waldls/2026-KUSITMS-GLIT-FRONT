import { type QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteProjectId,
  patchProjectId,
  postProjects,
  type ProjectCreateResponse,
} from "@/lib/apis/record/project";
import { queryKeys } from "@/lib/query/queryKeys";
import { projectsQueryOptions, type ProjectTag } from "@/lib/query/queryOptions";
import { getProjectIdFromResponse } from "@/lib/utils/projectId";
import { addCreatedProjectTag } from "@/lib/utils/recordCreatedProjectTags";

export type { ProjectTag };

export const projectsQueryKey = queryKeys.projects(0, 100);

export const resolveProjectIdAfterCreate = async (
  queryClient: QueryClient,
  createdProject: ProjectCreateResponse | null,
  name: string,
): Promise<number | null> => {
  const fromResponse = getProjectIdFromResponse(createdProject);
  if (fromResponse !== null) return fromResponse;

  const pickFromCache = () =>
    queryClient.getQueryData<ProjectTag[]>(projectsQueryKey)?.find(tag => tag.name === name)?.id ??
    null;

  const cachedId = pickFromCache();
  if (cachedId !== null) return cachedId;

  await queryClient.refetchQueries({ queryKey: projectsQueryKey });

  return pickFromCache();
};

export const useProjects = () => useQuery(projectsQueryOptions());

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postProjects,
    onSuccess: async (createdProject, variables) => {
      const tagName = createdProject?.name ?? variables.name;
      const createdProjectId = await resolveProjectIdAfterCreate(
        queryClient,
        createdProject,
        tagName,
      );
      if (createdProjectId === null || !tagName) return;

      addCreatedProjectTag({ projectId: createdProjectId, name: tagName });

      queryClient.setQueryData<ProjectTag[]>(projectsQueryKey, currentProjects => {
        if (currentProjects?.some(project => project.id === createdProjectId)) {
          return currentProjects;
        }

        return [
          {
            id: createdProjectId,
            name: tagName,
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
    onMutate: async ({ projectId, name }) => {
      await queryClient.cancelQueries({ queryKey: projectsQueryKey });

      const previous = queryClient.getQueryData<ProjectTag[]>(projectsQueryKey);

      queryClient.setQueryData<ProjectTag[]>(
        projectsQueryKey,
        currentProjects =>
          currentProjects?.map(project =>
            project.id === projectId ? { ...project, name } : project,
          ) ?? [],
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectsQueryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectId,
    onMutate: async projectId => {
      await queryClient.cancelQueries({ queryKey: projectsQueryKey });

      const previous = queryClient.getQueryData<ProjectTag[]>(projectsQueryKey);

      queryClient.setQueryData<ProjectTag[]>(
        projectsQueryKey,
        currentProjects => currentProjects?.filter(project => project.id !== projectId) ?? [],
      );

      return { previous };
    },
    onError: (_error, _projectId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectsQueryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
};
