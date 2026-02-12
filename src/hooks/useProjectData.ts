import { useQuery, useMutation, useQueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { projects as defaultProjects } from '../data/projects';
import type { Project } from '../data/projects';
import { apiService } from '../services/api';

export const projectQueryOptions = queryOptions({
  queryKey: ['projects'],
  queryFn: async () => {
    const data = await apiService.fetchConfig();
    if (!data) return { projects: defaultProjects, etag: 'initial' };
    return data;
  },
  staleTime: 0, // Ensure we always check for new data
});

export const useProjectData = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery(projectQueryOptions);

  const projects = data?.projects ?? defaultProjects;
  const currentEtag = data?.etag;

  const saveMutation = useMutation({
    mutationFn: ({ newProjects, token, etag }: { newProjects: Project[], token: string, etag?: string }) => 
      apiService.saveConfig(newProjects, token, etag),
    onMutate: async ({ newProjects }) => {
      await queryClient.cancelQueries({ queryKey: projectQueryOptions.queryKey });
      const previousConfig = queryClient.getQueryData<typeof data>(projectQueryOptions.queryKey);

      queryClient.setQueryData(projectQueryOptions.queryKey, (old: any) => ({
          ...old,
          projects: newProjects
      }));

      return { previousConfig };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousConfig) {
        queryClient.setQueryData(projectQueryOptions.queryKey, context.previousConfig);
      }
    },
    onSuccess: (newData) => {
      if (newData) {
        queryClient.setQueryData(projectQueryOptions.queryKey, newData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryOptions.queryKey });
    },
  });

  const saveProjects = async (newProjects: Project[], token: string) => {
    return saveMutation.mutateAsync({ newProjects, token, etag: currentEtag ?? undefined });
  };

  return { 
    projects, 
    isLoading, 
    error: error instanceof Error ? error.message : null, 
    refetch, 
    saveProjects,
    isSaving: saveMutation.isPending
  };
}

export const useSuspenseProjectData = () => {
  const { data } = useSuspenseQuery(projectQueryOptions);
  return { projects: data.projects };
};
