import { useState, useEffect, useCallback } from 'react';
import { useProjectData } from '../../hooks/useProjectData';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { Project } from '../../data/projects';
import { Login } from './Login';
import { useToast } from '../UI/Toast';
import DashboardHeader from './DashboardHeader';
import ProjectStats from './ProjectStats';
import ProjectList from './ProjectList';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { projects, isLoading: projectsLoading, saveProjects, refetch, isSaving: mutationIsSaving } = useProjectData();
    const { addToast } = useToast();

    useEffect(() => {
        document.body.classList.add('dashboard-active');
        return () => document.body.classList.remove('dashboard-active');
    }, []);

    const [localProjects, setLocalProjects] = useState<Project[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    const handleUpdate = useCallback((id: number, field: keyof Project, value: any) => {
        setLocalProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
        setIsDirty(true);
    }, []);

    const {
        token,
        handleLogin: loginAtHook,
        handleLogout: logoutAtHook,
        handleFileUpload,
        handleSave,
    } = useAdminActions(saveProjects, refetch);

    const handleLogin = (newToken: string) => {
        loginAtHook(newToken);
        addToast('로그인되었습니다.', 'success');
    };

    const handleLogout = () => {
        logoutAtHook();
        addToast('로그아웃되었습니다.', 'info');
    };

    const isSaving = mutationIsSaving;

    // 서버 데이터가 로드되면 로컬 상태에 동기화
    useEffect(() => {
        if (!projectsLoading && !mutationIsSaving && !isDirty) {
            setLocalProjects(projects);
        }
    }, [projects, projectsLoading, mutationIsSaving, isDirty]);

    const handleSaveWithReset = async () => {
        try {
            await handleSave(localProjects);
            setIsDirty(false);
            addToast('모든 변경사항이 저장되었습니다!', 'success');
        } catch (err) {
            addToast(err instanceof Error ? err.message : '저장 실패', 'error');
        }
    };

    const handleDelete = (id: number) => {
        setLocalProjects((prev) => prev.filter((p) => p.id !== id));
        setIsDirty(true);
        addToast('프로젝트가 목록에서 제거되었습니다. (저장 시 반영)', 'info');
    };

    const handleAddProject = () => {
        const newProject: Project = {
            id: Date.now(),
            title: '새 프로젝트',
            description: '',
            image: '',
            tags: [],
        };
        setLocalProjects((prev) => [newProject, ...prev]);
        setIsDirty(true);
        addToast('새 프로젝트가 추가되었습니다.', 'info');
    };

    const onFileUpload = async (id: number, field: 'image' | 'video', file: File) => {
        try {
            addToast('파일 업로드 중...', 'info');
            await handleFileUpload(id, field, file, handleUpdate);
            addToast('파일 업로드 완료!', 'success');
        } catch (err) {
            console.error(err);
            addToast(`파일 업로드 실패: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
        }
    };

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    if (projectsLoading && !isDirty) {
        return (
            <div className={styles.dashboard}>
                <header className={styles.header}>
                    <h1 className={styles.title}>미디어 대시보드</h1>
                </header>
                <div className={styles.loadingContainer}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.skeletonCard}>
                            <div className={styles.skeletonHeader} />
                            <div className={styles.skeletonBody}>
                                <div className={styles.skeletonPreview} />
                                <div className={styles.skeletonContent}>
                                    <div className={styles.skeletonLine} />
                                    <div className={styles.skeletonLine} />
                                    <div className={styles.skeletonLine} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <DashboardHeader
                isSaving={isSaving}
                onAdd={handleAddProject}
                onRefresh={refetch}
                onSave={handleSaveWithReset}
                onLogout={handleLogout}
            />

            <ProjectStats projects={localProjects} />

            <ProjectList
                projects={localProjects}
                onReorder={setLocalProjects}
                onUpdate={handleUpdate}
                onUpload={onFileUpload}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Dashboard;
