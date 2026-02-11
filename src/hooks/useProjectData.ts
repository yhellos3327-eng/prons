import { useQuery, useMutation, useQueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { projects as defaultProjects } from '../data/projects';
import type { Project } from '../data/projects';
import { apiService } from '../services/api';

export const projectQueryOptions = queryOptions({
  queryKey: ['projects'],
  queryFn: async () => {
    const data = await apiService.fetchConfig();
    return Array.isArray(data) ? data : defaultProjects;
  },
});

export const useProjectData = () => {
  const queryClient = useQueryClient();

  const { 
    data: projects = defaultProjects, 
    isLoading, 
    error,
    refetch 
  } = useQuery(projectQueryOptions);

  const saveMutation = useMutation({
    mutationFn: ({ newProjects, token }: { newProjects: Project[], token: string }) => 
      apiService.saveConfig(newProjects, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryOptions.queryKey });
    },
  });

  const saveProjects = async (newProjects: Project[], token: string) => {
    return saveMutation.mutateAsync({ newProjects, token });
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
  const { data: projects } = useSuspenseQuery(projectQueryOptions);
  return { projects };
};
