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
    onMutate: async ({ newProjects }) => {
      // 진행 중인 refetch를 취소하여 낙관적 업데이트 데이터가 덮어씌워지지 않게 함
      await queryClient.cancelQueries({ queryKey: projectQueryOptions.queryKey });

      // 이전 상태 저장 (에러 발생 시 롤백용)
      const previousProjects = queryClient.getQueryData(projectQueryOptions.queryKey);

      // 낙관적으로 캐시 업데이트
      queryClient.setQueryData(projectQueryOptions.queryKey, newProjects);

      return { previousProjects };
    },
    onError: (_err, _variables, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousProjects) {
        queryClient.setQueryData(projectQueryOptions.queryKey, context.previousProjects);
      }
    },
    onSettled: () => {
      // 성공이든 실패든 서버의 최신 데이터로 동기화
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
