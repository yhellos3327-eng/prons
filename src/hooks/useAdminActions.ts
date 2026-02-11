import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Project } from '../data/projects';

export const useAdminActions = (
    saveProjects: (newProjects: Project[], token: string) => Promise<any>,
    refetch: () => void
) => {
    const [token, setToken] = useState(sessionStorage.getItem('admin_token') || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleLogin = useCallback((newToken: string) => {
        sessionStorage.setItem('admin_token', newToken);
        setToken(newToken);
    }, []);

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem('admin_token');
        setToken('');
    }, []);

    const handleFileUpload = useCallback(async (
        id: number,
        field: 'image' | 'video',
        file: File,
        updateProject: (id: number, field: keyof Project, value: any) => void
    ) => {
        const url = await apiService.uploadFile(file, token);
        updateProject(id, field, url);
        return url;
    }, [token]);

    const handleSave = useCallback(async (localProjects: Project[]) => {
        try {
            setIsSaving(true);
            await saveProjects(localProjects, token);
            refetch();
        } finally {
            setIsSaving(false);
        }
    }, [token, saveProjects, refetch]);

    return {
        token,
        isSaving,
        handleLogin,
        handleLogout,
        handleFileUpload,
        handleSave,
    };
}
