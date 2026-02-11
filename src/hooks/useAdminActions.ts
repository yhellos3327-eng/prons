import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { useToast } from '../components/UI/Toast';
import type { Project } from '../data/projects';

export const useAdminActions = (
    saveProjects: (newProjects: Project[], token: string) => Promise<any>,
    refetch: () => void
) => {
    const { addToast } = useToast();
    const [token, setToken] = useState(sessionStorage.getItem('admin_token') || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleLogin = useCallback((newToken: string) => {
        sessionStorage.setItem('admin_token', newToken);
        setToken(newToken);
        addToast('로그인되었습니다.', 'success');
    }, [addToast]);

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem('admin_token');
        setToken('');
        addToast('로그아웃되었습니다.', 'info');
    }, [addToast]);

    const handleFileUpload = useCallback(async (
        id: number,
        field: 'image' | 'video',
        file: File,
        updateProject: (id: number, field: keyof Project, value: any) => void
    ) => {
        try {
            addToast('파일 업로드 중...', 'info');
            const url = await apiService.uploadFile(file, token);
            updateProject(id, field, url);
            addToast('파일 업로드 완료!', 'success');
        } catch (err) {
            console.error(err);
            addToast(`파일 업로드 실패: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
        }
    }, [token, addToast]);

    const handleSave = useCallback(async (localProjects: Project[]) => {
        try {
            setIsSaving(true);
            await saveProjects(localProjects, token);
            addToast('모든 변경사항이 저장되었습니다!', 'success');
            refetch();
        } catch (err) {
            addToast(err instanceof Error ? err.message : '저장 실패', 'error');
        } finally {
            setIsSaving(false);
        }
    }, [token, saveProjects, refetch, addToast]);

    return {
        token,
        isSaving,
        handleLogin,
        handleLogout,
        handleFileUpload,
        handleSave,
    };
}
