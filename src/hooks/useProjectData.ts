import { useState, useEffect, useCallback } from 'react';
import { projects as defaultProjects } from '../data/projects';
import type { Project } from '../data/projects';

export function useProjectData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      // API 호출 - 실패 시 기본값 사용 (로컬 개발 환경 등)
      try {
        const response = await fetch('/api/config', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setProjects(data);
          } else {
            setProjects(defaultProjects);
          }
        } else {
          console.warn('Failed to fetch config, using default projects');
          setProjects(defaultProjects);
        }
      } catch (err) {
        console.warn('API fetch error, using default projects:', err);
        setProjects(defaultProjects);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveProjects = async (newProjects: Project[], password: string) => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(newProjects),
      });

      if (!response.ok) {
        throw new Error('저장에 실패했습니다. 비밀번호를 확인해주세요.');
      }

      const result = await response.json();
      setProjects(newProjects); // 낙관적 업데이트
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { projects, isLoading, error, refetch: fetchProjects, saveProjects };
}
